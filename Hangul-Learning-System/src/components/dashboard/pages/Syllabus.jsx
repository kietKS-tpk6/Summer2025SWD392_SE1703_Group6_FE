import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Divider, Table, Tag, Space, Modal, Form, Input, InputNumber, message, Descriptions, Select } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined, EyeOutlined,
  EyeInvisibleOutlined } from '@ant-design/icons';
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
  const [subjectDeleteModalVisible, setSubjectDeleteModalVisible] = useState(false);
  const [assessmentDeleteModalVisible, setAssessmentDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form instances
  const [subjectForm] = Form.useForm();
  const [syllabusForm] = Form.useForm();
  const [assessmentForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();

  // Editing states
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show Table
  const [showSubjectInfo, setShowSubjectInfo] = useState(true);
  const [showSyllabusInfo, setShowSyllabusInfo] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showAssessment, setShowAssessment] = useState(true);


  useEffect(() => {
    if (subject) {
      fetchSyllabus();
    }
  }, [subject]);

  useEffect(() => {
    if (syllabus?.syllabusID) {
      fetchAssessmentCriteria();
    }
  }, [syllabus]);

  const fetchSyllabus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getSyllabusInfo}/${subject.code}`);
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
      if (!syllabus?.syllabusID) {
        console.error('No syllabus ID available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getAssessmentCriteria}/${syllabus.syllabusID}`);
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
      minAverageScoreToPass: subject.minAverageScoreToPass,
      isActive: subject.isActive
    });
    setIsSubjectModalVisible(true);
  };

  const handleSubjectDelete = () => {
    setSubjectDeleteModalVisible(true);
  };

  const handleSubjectModalOk = async () => {
    try {
      const values = await subjectForm.validateFields();
      const response = await axios.put(`${API_URL}${endpoints.manageSubject.update}`, {
        subjectID: subject.code,
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

  const handleSubjectDeleteConfirm = async () => {
    try {
      const subjectId = subject.id || subject.code;
      await axios.delete(`${API_URL}${endpoints.manageSubject.delete}${subjectId}`);
      message.success('Xóa môn học thành công');
      navigate('/dashboard/subject');
    } catch (error) {
      console.error('Error deleting subject:', error);
      message.error('Không thể xóa môn học. Vui lòng thử lại.');
    } finally {
      setSubjectDeleteModalVisible(false);
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
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.accountId) {
        message.error('Không tìm thấy thông tin người dùng');
        return;
      }
      const payload = {
        syllabusID: syllabus.syllabusID,
        accountID: user.accountId,
        description: values.description,
        note: values.note,
        status: values.status
      };
      await axios.put(`${API_URL}${endpoints.syllabus.update}`, payload);
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
    setDeleteId(id);
    setAssessmentDeleteModalVisible(true);
  };

  const handleAssessmentModalOk = async () => {
    try {
      const values = await assessmentForm.validateFields();
      if (editingCriteria) {
        const payload = {
          assessmentCriteriaID: editingCriteria.assessmentCriteriaID,
          syllabusID: syllabus.syllabusID,
          weightPercent: values.weightPercent,
          category: values.category,
          requiredCount: values.requiredCount,
          duration: values.duration,
          testType: values.testType,
          note: values.note || '',
          minPassingScore: values.minPassingScore
        };
        await axios.put(`${API_URL}${endpoints.syllabus.updateAssessmentCriteria}/${editingCriteria.assessmentCriteriaID}`, payload);
        message.success('Cập nhật tiêu chí đánh giá thành công');
      } else {
        const payload = {
          syllabusID: syllabus.syllabusID,
          weightPercent: values.weightPercent,
          category: values.category,
          requiredCount: values.requiredCount,
          duration: values.duration,
          testType: values.testType,
          note: values.note || '',
          minPassingScore: values.minPassingScore
        };
        await axios.post(`${API_URL}${endpoints.syllabus.createAssessmentCriteria}`, payload);
        message.success('Thêm tiêu chí đánh giá thành công');
      }
      setIsAssessmentModalVisible(false);
      fetchAssessmentCriteria();
    } catch (error) {
      console.error('Error saving assessment criteria:', error);
      message.error('Không thể lưu tiêu chí đánh giá');
    }
  };

  const handleAssessmentDeleteConfirm = async () => {
    try {
      if (!deleteId) {
        message.error('Không tìm thấy ID tiêu chí đánh giá');
        return;
      }
      await axios.delete(`${API_URL}${endpoints.syllabus.deleteAssessmentCriteria}/${deleteId}`);
      message.success('Xóa tiêu chí đánh giá thành công');
      fetchAssessmentCriteria();
      setAssessmentDeleteModalVisible(false);
    } catch (error) {
      console.error('Error deleting assessment criteria:', error);
      message.error('Không thể xóa tiêu chí đánh giá');
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
      <div style={{ padding: '0px' }}>
    {/* <Title level={2}>Chi tiết môn học</Title> */}

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3}>Thông tin môn học</Title>
      <Button
        type="text"
        icon={showSubjectInfo ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={() => setShowSubjectInfo(!showSubjectInfo)}
      />
    </div>
    {showSubjectInfo && (
      <SubjectInfo
        subject={subject}
        onEdit={handleSubjectEdit}
        onDelete={handleSubjectDelete}
      />
    )}
    <Divider />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3}>Thông tin giáo trình</Title>
      <Button
        type="text"
        icon={showSyllabusInfo ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={() => setShowSyllabusInfo(!showSyllabusInfo)}
      />
    </div>
    {showSyllabusInfo && (
      <SyllabusInfo
        syllabus={syllabus}
        onEdit={handleSyllabusEdit}
        subject={subject}
        onSyllabusCreated={(newSyllabus) => {
          setSyllabus(newSyllabus);
          fetchSyllabus();
        }}
      />
    )}
    <Divider />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3}>Lịch trình giảng dạy</Title>
      <Button
        type="text"
        icon={showSchedule ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={() => setShowSchedule(!showSchedule)}
      />
    </div>
    {showSchedule && (
      <SyllabusSchedule
        schedules={syllabusSchedules}
        onAdd={handleScheduleAdd}
        onEdit={handleScheduleEdit}
        onDelete={handleScheduleDelete}
        subject={subject}
      />
    )}
    <Divider />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Title level={3}>Tiêu chí đánh giá</Title>
      <Button
        type="text"
        icon={showAssessment ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        onClick={() => setShowAssessment(!showAssessment)}
      />
    </div>
    {showAssessment && (
      <AssessmentCriteria
        assessmentCriteria={assessmentCriteria}
        onAdd={handleAssessmentAdd}
        onEdit={handleAssessmentEdit}
        onDelete={handleAssessmentDelete}
        subject={subject}
      />
    )}
  </div>


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
        visible={subjectDeleteModalVisible}
        onOk={handleSubjectDeleteConfirm}
        onCancel={() => setSubjectDeleteModalVisible(false)}
      />

      <Modal
        title="Xác nhận xóa tiêu chí đánh giá"
        open={assessmentDeleteModalVisible}
        onOk={handleAssessmentDeleteConfirm}
        onCancel={() => setAssessmentDeleteModalVisible(false)}
        okText="Xóa"
        okType="danger"
        cancelText="Hủy"
      >
        <div>
          <p>Bạn có chắc chắn muốn xóa tiêu chí đánh giá này?</p>
          <p style={{ color: 'red' }}>Lưu ý: Hành động này không thể hoàn tác.</p>
        </div>
      </Modal>
    </div>
  );
};

export default Syllabus; 