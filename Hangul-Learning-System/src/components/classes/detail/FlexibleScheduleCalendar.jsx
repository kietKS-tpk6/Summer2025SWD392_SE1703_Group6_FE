import React, { useState } from 'react';
import { Calendar, Badge, Card } from 'antd';
import dayjs from 'dayjs';
import LessonDetailModal from './lesson/LessonDetailModal';

/**
 * lessons: [
 *   {
 *     startTime: ISOString,
 *     endTime: ISOString,
 *     linkMeetURL: string,
 *     subjectName: string,
 *     teacherName?: string,
 *   }
 * ]
 * mode: 'class' | 'teacher'
 */
const FlexibleScheduleCalendar = ({ lessons = [], mode = 'class' }) => {
  // Group lessons by date (YYYY-MM-DD)
  const lessonsByDate = React.useMemo(() => {
    const map = {};
    lessons.forEach(lesson => {
      const date = dayjs(lesson.startTime).format('YYYY-MM-DD');
      if (!map[date]) map[date] = [];
      map[date].push(lesson);
    });
    return map;
  }, [lessons]);

  // State cho Modal
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBadgeClick = (lesson) => {
    setSelectedLesson(lesson);
    setModalOpen(true);
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const dayLessons = lessonsByDate[dateStr] || [];
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayLessons.map((lesson, idx) => (
          <li key={idx} style={{ marginBottom: 8 }}>
            <span onClick={() => handleBadgeClick(lesson)} style={{ cursor: 'pointer' }}>
              <Badge
                status="processing"
                text={
                  <span style={{ fontWeight: 500 }}>
                    {dayjs(lesson.startTime).format('HH:mm')} - {dayjs(lesson.endTime).format('HH:mm')}
                  </span>
                }
              />
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card title="Lịch học">
      <Calendar dateCellRender={dateCellRender} />
      <LessonDetailModal
        open={modalOpen}
        lesson={selectedLesson}
        onClose={() => setModalOpen(false)}
      />
    </Card>
  );
};

export default FlexibleScheduleCalendar; 