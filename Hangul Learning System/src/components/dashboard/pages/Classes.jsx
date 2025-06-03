import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const { Search } = Input;

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchClasses = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/Class/get-all-paginated`, {
        params: {
          page,
          pageSize,
        },
      });
      const { items, totalItems } = response.data;
      setClasses(items);
      setPagination({
        ...pagination,
        current: page,
        total: totalItems,
      });
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleTableChange = (pagination) => {
    fetchClasses(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Mã lớp',
      dataIndex: 'classID',
      key: 'classID',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Giáo viên',
      dataIndex: 'lecturerName',
      key: 'lecturerName',
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Số học viên',
      key: 'students',
      render: (_, record) => `${record.minStudentAcp}-${record.maxStudentAcp}`,
    },
    {
      title: 'Học phí',
      dataIndex: 'priceOfClass',
      key: 'priceOfClass',
      render: (price) => `${price.toLocaleString('vi-VN')}.000 VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
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
      <Table 
        columns={columns} 
        dataSource={classes}
        rowKey="classID"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Classes; 