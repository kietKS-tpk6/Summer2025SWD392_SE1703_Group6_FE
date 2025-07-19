import React, { useState } from 'react';
import BasicInfoSection from './BasicInfoSection';
import StudentListSection from './StudentListSection';
import MonthlyTimetableSection from './MonthlyTimetableSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LessonDetailModal from './lesson/LessonDetailModal';
import PendingAssessmentCardList from './PendingAssessmentCardList';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const ClassDetail = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const classId = props.classId || location.state?.classId;
  const availableTests = props.availableTests || location.state?.availableTests;
  const subjectId = props.subjectId || location.state?.subjectId;
  const [reloadTimetable, setReloadTimetable] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [reloadPending, setReloadPending] = useState(0);

  const fetchAssessments = async () => {
    if (!classId) {
      console.log('fetchAssessments: classId is undefined');
      return;
    }
    try {
      const res = await axios.get(`${API_URL}api/TestEvent/get-by-class-id/${classId}`);
      console.log('fetchAssessments response:', res.data);
      setAssessments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (e) {
      console.log('fetchAssessments error:', e);
      setAssessments([]);
    }
  };

  const fetchLessons = async () => {
    if (!classId) return;
    try {
      const res = await axios.get(`${API_URL}api/Lesson/get-by-class-id/${classId}`);
      setLessons(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setLessons([]);
    }
  };

  const handleOpenLessonDetail = (lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const handleLessonUpdate = () => {
    console.log('handleLessonUpdate called');
    window.location.reload();
  };

  // Fetch latest assessments when returning to this page/component
  React.useEffect(() => {
    fetchAssessments();
    fetchLessons();
  }, [classId]);

  const handleAssessmentSuccess = () => {
    console.log('handleAssessmentSuccess called');
    fetchAssessments();
    fetchLessons();
  };

  return (
    <div style={{ display: 'flex', padding: 24, gap: 24, alignItems: 'flex-start' }}>
      {/* Main content */}
      <div style={{ flex: 1 }}>
        <Button
          style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="primary"
        >
          Quay lại
        </Button>
        <h1 style={{fontWeight:"bolder"}}>Chi tiết lớp học</h1>
        <div style={{ marginBottom: 24 }}>
          <BasicInfoSection classId={classId} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <StudentListSection classId={classId} subjectId={subjectId} />
        </div>
        <div>
          <MonthlyTimetableSection classId={classId} reload={reloadTimetable} onLessonClick={handleOpenLessonDetail} />
        </div>
      </div>
      {/* Sidebar */}
      <div style={{ width: 340, minWidth: 260 }}>
        <PendingAssessmentCardList
          classId={classId}
          assessments={assessments}
          availableTests={availableTests}
          subjectId={subjectId}
          lessons={lessons}
          reload={reloadPending}
          onReloadAssessments={handleAssessmentSuccess}
        />
      </div>
      <LessonDetailModal
        open={modalOpen}
        lesson={selectedLesson}
        onClose={() => setModalOpen(false)}
        onUpdate={handleLessonUpdate}
      />
    </div>
  );
};

export default ClassDetail;
