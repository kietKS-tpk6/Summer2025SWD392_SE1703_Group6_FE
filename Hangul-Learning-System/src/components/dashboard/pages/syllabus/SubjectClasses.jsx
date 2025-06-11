import React from 'react';
import { Table, Tag, Space, Typography } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SubjectClasses = ({ classes }) => {
  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'classID',
      key: 'classID',
      width: 100,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'className',
      key: 'className',
      width: 200,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'lecturerName',
      key: 'lecturerName',
      width: 150,
      render: (name) => (
        <Space>
          <UserOutlined />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: 'Số học viên',
      key: 'students',
      width: 150,
      render: (_, record) => (
        <span>{record.minStudentAcp} - {record.maxStudentAcp}</span>
      ),
    },
    {
      title: 'Học phí',
      dataIndex: 'priceOfClass',
      key: 'priceOfClass',
      width: 120,
      render: (price) => (
        <span>{price.toLocaleString('vi-VN')} VNĐ</span>
      ),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'teachingStartTime',
      key: 'teachingStartTime',
      width: 150,
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <span>{new Date(date).toLocaleDateString('vi-VN')}</span>
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}></Title>
      </div>
      <Table
        columns={columns}
        dataSource={classes}
        rowKey="classID"
        pagination={false}
      />
    </div>
  );
};

export default SubjectClasses; 