import React from 'react';
import { Table, Tag } from 'antd';

export const mockPaymentTable = [
  {
    PaymentID: "PM0001",
    StudentName: "Nguyễn Văn A",
    Subject: "Sơ cấp 1",
    Amount: 1200000,
    Method: "Chuyển khoản",
    Status: "Success",
    PaidAt: "2025-06-15",
  },
  {
    PaymentID: "PM0002",
    StudentName: "Trần Thị B",
    Subject: "Trung cấp 1",
    Amount: 1350000,
    Method: "Tiền mặt",
    Status: "Pending",
    PaidAt: "2025-06-17",
  },
  {
    PaymentID: "PM0003",
    StudentName: "Lê Văn C",
    Subject: "Sơ cấp 2",
    Amount: 1200000,
    Method: "Momo",
    Status: "Refunded",
    PaidAt: "2025-06-20",
  },
  {
    PaymentID: "PM0004",
    StudentName: "Phạm Thị D",
    Subject: "Ôn thi TOPIK",
    Amount: 2000000,
    Method: "Chuyển khoản",
    Status: "Success",
    PaidAt: "2025-07-01",
  },
];

const statusColor = {
  Success: 'green',
  Pending: 'gold',
  Refunded: 'red',
};

const columns = [
  {
    title: 'Mã giao dịch',
    dataIndex: 'PaymentID',
    key: 'PaymentID',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Học viên',
    dataIndex: 'StudentName',
    key: 'StudentName',
    width: 160,
  },
  {
    title: 'Môn học',
    dataIndex: 'Subject',
    key: 'Subject',
    width: 140,
  },
  {
    title: 'Số tiền',
    dataIndex: 'Amount',
    key: 'Amount',
    align: 'right',
    render: (amount) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }),
    width: 120,
  },
  {
    title: 'Phương thức',
    dataIndex: 'Method',
    key: 'Method',
    width: 120,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'Status',
    key: 'Status',
    render: (status) => <Tag color={statusColor[status] || 'default'}>{status}</Tag>,
    width: 110,
  },
  {
    title: 'Ngày thanh toán',
    dataIndex: 'PaidAt',
    key: 'PaidAt',
    render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    width: 130,
  },
];

const PaymentTable = ({ data = mockPaymentTable }) => {
  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px 0 rgba(24,144,255,0.04)', padding: 20 }}>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 16, color: '#1890ff' }}>Danh sách giao dịch thanh toán</div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="PaymentID"
        pagination={{ pageSize: 6 }}
        scroll={{ x: 900 }}
        bordered
        size="middle"
      />
    </div>
  );
};

export default PaymentTable; 