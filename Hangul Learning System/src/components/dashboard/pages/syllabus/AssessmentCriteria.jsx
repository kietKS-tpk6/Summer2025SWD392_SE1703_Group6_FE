import React from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Enums for Category and TestType
const CategoryEnum = {
  0: 'Midterm',
  1: 'FifteenMinutes',
  2: 'Final',
  3: 'Other'
};

const TestTypeEnum = {
  0: 'MCQ',
  1: 'Writing',
  2: 'Speaking',
  3: 'Listening',
  4: 'Reading',
  5: 'Mix',
  6: 'Other'
}

const AssessmentCriteria = ({ 
  assessmentCriteria, 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  const columns = [
    {
      title: 'Loại đánh giá',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category) => CategoryEnum[category] || category
    },
    {
      title: 'Trọng số (%)',
      dataIndex: 'weightPercent',
      key: 'weightPercent',
      width: 120,
    },
    {
      title: 'Số lượng yêu cầu',
      dataIndex: 'requiredCount',
      key: 'requiredCount',
      width: 150,
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
      width: 150,
    },
    {
      title: 'Loại bài kiểm tra',
      dataIndex: 'testType',
      key: 'testType',
      width: 150,
      render: (testType) => TestTypeEnum[testType] || testType
    },
    {
      title: 'Điểm đạt tối thiểu',
      dataIndex: 'minPassingScore',
      key: 'minPassingScore',
      width: 150,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      width: 200,
      render: (note) => note || '-'
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              console.log('Record to delete:', record);
              onDelete(record.id || record.assessmentCriteriaID);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Tiêu chí đánh giá</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          Thêm tiêu chí
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={assessmentCriteria}
        rowKey="assessmentCriteriaID"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default AssessmentCriteria; 