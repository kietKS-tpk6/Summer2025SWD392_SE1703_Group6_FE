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
  const [syllabusScheduleTests, setSyllabusScheduleTests] = useState([]);
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

  // Utility to check if editing is allowed
  const canEditSchedule = subject && (subject.status === 'pending' || subject.status === 'active');

  useEffect(() => {
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  useEffect(() => {
    if (subject?.code) {
      fetchSyllabusSchedules();
    }
  }, [subject]);

  useEffect(() => {
    if (subject?.code) {
      fetchAssessmentCriteria();
    }
  }, [subject]);

  useEffect(() => {
    if (subject?.code) {
      fetchClasses();
    }
  }, [subject]);

  useEffect(() => {
    if (syllabus?.syllabusID) {
      fetchSyllabusScheduleTests(syllabus.syllabusID);
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
          status: response.data.status,
          minAverageScoreToPass: response.data.minAverageScoreToPass,
          createAt: response.data.createAt
        });
        fetchSyllabus();
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
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getSyllabusSchedule}`, {
        params: { subject: subject.code }
      });
      console.log(response.data);
      if (response.data) {
        setSyllabusSchedules(response.data.data || []);
        setSyllabus({
          total: response.data.total,
          filteredByWeek: response.data.filteredByWeek,
          message: response.data.message,
          success: response.data.success
        });
        // Không gọi fetchSyllabusSchedules hay fetchAssessmentCriteria ở đây nữa
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

  const fetchSyllabusSchedules = async () => {
    try {
      if (!subject?.code) {
        console.log('No subject code available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getSyllabusSchedule}`, {
        params: { subject: subject.code }
      });
      setSyllabusSchedules(response.data.data || []);
    } catch (error) {
      console.error('Error fetching syllabus schedules:', error);
      message.error('Không thể tải lịch trình giảng dạy');
    }
  };

  const fetchSyllabusScheduleTests = async (syllabusID) => {
    try {
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getScheduleTest}/${syllabusID}`);
      setSyllabusScheduleTests(response.data || []);
    } catch (error) {
      console.error('Error fetching syllabus schedule tests:', error);
      message.error('Không thể tải lịch kiểm tra');
    }
  };

  const fetchAssessmentCriteria = async () => {
    try {
      if (!subject?.code) {
        console.error('No subject code available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.syllabus.getAssessmentCriteria}/${subject.code}`);
      console.log(response.data);
      
      // Check if response.data exists and is an array
      let criteriaData = [];
      if (response.data) {
        // If response.data is an array, use it directly
        if (Array.isArray(response.data)) {
          criteriaData = response.data;
        }
        // If response.data has a data property that's an array, use that
        else if (response.data.data && Array.isArray(response.data.data)) {
          criteriaData = response.data.data;
        }
        // If response.data has an items property that's an array, use that
        else if (response.data.items && Array.isArray(response.data.items)) {
          criteriaData = response.data.items;
        }
        // If it's a single object, wrap it in an array
        else if (typeof response.data === 'object' && response.data !== null) {
          criteriaData = [response.data];
        }
      }

      const formattedCriteria = criteriaData.map(criteria => ({
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
    } catch (error) {
      console.error('Error fetching assessment criteria:', error);
      message.error('Không thể tải tiêu chí đánh giá');
      setAssessmentCriteria([]);
    }
  };

  const fetchClasses = async () => {
    // console.log('subject code:', subject?.code);
    try {
      if (!subject?.code) {
        console.log('No subject code available');
        return;
      }
      const response = await axios.get(`${API_URL}${endpoints.manageClass.getAll}`, {
        params: {
          subjectId: subject.code,
          page: 1,
          pageSize: 10
        }
      });
      const sortedClasses = (response.data.items || []).sort((a, b) => a.classID.localeCompare(b.classID));
      setClasses(sortedClasses);
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
      // Only allow update if status is 0 (pending) or 1 (active)
      if (subject.status !== 0 && subject.status !== 1) {
        message.error('Chỉ có thể cập nhật khi môn học ở trạng thái Pending hoặc Active.');
        return;
      }
      const response = await axios.put(`${API_URL}${endpoints.manageSubject.update}`, {
        subjectID: subject.code,
        subjectName: values.name,
        description: values.description,
        status: subject.status, // keep current status
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

  const handleToggleSubjectStatus = async () => {
    if (!subject) return;
    const newStatus = subject.status === 0 ? 1 : 0;
    try {
      await axios.put(`${API_URL}${endpoints.manageSubject.update}`, {
        subjectID: subject.code,
        status: newStatus
      });
      setSubject({ ...subject, status: newStatus });
      message.success(newStatus === 1 ? 'Môn học đã được công khai!' : 'Môn học đã được chuyển về trạng thái nháp!');
    } catch (error) {
      message.error('Không thể thay đổi trạng thái môn học.');
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
        fetchSyllabusSchedules();
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
              onToggleStatus={handleToggleSubjectStatus}
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
          </div>
          <SyllabusSchedule
            schedules={syllabusSchedules}
            onEdit={canEditSchedule ? handleScheduleEdit : undefined}
            onDelete={undefined}
            onAdd={undefined}
            subject={subject}
            canEdit={canEditSchedule}
          />
          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3}>Lịch kiểm tra</Title>
          </div>
          <SyllabusSchedule
            schedules={syllabusScheduleTests}
            onEdit={canEditSchedule ? handleScheduleEdit : undefined}
            onDelete={undefined}
            onAdd={undefined}
            subject={subject}
            canEdit={canEditSchedule}
          />
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