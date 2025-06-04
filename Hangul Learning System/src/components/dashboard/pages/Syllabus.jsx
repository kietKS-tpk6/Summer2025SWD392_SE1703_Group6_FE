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
  const [syllabusSchedules, setSyllabusSchedules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [subjectForm] = Form.useForm();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  // Mock data - Replace with actual API call
  useEffect(() => {
    // Simulating API call to get syllabus data
    const mockSyllabus = {
      SyllabusID: 'SYL001',
      SubjectID: subject?.code,
      CreateBy: 'ACC001',
      CreateAt: '2024-03-20 10:00:00',
      UpdateBy: 'ACC002',
      UpdateAt: '2024-03-21 15:30:00',
      Description: 'Giáo trình tiếng Hàn cơ bản cho người mới bắt đầu',
      Note: 'Tài liệu tham khảo: Giáo trình tiếng Hàn tổng hợp',
      Status: 'published'
    };

    const mockSchedules = [
      {
        SyllabusScheduleID: 'SS001',
        SyllabusID: 'SYL001',
        Content: 'Giới thiệu về bảng chữ cái Hangeul',
        Week: 1,
        Resources: 'Tài liệu học tập, Video bài giảng',
        LessonTitle: 'Bài 1: Bảng chữ cái Hangeul',
        DurationMinutes: 90
      },
      {
        SyllabusScheduleID: 'SS002',
        SyllabusID: 'SYL001',
        Content: 'Học nguyên âm cơ bản',
        Week: 1,
        Resources: 'Bài tập, Audio phát âm',
        LessonTitle: 'Bài 2: Nguyên âm cơ bản',
        DurationMinutes: 60
      },
    ].sort((a, b) => a.Week - b.Week);
    setSyllabusSchedules(mockSchedules);
  }, [subject]);

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
      onOk: () => {
        const updatedSchedules = syllabusSchedules
          .filter(item => item.SyllabusScheduleID !== id)
          .sort((a, b) => a.Week - b.Week);
        setSyllabusSchedules(updatedSchedules);
        message.success('Xóa lịch trình thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingSchedule) {
        const updatedSchedules = syllabusSchedules
          .map((item) =>
            item.SyllabusScheduleID === editingSchedule.SyllabusScheduleID
              ? { ...item, ...values }
              : item
          )
          .sort((a, b) => a.Week - b.Week);
        setSyllabusSchedules(updatedSchedules);
        message.success('Cập nhật lịch trình thành công');
      } else {
        const newSchedule = {
          SyllabusScheduleID: `SS${syllabusSchedules.length + 1}`.padStart(5, '0'),
          SyllabusID: subject.code,
          ...values,
        };
        const updatedSchedules = [...syllabusSchedules, newSchedule]
          .sort((a, b) => a.Week - b.Week);
        setSyllabusSchedules(updatedSchedules);
        message.success('Thêm lịch trình thành công');
      }
      setIsModalVisible(false);
    });
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
    console.log('Delete button clicked');
    console.log('Current subject:', subject);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const subjectId = subject.id || subject.code;
      console.log('Using subject ID:', subjectId);
      const deleteUrl = `${API_URL}${endpoints.manageSubject.delete}${subjectId}`;
      console.log('Delete URL:', deleteUrl);
      
      const response = await axios.delete(deleteUrl);
      console.log('Delete response:', response);
      
      message.success('Xóa môn học thành công');
      navigate('/dashboard/subject');
    } catch (error) {
      console.error('Error deleting subject:', error);
      console.error('Error response:', error.response);
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
        // Update the subject state with new values
        const updatedSubject = {
          ...subject,
          name: values.name,
          description: values.description,
          minAverageScoreToPass: values.minAverageScoreToPass || 0
        };
        // Update the location state with new subject data
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

      <Card>
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
              <span>{subject.createAt}</span>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            <Space>
              <CalendarOutlined />
              <span>{subject.updateAt}</span>
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
            <Input />
          </Form.Item>
          <Form.Item
            name="Content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TextArea rows={4} />
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
            <Input.TextArea rows={4} />
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