import React from 'react';
import { Table, Button, Space, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SyllabusSchedule = ({ 
  schedules, 
  onAdd, 
  onEdit, 
  onDelete 
}) => {
  const columns = [
    {
      title: 'Tuần',
      dataIndex: 'Week',
      key: 'Week',
      width: 80,
      sorter: (a, b) => a.Week - b.Week,
    },
    {
      title: 'Tiêu đề bài học',
      dataIndex: 'LessonTitle',
      key: 'LessonTitle',
      width: 200,
    },
    {
      title: 'Nội dung',
      dataIndex: 'Content',
      key: 'Content',
      width: 300,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'DurationMinutes',
      key: 'DurationMinutes',
      width: 120,
      render: (duration) => (
        <Space>
          <ClockCircleOutlined />
          <span>{duration} phút</span>
        </Space>
      ),
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'Resources',
      key: 'Resources',
      width: 200,
      render: (resources) => (
        <Space wrap>
          {resources.split(',').map((resource, index) => (
            <Tag key={index} color="blue">{resource.trim()}</Tag>
          ))}
        </Space>
      ),
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
            onClick={() => onDelete(record.SyllabusScheduleID)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Lịch trình học tập</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAdd}
        >
          Thêm lịch trình
        </Button>
      </div>

      <Table 
        columns={columns}
        dataSource={schedules}
        rowKey="SyllabusScheduleID"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default SyllabusSchedule; 