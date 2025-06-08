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
          {syllabus?.SyllabusID || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Mã môn học">
          {syllabus?.SubjectID || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={
            syllabus?.Status === 'Draft' ? 'orange' :
            syllabus?.Status === 'Published' ? 'green' :
            syllabus?.Status === 'Archived' ? 'red' : 'default'
          }>
            {syllabus?.Status === 'Draft' ? 'Bản nháp' :
             syllabus?.Status === 'Published' ? 'Đã xuất bản' :
             syllabus?.Status === 'Archived' ? 'Đã lưu trữ' : 
             syllabus?.Status || 'Chưa có thông tin'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {syllabus?.Description || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>
          {syllabus?.Note || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Người tạo">
          <Space>
            <UserOutlined />
            <span>{syllabus?.Creator?.FullName || syllabus?.CreateBy || '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          <Space>
            <CalendarOutlined />
            <span>{syllabus?.CreateAt ? new Date(syllabus.CreateAt).toLocaleString() : '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Người cập nhật">
          <Space>
            <UserOutlined />
            <span>{syllabus?.Updater?.FullName || syllabus?.UpdateBy || '-'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          <Space>
            <CalendarOutlined />
            <span>{syllabus?.UpdateAt ? new Date(syllabus.UpdateAt).toLocaleString() : '-'}</span>
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default SyllabusInfo; 