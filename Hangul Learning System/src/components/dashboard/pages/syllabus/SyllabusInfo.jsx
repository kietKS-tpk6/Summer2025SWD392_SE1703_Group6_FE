import React, { useState } from 'react';
import { Descriptions, Button, Space, Tag, Typography, message, Modal, Form, Input } from 'antd';
import { EditOutlined, UserOutlined, CalendarOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../../config/api';

const { Title } = Typography;
const { TextArea } = Input;

const SyllabusInfo = ({ syllabus, onEdit, subject, onSyllabusCreated }) => {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  const handleCreateSyllabus = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalOk = async () => {
    try {
      const values = await createForm.validateFields();
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.accountId) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      const payload = {
        subjectID: subject.code,
        accountID: user.accountId,
        description: values.description,
        note: values.note
      };
      console.log('Creating syllabus with payload:', payload);
      const response = await axios.post(`${API_URL}${endpoints.syllabus.create}`, payload);

      if (response.data) {
        message.success('Tạo giáo trình mới thành công');
        onSyllabusCreated(response.data);
        setIsCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error('Error creating syllabus:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        message.error(`Lỗi server: ${error.response.data?.message || 'Không thể tạo giáo trình mới'}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        message.error('Không nhận được phản hồi từ server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        message.error('Không thể tạo giáo trình mới');
      }
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
            disabled={!subject.isActive}
          >
            Sửa thông tin
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateSyllabus}
            disabled={!subject.isActive}
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

      <Modal
        title="Tạo giáo trình mới"
        open={isCreateModalVisible}
        onOk={handleCreateModalOk}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
        >
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} maxLength={255} />
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <TextArea rows={4} maxLength={255} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SyllabusInfo; 