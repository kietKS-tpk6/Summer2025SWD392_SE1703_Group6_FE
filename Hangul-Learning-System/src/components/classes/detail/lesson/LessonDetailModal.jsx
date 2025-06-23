import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import dayjs from 'dayjs';
import UpdateLessonModal from './UpdateLessonModal';

const LessonDetailModal = ({ open, lesson, onClose, onUpdate }) => {
  const [showUpdate, setShowUpdate] = useState(false);

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
        {lesson.linkMeetURL && (
          <a
            href={lesson.linkMeetURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <button style={{ padding: '6px 18px', fontSize: 16, borderRadius: 4, background: '#52c41a', color: '#fff', border: 'none', cursor: 'pointer', marginRight: 8 }}>
              Vào lớp
            </button>
          </a>
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