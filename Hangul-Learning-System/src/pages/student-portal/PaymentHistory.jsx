import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button, Modal, Descriptions } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { getUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';

const statusMap = {
  0: 'Đã thanh toán',
  1: 'Đang chờ',
  2: 'Yêu cầu hoàn tiền',
  3: 'Đã hoàn tiền',
};

const columns = [
  {
    title: 'Mã giao dịch',
    dataIndex: 'paymentID',
    key: 'paymentID',
  },
  {
    title: 'Tên lớp',
    dataIndex: 'className',
    key: 'className',
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => amount?.toLocaleString('vi-VN') + ' ₫',
  },
  {
    title: 'Ngày thanh toán',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
    render: (date) => date ? new Date(date).toLocaleString('vi-VN') : '',
  },
  // Bỏ cột ngày đăng ký vì không có trong response mới
  // {
  //   title: 'Ngày đăng ký',
  //   dataIndex: 'enrolledDate',
  //   key: 'enrolledDate',
  //   render: (date) => new Date(date).toLocaleString('vi-VN'),
  // },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => statusMap[status] || 'Không xác định',
  },
];

const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate(); // Không cần nữa
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const columnsWithAction = [
    ...columns,
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedPayment(record);
            setModalOpen(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const user = getUser();
    const studentId = user?.accountId;
    if (!studentId) {
      setError('Không tìm thấy thông tin sinh viên.');
      setLoading(false);
      return;
    }
    axios.get(`${API_URL}api/Payment/history/${studentId}`)
      .then(res => {
        // Map lại các trường dữ liệu cho đúng với frontend
        const rawData = Array.isArray(res.data.data) ? res.data.data : [];
        const mappedData = rawData.map(item => ({
          paymentID: item.paymentId,
          className: item.className,
          amount: item.total,
          paymentDate: item.paidAt,
          status: item.paymentStatus,
        }));
        setData(mappedData);
        setLoading(false);
      })
      .catch(err => {
        setError('Không thể tải lịch sử thanh toán.');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Lịch sử thanh toán</h1>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Spin spinning={loading} tip="Đang tải...">
        <Table
          columns={columnsWithAction}
          dataSource={data}
          rowKey="paymentID"
          pagination={{ pageSize: 10 }}
        />
      </Spin>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        title="Chi tiết thanh toán"
      >
        {selectedPayment && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Mã giao dịch">{selectedPayment.paymentID}</Descriptions.Item>
            <Descriptions.Item label="Tên lớp">{selectedPayment.className}</Descriptions.Item>
            <Descriptions.Item label="Số tiền">{selectedPayment.amount?.toLocaleString('vi-VN')} ₫</Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán">{selectedPayment.paymentDate ? new Date(selectedPayment.paymentDate).toLocaleString('vi-VN') : ''}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{statusMap[selectedPayment.status] || 'Không xác định'}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default PaymentHistory; 