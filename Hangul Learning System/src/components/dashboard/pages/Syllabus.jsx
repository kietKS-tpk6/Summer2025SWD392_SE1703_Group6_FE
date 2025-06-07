import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Divider, Table, Tag, Space, Modal, Form, Input, InputNumber, message, Descriptions, Select } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

const Syllabus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const subject = location.state?.subject;
  const [syllabus, setSyllabus] = useState(null);
  const [syllabusSchedules, setSyllabusSchedules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [subjectForm] = Form.useForm();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      fetchSyllabus();
    }
  }, [subject]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getBySubject}/${subject.code}`);
      if (response.data) {
        setSyllabus(response.data);
        setSyllabusSchedules(response.data.syllabusSchedules || []);
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      message.error('Không thể tải thông tin giáo trình');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSchedule(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lịch trình này?',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}${endpoints.syllabus.deleteSchedule}/${id}`);
          message.success('Xóa lịch trình thành công');
          fetchSyllabus();
        } catch (error) {
          console.error('Error deleting schedule:', error);
          message.error('Không thể xóa lịch trình');
        }
      },
    });
  };
  
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingSchedule) {
        await axios.put(`${API_URL}${endpoints.syllabus.updateSchedule}/${editingSchedule.SyllabusScheduleID}`, values);
        message.success('Cập nhật lịch trình thành công');
      } else {
        await axios.post(`${API_URL}${endpoints.syllabus.addSchedule}`, {
          ...values,
          SyllabusID: syllabus.SyllabusID
        });
        message.success('Thêm lịch trình thành công');
      }
      setIsModalVisible(false);
      fetchSyllabus();
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('Không thể lưu lịch trình');
    }
  };

  const handleSubjectEdit = () => {
    subjectForm.setFieldsValue({
      name: subject.name,
      description: subject.description,
      minAverageScoreToPass: subject.minAverageScoreToPass
    });
    setIsSubjectModalVisible(true);
  };

  const handleSubjectDelete = () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const subjectId = subject.id || subject.code;
      await axios.delete(`${API_URL}${endpoints.manageSubject.delete}${subjectId}`);
      message.success('Xóa môn học thành công');
      navigate('/dashboard/subject');
    } catch (error) {
      console.error('Error deleting subject:', error);
      message.error('Không thể xóa môn học. Vui lòng thử lại.');
    } finally {
      setDeleteModalVisible(false);
    }
  };

  const handleSubjectModalOk = async () => {
    try {
      const values = await subjectForm.validateFields();
      const response = await axios.put(`${API_URL}${endpoints.manageSubject.update}`, {
        subjectID: subject.id,
        subjectName: values.name,
        description: values.description,
        isActive: true,
        minAverageScoreToPass: values.minAverageScoreToPass || 0
      });

      if (response.data) {
        const updatedSubject = {
          ...subject,
          name: values.name,
          description: values.description,
          minAverageScoreToPass: values.minAverageScoreToPass || 0
        };
        navigate(location.pathname, { state: { subject: updatedSubject }, replace: true });
        message.success('Cập nhật môn học thành công');
        setIsSubjectModalVisible(false);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      message.error('Không thể cập nhật môn học. Vui lòng thử lại.');
    }
  };

  if (!subject) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>Không tìm thấy thông tin môn học</Title>
        <Button 
          type="primary" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/subject')}
        >
          Quay lại
        </Button>
      </div>
    );
  }

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
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.SyllabusScheduleID)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button 
        type="primary" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/dashboard/subject')}
        style={{ marginBottom: '16px' }}
      >
        Quay lại
      </Button>

      <Card loading={loading}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={2}>{subject.name}</Title>
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleSubjectEdit}
            >
              Sửa môn học
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleSubjectDelete}
            >
              Xóa môn học
            </Button>
          </Space>
        </div>
        
        <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
          <Descriptions.Item label="Mã môn học">{subject.code}</Descriptions.Item>
          <Descriptions.Item label="Cấp độ">{subject.level}</Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            {subject.description}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" span={2}>
            {subject.note}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={subject.status === 'published' ? 'green' : 'orange'}>
              {subject.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            <Space>
              <UserOutlined />
              <span>{subject.createBy}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            <Space>
              <CalendarOutlined />
              <span>{new Date(subject.createAt).toLocaleString()}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            <Space>
              <CalendarOutlined />
              <span>{subject.updateAt ? new Date(subject.updateAt).toLocaleString() : 'Chưa cập nhật'}</span>
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Divider />
        
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>Lịch trình học tập</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm lịch trình
          </Button>
        </div>

        <Table 
          columns={columns}
          dataSource={syllabusSchedules}
          rowKey="SyllabusScheduleID"
          pagination={false}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </Card>

      <Modal
        title={editingSchedule ? 'Sửa lịch trình' : 'Thêm lịch trình mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="Week"
            label="Tuần"
            rules={[{ required: true, message: 'Vui lòng nhập tuần' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="LessonTitle"
            label="Tiêu đề bài học"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học' }]}
          >
            <Input maxLength={100} />
          </Form.Item>
          <Form.Item
            name="Content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} maxLength={255} />
          </Form.Item>
          <Form.Item
            name="DurationMinutes"
            label="Thời lượng (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="Resources"
            label="Tài nguyên"
            rules={[{ required: true, message: 'Vui lòng nhập tài nguyên' }]}
          >
            <TextArea rows={2} placeholder="Nhập các tài nguyên, phân cách bằng dấu phẩy" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sửa môn học"
        open={isSubjectModalVisible}
        onOk={handleSubjectModalOk}
        onCancel={() => setIsSubjectModalVisible(false)}
        width={600}
      >
        <Form
          form={subjectForm}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} maxLength={255} />
          </Form.Item>
          <Form.Item
            name="minAverageScoreToPass"
            label="Điểm đạt"
            rules={[{ required: true, message: 'Vui lòng nhập điểm đạt' }]}
          >
            <Input type="number" min={0} max={10} step={0.1} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa môn học này?</p>
      </Modal>
    </div>
  );
};

export default Syllabus; 