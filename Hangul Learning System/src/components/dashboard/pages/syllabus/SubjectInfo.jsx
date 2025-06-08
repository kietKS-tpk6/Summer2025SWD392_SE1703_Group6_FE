import React from 'react';
import { Descriptions, Button, Space, Tag, Typography } from 'antd';
import { EditOutlined, DeleteOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title } = Typography;

const SubjectInfo = ({ subject, onEdit, onDelete }) => {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>{subject.name}</Title>
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Sửa môn học
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          >
            Xóa môn học
          </Button>
        </Space>
      </div>
      
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã môn học">{subject.code}</Descriptions.Item>
        <Descriptions.Item label="Cấp độ">{subject.level}</Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {subject.description}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm đạt tối thiểu">
          {subject.minAverageScoreToPass}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={subject.isActive ? 'green' : 'red'}>
            {subject.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          <Space>
            <CalendarOutlined />
            <span>{new Date(subject.createAt).toLocaleString()}</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default SubjectInfo; 