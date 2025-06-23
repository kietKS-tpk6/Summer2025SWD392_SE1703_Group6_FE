import React from 'react';
import { Tag, Space, Button, Table } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const testStatusMap = {
  Drafted: { text: 'Nháp', color: 'default' },
  Pending: { text: 'Chờ duyệt', color: 'orange' },
  Rejected: { text: 'Từ chối', color: 'red' },
  Actived: { text: 'Đã duyệt', color: 'green' },
  Deleted: { text: 'Đã xóa', color: 'gray' },
};

const testTypeMap = {
  Writing: 'Tự luận',
  Mix: 'Tổng hợp',
  MCQ: 'Trắc nghiệm',
};

export function getAssessmentsTableColumns(handlers) {
  const { onView, onEdit, onDelete } = handlers;
  // Static mapping for demo
  const subjectNameMap = {
    SJ0001: 'Toán học',
    SJ0002: 'Văn học',
    SJ0003: 'Tiếng Anh',
  };
  const accountNameMap = {
    A00000: 'Nguyễn Văn A',
    A00001: 'Trần Thị B',
    A00002: 'Lê Văn C',
  };
  return [
    {
      title: 'Mã bài kiểm tra',
      dataIndex: 'TestID',
      key: 'TestID',
    },
    {
      title: 'Tên bài kiểm tra',
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
      title: 'Loại bài kiểm tra',
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

// Dữ liệu mẫu
const sampleAssessments = [
  {
    TestID: 'T0001',
    TestName: 'Kiểm tra cuối kỳ',
    SubjectID: 'SJ0001',
    CreateBy: 'A00000',
    CreateAt: '2025-06-20T00:53:26.283Z',
    UpdateAt: null,
    Status: 'Drafted',
    TestType: 'Mix',
    Category: 'Final',
  },
  {
    TestID: 'T0002',
    TestName: 'Bài kiểm tra giữa kỳ',
    SubjectID: 'SJ0002',
    CreateBy: 'A00001',
    CreateAt: '2025-06-10T10:00:00.000Z',
    UpdateAt: '2025-06-15T12:00:00.000Z',
    Status: 'Actived',
    TestType: 'MCQ',
    Category: 'Midterm',
  },
  {
    TestID: 'T0003',
    TestName: 'Bài kiểm tra viết',
    SubjectID: 'SJ0003',
    CreateBy: 'A00002',
    CreateAt: '2025-05-01T08:30:00.000Z',
    UpdateAt: null,
    Status: 'Pending',
    TestType: 'Writing',
    Category: 'Other',
  },
];

// Component Table hiển thị dữ liệu mẫu
export default function AssessmentsTable() {
  const handlers = {
    onView: (record) => alert('Xem: ' + record.TestID),
    onEdit: (record) => alert('Sửa: ' + record.TestID),
    onDelete: (record) => alert('Xóa: ' + record.TestID),
  };
  return (
    <Table
      columns={getAssessmentsTableColumns(handlers)}
      dataSource={sampleAssessments}
      rowKey="TestID"
      pagination={{ pageSize: 5 }}
    />
  );
}
