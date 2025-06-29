import React, { useState } from 'react';
import BasicInfoSection from './BasicInfoSection';
import StudentListSection from './StudentListSection';
import MonthlyTimetableSection from './MonthlyTimetableSection';
import { useLocation } from 'react-router-dom';
import LessonDetailModal from './lesson/LessonDetailModal';
import PendingAssessmentCardList from './PendingAssessmentCardList';

const ClassDetail = (props) => {
  const location = useLocation();
  const classId = props.classId || location.state?.classId;
  const [reloadTimetable, setReloadTimetable] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenLessonDetail = (lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const handleLessonUpdate = () => {
    setReloadTimetable(r => r + 1);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Chi tiết lớp học</h1>
      <div style={{ marginBottom: 24 }}>
        <BasicInfoSection classId={classId} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <StudentListSection classId={classId} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <PendingAssessmentCardList />
      </div>
      <div>
        <MonthlyTimetableSection classId={classId} reload={reloadTimetable} onLessonClick={handleOpenLessonDetail} />
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
