import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Divider, Table, Tag, Space, Modal, Form, Input, InputNumber, message, Descriptions, Select } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';

// Import components
import SubjectInfo from './syllabus/SubjectInfo';
import SyllabusInfo from './syllabus/SyllabusInfo';
import AssessmentCriteria from './syllabus/AssessmentCriteria';
import SyllabusSchedule from './syllabus/SyllabusSchedule';
import {
  SubjectModal,
  SyllabusModal,
  AssessmentModal,
  ScheduleModal,
  DeleteConfirmModal
} from './syllabus/Modals';

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
  const [assessmentCriteria, setAssessmentCriteria] = useState([]);
  
  // Modal states
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [isSyllabusModalVisible, setIsSyllabusModalVisible] = useState(false);
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  
  // Form instances
  const [subjectForm] = Form.useForm();
  const [syllabusForm] = Form.useForm();
  const [assessmentForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  
  // Editing states
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      fetchSyllabus();
      fetchAssessmentCriteria();
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

  const fetchAssessmentCriteria = async () => {
    try {
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getAssessmentCriteria}/SY0001`);
      if (response.data) {
        setAssessmentCriteria(response.data);
      }
    } catch (error) {
      console.error('Error fetching assessment criteria:', error);
      message.error('Không thể tải tiêu chí đánh giá');
    }
  };

  // Subject handlers
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

  // Syllabus handlers
  const handleSyllabusEdit = () => {
    syllabusForm.setFieldsValue({
      description: syllabus.description,
      note: syllabus.note,
      status: syllabus.status
    });
    setIsSyllabusModalVisible(true);
  };

  const handleSyllabusModalOk = async () => {
    try {
      const values = await syllabusForm.validateFields();
      await axios.put(`${API_URL}${endpoints.syllabus.update}/${syllabus.SyllabusID}`, values);
      message.success('Cập nhật thông tin giáo trình thành công');
      setIsSyllabusModalVisible(false);
      fetchSyllabus();
    } catch (error) {
      console.error('Error updating syllabus:', error);
      message.error('Không thể cập nhật thông tin giáo trình');
    }
  };

  // Assessment handlers
  const handleAssessmentAdd = () => {
    setEditingCriteria(null);
    assessmentForm.resetFields();
    setIsAssessmentModalVisible(true);
  };

  const handleAssessmentEdit = (record) => {
    setEditingCriteria(record);
    assessmentForm.setFieldsValue(record);
    setIsAssessmentModalVisible(true);
  };

  const handleAssessmentDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tiêu chí đánh giá này?',
      onOk: async () => {
        try {
          await axios.delete(`${API_URL}${endpoints.syllabus.deleteAssessmentCriteria}/${id}`);
          message.success('Xóa tiêu chí đánh giá thành công');
          fetchAssessmentCriteria();
        } catch (error) {
          console.error('Error deleting assessment criteria:', error);
          message.error('Không thể xóa tiêu chí đánh giá');
        }
      },
    });
  };

  const handleAssessmentModalOk = async () => {
    try {
      const values = await assessmentForm.validateFields();
      if (editingCriteria) {
        await axios.put(`${API_URL}${endpoints.syllabus.updateAssessmentCriteria}/${editingCriteria.AssessmentCriteriaID}`, values);
        message.success('Cập nhật tiêu chí đánh giá thành công');
      } else {
        await axios.post(`${API_URL}${endpoints.syllabus.addAssessmentCriteria}`, {
          ...values,
          SyllabusID: syllabus.SyllabusID
        });
        message.success('Thêm tiêu chí đánh giá thành công');
      }
      setIsAssessmentModalVisible(false);
      fetchAssessmentCriteria();
    } catch (error) {
      console.error('Error saving assessment criteria:', error);
      message.error('Không thể lưu tiêu chí đánh giá');
    }
  };

  // Schedule handlers
  const handleScheduleAdd = () => {
    setEditingSchedule(null);
    scheduleForm.resetFields();
    setIsScheduleModalVisible(true);
  };

  const handleScheduleEdit = (record) => {
    setEditingSchedule(record);
    scheduleForm.setFieldsValue(record);
    setIsScheduleModalVisible(true);
  };

  const handleScheduleDelete = (id) => {
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

  const handleScheduleModalOk = async () => {
    try {
      const values = await scheduleForm.validateFields();
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
      setIsScheduleModalVisible(false);
      fetchSyllabus();
    } catch (error) {
      console.error('Error saving schedule:', error);
      message.error('Không thể lưu lịch trình');
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
        <SubjectInfo
          subject={subject}
          onEdit={handleSubjectEdit}
          onDelete={handleSubjectDelete}
        />

        <Divider />

        <SyllabusInfo
          syllabus={syllabus}
          onEdit={handleSyllabusEdit}
          subject={subject}
          onSyllabusCreated={(newSyllabus) => {
            setSyllabus(newSyllabus);
            fetchSyllabus();
          }}
        />

        <Divider />

        <AssessmentCriteria
          assessmentCriteria={assessmentCriteria}
          onAdd={handleAssessmentAdd}
          onEdit={handleAssessmentEdit}
          onDelete={handleAssessmentDelete}
        />

        <Divider />

        <SyllabusSchedule
          schedules={syllabusSchedules}
          onAdd={handleScheduleAdd}
          onEdit={handleScheduleEdit}
          onDelete={handleScheduleDelete}
        />
      </Card>

      {/* Modals */}
      <SubjectModal
        visible={isSubjectModalVisible}
        onOk={handleSubjectModalOk}
        onCancel={() => setIsSubjectModalVisible(false)}
        form={subjectForm}
        initialValues={subject}
      />

      <SyllabusModal
        visible={isSyllabusModalVisible}
        onOk={handleSyllabusModalOk}
        onCancel={() => setIsSyllabusModalVisible(false)}
        form={syllabusForm}
        initialValues={syllabus}
      />

      <AssessmentModal
        visible={isAssessmentModalVisible}
        onOk={handleAssessmentModalOk}
        onCancel={() => setIsAssessmentModalVisible(false)}
        form={assessmentForm}
        initialValues={editingCriteria}
      />

      <ScheduleModal
        visible={isScheduleModalVisible}
        onOk={handleScheduleModalOk}
        onCancel={() => setIsScheduleModalVisible(false)}
        form={scheduleForm}
        initialValues={editingSchedule}
      />

      <DeleteConfirmModal
        visible={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default Syllabus; 