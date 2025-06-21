import React from 'react';
import { Table, Button, Space, Typography, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SyllabusSchedule = ({ 
  schedules, 
  onAdd, 
  onEdit, 
  onDelete,
  subject,
  canEdit = false
}) => {
  // Add a sequential slot number for display
  const dataWithSlot = schedules.map((item, idx) => ({ ...item, displaySlot: idx + 1 }));

  // Calculate rowSpan for week merging
  const weekRowSpan = [];
  let lastWeek = null;
  let count = 0;
  dataWithSlot.forEach((item, idx) => {
    if (item.week !== lastWeek) {
      // Count how many consecutive rows have the same week
      count = dataWithSlot.filter(x => x.week === item.week).length;
      weekRowSpan[idx] = count;
      lastWeek = item.week;
      count = 0;
    } else {
      weekRowSpan[idx] = 0;
    }
  });

  const columns = [
    {
      title: 'Tuần',
      dataIndex: 'week',
      key: 'week',
      width: 80,
      sorter: (a, b) => a.week - b.week,
      render: (text, record, index) => {
        const rowSpan = weekRowSpan[index];
        return {
          children: text,
          props: { rowSpan }
        };
      }
    },
    {
      title: 'Slot',
      dataIndex: 'displaySlot',
      key: 'displaySlot',
      width: 100,
    },
    {
      title: 'Tiêu đề bài học',
      dataIndex: 'lessonTitle',
      key: 'lessonTitle',
      width: 200,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: 300,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
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
      dataIndex: 'resources',
      key: 'resources',
      width: 200,
      render: (resources) => (
        <Space wrap>
          {(resources && typeof resources === 'string')
            ? resources.split(';').map((resource, index) => (
                <Tag key={index} color="blue">{resource.trim()}</Tag>
              ))
            : <span>-</span>
          }
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit && onEdit(record)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      <Table
        columns={columns}
        dataSource={dataWithSlot}
        rowKey="syllabusScheduleID"
        pagination={false}
      />
    </div>
  );
};

export default SyllabusSchedule; 