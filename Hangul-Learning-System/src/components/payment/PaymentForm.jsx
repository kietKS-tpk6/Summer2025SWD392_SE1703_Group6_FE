import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import { Card, Typography, Spin, Alert, Space, Button, message } from 'antd';
import { QrcodeOutlined, LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PaymentForm = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  const student = JSON.parse(localStorage.getItem('user'));
  const studentAccountId = student?.accountId;
  
  if (!studentAccountId) {
    return (
      <Alert
        message="Yêu cầu đăng nhập"
        description="Bạn cần đăng nhập để thực hiện thanh toán."
        type="warning"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate("/login")}>
            Đăng nhập
          </Button>
        }
      />
    );
  }

  useEffect(() => {
    let intervalId;
  
    const createPaymentAndFetchQR = async () => {
      setLoading(true);
      let paymentId = '';
  
      try {
        // Tạo thanh toán
        const createRes = await axios.post(`${API_URL}${endpoints.payment.create}`, {
          accountID: studentAccountId,
          classID: classId,
          description: "Thanh toán học phí"
        });
        console.log("Created payment:", createRes.data);
        paymentId = createRes.data.paymentID;
        setPaymentInfo({ paymentId }); 
  
        // Lấy mã QR
        const qrRes = await axios.get(`${API_URL}api/Payment/qr/${paymentId}`);
        const rawQrUrl = qrRes.data.qrCodeUrl;
        const cleanQrUrl = rawQrUrl.replace(/amount=(\d+)\.(\d{2})/, (_, intPart, decimal) => {
          return `amount=${intPart}${decimal}`;
        });
        setQrUrl(cleanQrUrl);
        console.log("QR code:", cleanQrUrl);
  
        // Kiểm tra trạng thái lần đầu
        const statusRes = await axios.get(`${API_URL}api/Payment/status/${paymentId}`);
        if (statusRes.data.status === 0) {
          try {
            await axios.post(`${API_URL}api/Enrollment/create`, {
              paymentID: paymentId,
              studentID: studentAccountId,
              classID: classId
            });
            message.success('Thanh toán và đăng ký thành công!');
            navigate(`/payment-success`);
            return;
          } catch (enrollErr) {
            setError('Thanh toán thành công nhưng đăng ký lớp thất bại. Vui lòng liên hệ hỗ trợ.');
            return;
          }
        }
  
        intervalId = setInterval(async () => {
          try {
            const res = await axios.get(`${API_URL}api/Payment/status/${paymentId}`);
            const updatedStatus = res.data.status;
            console.log('Status trả về:', updatedStatus);
  
            if (updatedStatus === 0) {
              clearInterval(intervalId);
              setIsPolling(false);
              try {
                await axios.post(`${API_URL}api/Enrollment/create`, {
                  paymentID: paymentId,
                  studentID: studentAccountId,
                  classID: classId
                });
                message.success('Thanh toán và đăng ký thành công!');
                navigate(`/payment-success`);
              } catch (enrollErr) {
                setError('Thanh toán thành công nhưng đăng ký lớp thất bại. Vui lòng liên hệ hỗ trợ.');
              }
            }
          } catch (pollError) {
            console.error("Polling error:", pollError.response?.data || pollError.message);
          }
        }, 4000);
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    createPaymentAndFetchQR();

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [classId, studentAccountId, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <Text style={{ display: 'block', marginTop: '16px' }}>Đang tạo mã thanh toán...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi thanh toán"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card 
      style={{ 
        maxWidth: 600, 
        margin: '40px auto',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <Title level={2}>Thanh toán học phí</Title>
        
        <div style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          {qrUrl && (
            <img 
              src={qrUrl} 
              alt="QR code" 
              style={{ 
                width: 250, 
                height: 250, 
                marginBottom: '20px',
                borderRadius: '8px'
              }} 
            />
          )}
        </div>

        <Space direction="vertical" size="small">
          <Text strong>Mã thanh toán:</Text>
          <Text copyable style={{ fontSize: '16px' }}>{paymentInfo?.paymentId}</Text>
        </Space>

        <Alert
          message="Hướng dẫn thanh toán"
          description="Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn để hoàn tất giao dịch."
          type="info"
          showIcon
          icon={<QrcodeOutlined />}
        />

        {isPolling && (
          <Text type="secondary">
            Đang kiểm tra trạng thái thanh toán...
          </Text>
        )}
      </Space>
    </Card>
  );
};


export default PaymentForm;
