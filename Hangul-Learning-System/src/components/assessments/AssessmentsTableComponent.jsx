import React from 'react';
import { Tag, Space, Button, Table, Input, Select } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';

const testStatusMap = {
  Actived: { text: 'Đã duyệt', color: 'green' },
  Drafted: { text: 'Nháp', color: 'default' },
  Pending: { text: 'Chờ duyệt', color: 'orange' },
  Rejected: { text: 'Từ chối', color: 'red' },
  Deleted: { text: 'Đã xóa', color: 'gray' },
};

const testTypeMap = {
  Writing: 'Tự luận',
  Mix: 'Tổng hợp',
  MCQ: 'Trắc nghiệm',
};

const { Search } = Input;
const { Option } = Select;

export function getAssessmentsTableColumns(handlers) {
  const { onView, onEdit, onDelete } = handlers;
  // Static mapping for demo
  
  return [
    {
      title: 'Mã đề kiểm tra',
      dataIndex: 'TestID',
      key: 'TestID',
    },
    {
      title: 'Tên đề kiểm tra',
      dataIndex: 'TestName',
      key: 'TestName',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'SubjectID',
      key: 'SubjectID',
      render: (subjectId) => subjectNameMap[subjectId] || subjectId,
    },
    {
      title: 'Người tạo',
      dataIndex: 'CreateBy',
      key: 'CreateBy',
      render: (accountId) => accountNameMap[accountId] || accountId,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => {
        const { text, color } = testStatusMap[status] || { text: status, color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Loại đề kiểm tra',
      dataIndex: 'TestType',
      key: 'TestType',
      render: (type) => testTypeMap[type] || type,
    },
    {
      title: 'Phân loại',
      dataIndex: 'Category',
      key: 'Category',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => onView(record)}>
            Xem
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button danger size="small" icon={<DeleteOutlined />} onClick={() => onDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
}

export default function AssessmentsTable({
  data,
  onView,
  onEdit,
  onDelete,
  onSendApprove,
  searchText,
  setSearchText,
  statusFilter,
  setStatusFilter,
  onCreate,
}) {
  // Filter + search
  const filteredData = data.filter(item => {
    const matchStatus = statusFilter === 'all' || item.Status === statusFilter;
    const matchSearch =
      (item.testName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.subjectName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.createdByName || '').toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Sắp xếp: Đang hoạt động (Actived) lên đầu
  const sortedData = [
    ...filteredData.filter(item => item.Status === 'Actived'),
    ...filteredData.filter(item => item.Status !== 'Actived'),
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lí bài kiểm tra</h1>
        <Space>
          <Select
            value={statusFilter}
            onChange={value => setStatusFilter(value)}
            style={{ width: 160 }}
          >
            <Option value="Drafted">Nháp</Option>
            <Option value="Pending">Chờ duyệt</Option>
            <Option value="Actived">Đang hoạt động</Option>
            <Option value="Rejected">Từ chối</Option>
            <Option value="Deleted">Đã xóa</Option>
            <Option value="all">Tất cả</Option>
          </Select>
          <Search
            placeholder="Tìm kiếm bài kiểm tra"
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            Tạo bài kiểm tra
          </Button>
        </Space>
      </div>
      <Table
        columns={[
          {
            title: 'Người tạo',
            dataIndex: 'createdByName',
            key: 'createdByName',
          },
          {
            title: 'Môn học',
            dataIndex: 'subjectName',
            key: 'subjectName',
          },
          {
            title: 'Ngày tạo',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (text) => text ? new Date(text).toLocaleString() : '',
          },
          {
            title: 'Trạng thái',
            dataIndex: 'Status',
            key: 'Status',
            render: (status) => {
              if (status === 'Drafted') return <Tag color="default">Nháp</Tag>;
              if (status === 'Pending') return <Tag color="orange">Chờ duyệt</Tag>;
              if (status === 'Actived') return <Tag color="green">Đang hoạt động</Tag>;
              return status;
            },
          },
          
          {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => {
              let userRole = null;
              let user = {};
              try {
                user = JSON.parse(localStorage.getItem('user')) || {};
                userRole = user.role;
              } catch (e) {
                userRole = null;
              }
              // Chỉ cho phép xóa nếu là bài nháp
              const isDraft = record.Status === 'Drafted';
              return (
                <Space>
                  <Button onClick={() => onView(record)}>Xem</Button>
                  {isDraft && (
                    <Button onClick={() => onDelete(record)} danger icon={<DeleteOutlined />} />
                  )}
                </Space>
              );
            },
          },
        ]}
        dataSource={sortedData}
        pagination={{ pageSize: 10 }}
        rowKey="testID"
        scroll={{ x: 1000 }}
      />
    </>
  );
}
