import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import UpdateLessonModal from './UpdateLessonModal';
import { useNavigate } from 'react-router-dom';

const LessonDetailModal = ({ open, lesson, onClose, onUpdate }) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const navigate = useNavigate();

  let isManager = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    isManager = user && user.role === 'Manager';
  } catch (e) {
    isManager = false;
  }

  if (!lesson) return null;
  return (
    <>
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        title="Chi tiết buổi học"
      >
        <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16 }}>
         Môn: {lesson.subjectName} <span style={{ color: '#aaa', margin: '0 8px' }}>|</span> Giảng viên: {lesson.lectureName}
        </div>
        <div style={{ marginBottom: 10 }}>
          <span style={{ fontWeight: 500 }}>Thời gian:</span> {dayjs(lesson.startTime).format('HH:mm')} - {dayjs(lesson.endTime).format('HH:mm')}
        </div>
        <div style={{ marginBottom: 18 }}>
          <span style={{ fontWeight: 500 }}>Nội dung:</span> {lesson.lessonTitle}
        </div>
        {lesson.classLessonID && (
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => navigate('/dashboard/lesson-detail', { state: { lessonId: lesson.classLessonID } })}
          >
            Xem chi tiết tiết học
          </Button>
        )}
        {isManager && (
          <Button type="primary" onClick={() => setShowUpdate(true)} style={{ marginTop: 8 }}>
            Chỉnh sửa
          </Button>
        )}
      </Modal>
      <UpdateLessonModal
        open={showUpdate}
        lesson={lesson}
        onClose={() => setShowUpdate(false)}
        onUpdate={(updatedLesson) => {
          setShowUpdate(false);
          if (onUpdate) onUpdate(updatedLesson);
        }}
      />
    </>
  );
};

export default LessonDetailModal; 