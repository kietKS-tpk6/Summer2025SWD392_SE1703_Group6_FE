import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Typography, Divider, Table, Tag, Space, Modal, Form, Input, InputNumber, message, Descriptions, Select } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, CalendarOutlined, EyeOutlined,
  EyeInvisibleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';


// Import components
import SubjectInfo from './syllabus/SubjectInfo';
import AssessmentCriteria from './syllabus/AssessmentCriteria';
import SyllabusSchedule from './syllabus/SyllabusSchedule';
import SubjectClasses from './syllabus/SubjectClasses';
import {
  SubjectModal,
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
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subjectId');
  const [subject, setSubject] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [syllabusSchedules, setSyllabusSchedules] = useState([]);
  const [assessmentCriteria, setAssessmentCriteria] = useState([]);
  const [classes, setClasses] = useState([]);

  // Modal states
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [isAssessmentModalVisible, setIsAssessmentModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [subjectDeleteModalVisible, setSubjectDeleteModalVisible] = useState(false);
  const [assessmentDeleteModalVisible, setAssessmentDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form instances
  const [subjectForm] = Form.useForm();
  const [assessmentForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();

  // Editing states
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  // Show Table
  const [showSubjectInfo, setShowSubjectInfo] = useState(true);
  const [showSchedule, setShowSchedule] = useState(true);
  const [showAssessment, setShowAssessment] = useState(true);
  const [showClasses, setShowClasses] = useState(true);

  useEffect(() => {
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  useEffect(() => {
    if (syllabus?.syllabusID) {
      fetchAssessmentCriteria();
    }
  }, [syllabus]);

  const fetchSubject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.manageSubject.getById}${subjectId}`);
      if (response.data) {
        setSubject({
          id: response.data.subjectID,
          code: response.data.subjectID,
          name: response.data.subjectName,
          description: response.data.description,
          isActive: response.data.isActive,
          minAverageScoreToPass: response.data.minAverageScoreToPass,
          createAt: response.data.createAt
        });
        fetchSyllabus();
        fetchClasses();
      }
    } catch (error) {
      console.error('Error fetching subject:', error);
      message.error('Không thể tải thông tin môn học');
    } finally {
      setLoading(false);
    }
  };

  const fetchSyllabus = async () => {
    try {
      if (!subject?.code) {
        console.log('No subject code available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getBySubjectId}/${subject.code}`);
      if (response.data) {
        setSyllabus(response.data);
        // Fetch schedules after getting syllabus
        await fetchSyllabusSchedules(response.data.syllabusID);
        // Fetch assessment criteria after getting syllabus
        await fetchAssessmentCriteria(response.data.syllabusID);
      }
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      if (error.response?.status === 500) {
        message.warning('Chưa có giáo trình cho môn học này');
        setSyllabus(null);
      } else {
        message.error('Không thể tải thông tin giáo trình');
      }
    }
  };

  const fetchSyllabusSchedules = async (syllabusID) => {
    try {
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getScheduleTest}/${syllabusID}`);
      if (response.data) {
        const formattedSchedules = response.data.map(schedule => ({
          ...schedule,
          key: schedule.syllabusScheduleID,
          title: `Tiết ${schedule.week * schedule.slot}`,
          week: schedule.week,
          slot: schedule.slot,
          content: schedule.content || '',
          durationMinutes: schedule.durationMinutes || 0,
          resources: schedule.resources || '',
          hasTest: schedule.hasTest || false
        }));
        setSyllabusSchedules(formattedSchedules);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Không thể tải lịch trình giảng dạy');
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
        const formattedCriteria = response.data.map(criteria => ({
          ...criteria,
          key: criteria.assessmentCriteriaID,
          weightPercent: criteria.weightPercent || 0,
          category: criteria.category || '',
          requiredCount: criteria.requiredCount || 0,
          duration: criteria.duration || 0,
          testType: criteria.testType || '',
          note: criteria.note || '',
          minPassingScore: criteria.minPassingScore || 0
        }));
        setAssessmentCriteria(formattedCriteria);
      }
    } catch (error) {
      console.error('Error fetching assessment criteria:', error);
      message.error('Không thể tải tiêu chí đánh giá');
    }
  };

  const fetchClasses = async () => {
    try {
      if (!subject?.code) {
        console.log('No subject code available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.manageClass.getBySubjectCode}/${subject.code}`);
      setClasses(response.data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      message.error('Không thể tải danh sách lớp học');
      setClasses([]);
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
        setSubject(updatedSubject);
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

  // Assessment handlers
  const handleAssessmentAdd = () => {
    if (!syllabus || !syllabus.syllabusID) {
      Modal.confirm({
        title: 'Thông báo',
        content: 'Vui lòng tạo thông tin giáo trình trước khi thêm tiêu chí đánh giá',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: () => {
          setIsAssessmentModalVisible(true);
        }
      });
      return;
    }
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
      let response;

      if (editingCriteria) {
        // Update existing criteria
        response = await axios.put(`${API_URL}${endpoints.syllabus.updateAssessmentCriteria}/${editingCriteria.assessmentCriteriaID}`, {
          ...values,
          syllabusID: syllabus.syllabusID
        });
      } else {
        // Create new criteria
        response = await axios.post(`${API_URL}${endpoints.syllabus.createAssessmentCriteria}`, {
          ...values,
          syllabusID: syllabus.syllabusID
        });
      }

      if (response.data) {
        message.success(editingCriteria ? 'Cập nhật tiêu chí đánh giá thành công' : 'Thêm tiêu chí đánh giá thành công');
        setIsAssessmentModalVisible(false);
        fetchAssessmentCriteria();
      }
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
    if (!syllabus || !syllabus.syllabusID) {
      Modal.confirm({
        title: 'Thông báo',
        content: 'Vui lòng tạo thông tin giáo trình trước khi thêm lịch trình',
        okText: 'Đồng ý',
        cancelText: 'Hủy',
        onOk: () => {
          setIsAssessmentModalVisible(true);
        }
      });
      return;
    }
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
      let response;

      if (editingSchedule) {
        // Update existing schedule
        response = await axios.put(`${API_URL}${endpoints.syllabus.updateSchedule}/${editingSchedule.syllabusScheduleID}`, {
          ...values,
          syllabusID: syllabus.syllabusID
        });
      } else {
        // Create new schedule
        response = await axios.post(`${API_URL}${endpoints.syllabus.createSyllabusSchedule}`, {
          ...values,
          syllabusID: syllabus.syllabusID
        });
      }

      if (response.data) {
        message.success(editingSchedule ? 'Cập nhật lịch trình thành công' : 'Thêm lịch trình thành công');
        setIsScheduleModalVisible(false);
        fetchSyllabusSchedules(syllabus.syllabusID);
      }
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
            <Title level={3}>Danh sách lớp học</Title>
            <Button
              type="text"
              icon={showClasses ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              onClick={() => setShowClasses(!showClasses)}
            />
          </div>
          {showClasses && (
            <SubjectClasses classes={classes} />
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
              onAdd={() => {
                if (!syllabus || !syllabus.syllabusID) {
                  Modal.warning({
                    title: 'Thông báo',
                    content: 'Vui lòng tạo giáo trình trước khi thêm lịch trình',
                    okText: 'Đồng ý'
                  });
                  return;
                }
                handleScheduleAdd();
              }}
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
              onAdd={() => {
                if (!syllabus || !syllabus.syllabusID) {
                  Modal.warning({
                    title: 'Thông báo',
                    content: 'Vui lòng tạo giáo trình trước khi thêm tiêu chí đánh giá',
                    okText: 'Đồng ý'
                  });
                  return;
                }
                handleAssessmentAdd();
              }}
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