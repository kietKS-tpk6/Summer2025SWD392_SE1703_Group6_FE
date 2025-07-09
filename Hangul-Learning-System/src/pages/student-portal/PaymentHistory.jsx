import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Button } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { getUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

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
    render: (amount) => amount.toLocaleString('vi-VN') + ' ₫',
  },
  {
    title: 'Ngày thanh toán',
    dataIndex: 'paymentDate',
    key: 'paymentDate',
    render: (date) => new Date(date).toLocaleString('vi-VN'),
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'enrolledDate',
    key: 'enrolledDate',
    render: (date) => new Date(date).toLocaleString('vi-VN'),
  },
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
  const navigate = useNavigate();

  const columnsWithAction = [
    ...columns,
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => navigate(`/student/payment-history/${record.paymentID}`, { state: { payment: record } })}>
          Xem chi tiết
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
    axios.get(`${API_URL}api/Refund/history?studentId=${studentId}`)
      .then(res => {
        setData(res.data || []);
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
    </div>
  );
};

export default PaymentHistory; 