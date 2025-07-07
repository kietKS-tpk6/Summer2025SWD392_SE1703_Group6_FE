import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, message, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    role: undefined,
    gender: undefined,
    status: undefined
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const navigate = useNavigate();

  const fetchUsers = async (page = 1, pageSize = 10, search = '', roleFilter, genderFilter, statusFilter) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.manageAccount.getAccount}`, {
        params: {
          page,
          pageSize,
          search,
          role: roleFilter,
          gender: genderFilter,
          status: statusFilter
        }
      });

      if (response.data.success) {
        const formattedData = response.data.data.items.map((user, index) => ({
          key: index,
          id: index + 1,
          accountID: user.accountID,
          name: `${user.lastName} ${user.firstName}`,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: getRoleName(user.role),
          status: getStatusName(user.status),
          gender: getGenderName(user.gender),
          birthDate: user.birthDate
        }));

        setUsers(formattedData);
        setPagination({
          ...pagination,
          total: response.data.data.totalItems || formattedData.length
        });
      } else {
        message.error('Failed to fetch users');
      }
    } catch (error) {
      message.error('Error fetching users');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 0: return 'Manager';
      case 1: return 'Lecture';
      case 2: return 'Student';
      default: return 'Unknown';
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 0: return 'Đang hoạt động';
      case 1: return 'Không hoạt động';
      default: return 'Unknown';
    }
  };

  const getGenderName = (gender) => {
    switch (gender) {
      case 0: return 'Nam';
      case 1: return 'Nữ';
      default: return 'Unknown';
    }
  };

  useEffect(() => {
    fetchUsers(1, pagination.pageSize, searchText, filters.role, filters.gender, filters.status);
  }, [searchText, filters]);

  const handleTableChange = (pagination) => {
    fetchUsers(pagination.current, pagination.pageSize, searchText, filters.role, filters.gender, filters.status);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
    setPagination({ ...pagination, current: 1 });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" onClick={() => {
            navigate(`/dashboard/profile/${record.accountID}`);
          }}>Xem chi tiết</Button>
          <Button danger size="small">Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lý người dùng</h1>
        <Space>
          <Search
            placeholder="Tìm kiếm người dùng"
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
            onSearch={handleSearch}
            allowClear
          />
          <Select
            placeholder="Vai trò"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => handleFilterChange('role', value)}
          >
            <Option value={0}>Manager</Option>
            <Option value={1}>Lecture</Option>
            <Option value={2}>Student</Option>
          </Select>
          <Select
            placeholder="Giới tính"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => handleFilterChange('gender', value)}
          >
            <Option value={0}>Nam</Option>
            <Option value={1}>Nữ</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ width: 120 }}
            allowClear
            onChange={(value) => handleFilterChange('status', value)}
          >
            <Option value={0}>Đang hoạt động</Option>
            <Option value={1}>Không hoạt động</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm người dùng
          </Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Users;
