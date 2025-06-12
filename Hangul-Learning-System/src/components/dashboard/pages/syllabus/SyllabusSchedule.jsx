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
  // Lấy role từ localStorage
  let role = null;
  try {
    role = localStorage.getItem('role') || (JSON.parse(localStorage.getItem('user'))?.role);
  } catch (e) {}

  const weekGroups = schedules.reduce((acc, item) => {
    const week = item.week;
    if (!acc[week]) acc[week] = [];
    acc[week].push(item);
    return acc;
  }, {});

  const sortedWeeks = Object.keys(weekGroups).sort((a, b) => a - b);

  // Xác định role
  const isStudent = role === 'Student';
  const isLecturer = role === 'Lecturer';
  const isManager = role === 'Manager';

  const columns = [
    {
      title: 'Tuần',
      dataIndex: 'week',
      key: 'Week',
      width: 80,
      sorter: (a, b) => a.week - b.week,
    },
    {
      title: 'Tiêu đề bài học',
      dataIndex: 'lessonTitle',
      key: 'LessonTitle',
      width: 200,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'Content',
      width: 300,
    },
    {
      title: 'Slot',
      dataIndex: 'slot',
      key: 'slot',
      width: 100,
    },
    {
      title: 'Thời lượng',
      dataIndex: 'durationMinutes',
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
      dataIndex: 'resources',
      key: 'Resources',
      width: 200,
      render: (resources) => (
        <Space wrap>
          {typeof resources === 'string' && resources.length > 0
            ? resources.split(',').map((resource, index) => (
                <Tag key={index} color="blue">{resource.trim()}</Tag>
              ))
            : <Tag color="default">Không có</Tag>
          }
        </Space>
      ),
    },
    // Thao tác chỉ hiện nếu không phải Student
    !isStudent && {
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
            onClick={() => onDelete(record.syllabusScheduleID)}
          />
        </Space>
      ),
    },
  ].filter(Boolean);

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>Lịch trình học tập</Title>
        {/* Nút thêm chỉ hiện nếu không phải Student hoặc Lecturer */}
        {!isStudent && !isLecturer && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
          >
            Thêm lịch trình
          </Button>
        )}
      </div>

      {/* Hiển thị group theo tuần cho Student, Lecturer, Manager */}
      {(isStudent || isLecturer || isManager) && (
        <>
          {sortedWeeks.length === 0 && <div style={{ color: '#888' }}>Chưa có lịch trình học.</div>}
          {sortedWeeks.map(week => (
            <div key={week} style={{ marginBottom: 24, borderRadius: 10, boxShadow: '0 2px 8px #f0f1f2', background: '#fff', padding: 16 }}>
              <Title level={4} style={{ color: '#fbb040', marginBottom: 12 }}>Tuần {week}</Title>
              {weekGroups[week].map(item => (
                <div key={item.syllabusScheduleID} style={{ borderBottom: '1px solid #f5f5f5', padding: '8px 0' }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{item.lessonTitle}</div>
                  <div style={{ color: '#555', margin: '4px 0 2px 0' }}><b>Nội dung:</b> {item.content}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 2 }}>
                    <Space><ClockCircleOutlined /> {item.durationMinutes} phút</Space>
                    {item.resources && item.resources.split(',').map((r, i) => (
                      <Tag key={i} color="blue">{r.trim()}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Table chỉ hiện cho Manager */}
      {isManager && (
        <Table 
          columns={columns}
          dataSource={schedules}
          rowKey="syllabusScheduleID"
          pagination={false}
          scroll={{ x: 'max-content' }}
        />
      )}
    </div>
  );
};

export default SyllabusSchedule; 