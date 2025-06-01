import React from 'react';
import { Table, Button, Space, Input, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';

const { Search } = Input;

const Classes = () => {
  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: 'Học viên',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: 'Lịch học',
      dataIndex: 'schedule',
      key: 'schedule',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small">Sửa</Button>
          <Button size="small">Xem chi tiết</Button>
          <Button danger size="small">Xóa</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: 'C001',
      name: 'Tiếng Hàn Sơ Cấp 1',
      teacher: 'Kim Min-ji',
      students: 15,
      schedule: 'Thứ 3, 5, 7 - 18:00-20:00',
      status: 'Đang hoạt động',
    },
    // Add more sample data as needed
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lí lớp học</h1>
        <Space>
          <Search
            placeholder="Tìm kiếm lớp học"
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm lớp học mới
          </Button>
        </Space>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default Classes; 