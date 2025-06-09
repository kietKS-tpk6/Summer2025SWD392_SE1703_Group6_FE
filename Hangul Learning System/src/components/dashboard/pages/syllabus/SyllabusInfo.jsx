import React from 'react';
import { Descriptions, Button, Space, Tag, Typography, message } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../../config/api';

const { Title } = Typography;

const SyllabusInfo = ({ syllabus, onEdit, subject, onSyllabusCreated }) => {
  const handleCreateSyllabus = async () => {
    try {
      const response = await axios.post(`${API_URL}${endpoints.syllabus.create}`, {
        SubjectID: subject.code,
        Description: 'Giáo trình mới',
        Note: '',
        Status: 'Draft'
      });

      if (response.data) {
        message.success('Tạo giáo trình mới thành công');
        onSyllabusCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating syllabus:', error);
      message.error('Không thể tạo giáo trình mới');
    }
  };

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={3} style={{ margin: 0 }}>Thông tin giáo trình</Title>
        {syllabus ? (
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Sửa thông tin
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateSyllabus}
          >
            Tạo giáo trình mới
          </Button>
        )}
      </div>

      <Descriptions bordered column={2}>
        <Descriptions.Item label="Mã giáo trình">
          {syllabus?.syllabusID || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Mã môn học">
          {syllabus?.subjectID || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={
            syllabus?.status === 'Drafted' ? 'orange' :
            syllabus?.status === 'Published' ? 'green' :
            syllabus?.status === 'Archived' ? 'red' : 'default'
          }>
            {syllabus?.status === 'Drafted' ? 'Bản nháp' :
             syllabus?.status === 'Published' ? 'Đã xuất bản' :
             syllabus?.status === 'Archived' ? 'Đã lưu trữ' : 
             syllabus?.status || 'Chưa có thông tin'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {syllabus?.description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>
          {syllabus?.note || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          <Space>
            <UserOutlined />
            <span>{syllabus?.createBy || '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          <Space>
            <CalendarOutlined />
            <span>{syllabus?.createAt ? new Date(syllabus.createAt).toLocaleString() : '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Người cập nhật">
          <Space>
            <UserOutlined />
            <span>{syllabus?.updateBy || '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          <Space>
            <CalendarOutlined />
            <span>{syllabus?.updateAt ? new Date(syllabus.updateAt).toLocaleString() : '-'}</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default SyllabusInfo; 