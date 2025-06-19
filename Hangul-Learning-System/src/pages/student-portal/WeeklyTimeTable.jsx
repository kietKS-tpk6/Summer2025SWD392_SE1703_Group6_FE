import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Button, Spin, Typography, Card, Row, Col, Tag } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { API_URL } from '../../config/api';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import HeaderBar from '../../components/header/Header';  
import FooterBar from '../../components/footer/Footer';

dayjs.locale('vi');
const { Title } = Typography;

// Lấy thứ trong tuần (Thứ 2 = 1, Chủ nhật = 7)
const weekDays = [
  'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'
];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getSunday(monday) {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  return d;
}

function getWeekRange(date) {
  const monday = getMonday(date);
  const sunday = getSunday(monday);
  return {
    start: dayjs(monday).startOf('day'),
    end: dayjs(sunday).endOf('day'),
  };
}

const WeeklyTimeTable = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weekIndex, setWeekIndex] = useState(0); // 0: tuần hiện tại, -1: tuần trước, +1: tuần sau

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem('user'));
    const studentId = student?.accountId;
    if (!studentId) return;
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}api/Lesson/get-by-student?studentID=${studentId}`);
        setLessons(res.data.data || []);
      } catch (err) {
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Tính tuần đang chọn
  const currentMonday = useMemo(() => {
    const today = new Date();
    const monday = getMonday(today);
    monday.setDate(monday.getDate() + weekIndex * 7);
    return monday;
  }, [weekIndex]);

  const weekRange = getWeekRange(currentMonday);

  // Group lessons theo ngày trong tuần đang chọn
  const lessonsByDay = useMemo(() => {
    const byDay = {};
    for (let i = 0; i < 7; i++) {
      const date = dayjs(weekRange.start).add(i, 'day').format('YYYY-MM-DD');
      byDay[date] = [];
    }
    lessons.forEach(lesson => {
      const lessonDate = dayjs(lesson.startTime).format('YYYY-MM-DD');
      if (byDay[lessonDate]) {
        byDay[lessonDate].push(lesson);
      }
    });
    return byDay;
  }, [lessons, weekRange]);

  if (loading) return <Spin size="large" style={{ margin: '80px auto', display: 'block' }} />;

  return (
    <>
      <HeaderBar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Thời khóa biểu của bạn</Title>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Button icon={<LeftOutlined />} onClick={() => setWeekIndex(weekIndex - 1)} style={{ marginRight: 16 }} />
          <span style={{ fontSize: 18, fontWeight: 500 }}>
            Tuần: {weekRange.start.format('DD/MM/YYYY')} - {weekRange.end.format('DD/MM/YYYY')}
          </span>
          <Button icon={<RightOutlined />} onClick={() => setWeekIndex(weekIndex + 1)} style={{ marginLeft: 16 }} />
        </div>
        <Card style={{ boxShadow: '0 2px 12px #eee' }}>
          <Row gutter={8} style={{ background: '#fafbfc', borderRadius: 8, padding: 8 }}>
            {weekDays.map((day, idx) => {
              const date = dayjs(weekRange.start).add(idx, 'day');
              return (
                <Col key={day} span={24/7} style={{ minWidth: 120 }}>
                  <div style={{ textAlign: 'center', fontWeight: 600, marginBottom: 8 }}>{day}</div>
                  <div style={{ textAlign: 'center', color: '#888', marginBottom: 8, fontSize: 13 }}>{date.format('DD/MM')}</div>
                  <div style={{ minHeight: 90 }}>
                    {lessonsByDay[date.format('YYYY-MM-DD')] && lessonsByDay[date.format('YYYY-MM-DD')].length > 0 ? (
                      lessonsByDay[date.format('YYYY-MM-DD')].map(lesson => (
                        <Card key={lesson.classLessonID} size="small" style={{ marginBottom: 8, background: '#f6ffed', borderColor: '#b7eb8f' }}>
                          <div style={{ fontWeight: 500 }}>{lesson.subjectName}</div>
                          <div style={{ fontSize: 13, color: '#555' }}>
                            {dayjs(lesson.startTime).format('HH:mm')} - {dayjs(lesson.endTime).format('HH:mm')}
                          </div>
                          <div>
                            <a href={lesson.linkMeetURL} target="_blank" rel="noopener noreferrer">
                              <Tag color="blue" style={{ marginTop: 4 }}>Vào lớp</Tag>
                            </a>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div style={{ color: '#bbb', fontSize: 13, marginTop: 24 }}>Không có</div>
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      </div>
      <FooterBar />
    </>
  );
};

export default WeeklyTimeTable;
