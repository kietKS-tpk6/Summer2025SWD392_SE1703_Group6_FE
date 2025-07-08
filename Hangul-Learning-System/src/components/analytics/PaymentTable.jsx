import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';

const statusColor = {
  Paid: 'green',
  Pending: 'gold',
  Refunded: 'red',
};

const columns = [
  {
    title: 'Mã giao dịch',
    dataIndex: 'paymentID',
    key: 'paymentID',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Học viên',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 160,
  },
  {
    title: 'Lớp học',
    dataIndex: 'className',
    key: 'className',
    width: 140,
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    align: 'right',
    render: (amount, record) => {
      if (record.status === 'Refunded') {
        return `- ${amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })}`;
      }
      return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
    },
    width: 120,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
    width: 110,
  },
  {
    title: 'Ngày thanh toán',
    dataIndex: 'paidAt',
    key: 'paidAt',
    render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    width: 130,
  },
];

const PaymentTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchPayments = async (pageNum = 1, pageSz = 10) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL + endpoints.analytic.paymentTable}?page=${pageNum}&pageSize=${pageSz}`);
      const result = res.data.data;
      setData(result.items);
      setTotal(result.totalItems);
    } catch (err) {
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page, pageSize);
  }, [page, pageSize]);

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(24,144,255,0.04)', padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#1890ff' }}>Danh sách giao dịch thanh toán</div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="paymentID"
        loading={loading}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 50],
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
          showTotal: (total) => `Tổng cộng ${total} giao dịch`,
        }}
        scroll={{ x: 900 }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default PaymentTable; 