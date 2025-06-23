import React from 'react';
import { Modal } from 'antd';
import dayjs from 'dayjs';

const LessonDetailModal = ({ open, lesson, onClose }) => {
  if (!lesson) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chi tiết buổi học"
    >
      <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16 }}>
        {lesson.subjectName} <span style={{ color: '#aaa', margin: '0 8px' }}>|</span> {lesson.lectureName}
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
          <button style={{ padding: '6px 18px', fontSize: 16, borderRadius: 4, background: '#52c41a', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Vào lớp
          </button>
        </a>
      )}
    </Modal>
  );
};

export default LessonDetailModal; 