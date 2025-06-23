import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../../config/api';
import FlexibleScheduleCalendar from './FlexibleScheduleCalendar';
import {Card} from 'antd';
const fetchLessons = async (classId) => {
  const res = await axios.get(`${API_URL}api/Lesson/get-by-class/${classId}`);
  return res.data.data;
};

const MonthlyTimetableSection = ({ classId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!classId) return;
    setLoading(true);
    setError(null);
    fetchLessons(classId)
      .then(res => {
        setLessons(res);
        console.log('Lessons:', res);
      })
      .catch(() => setError('Không thể tải thời khóa biểu'))
      .finally(() => setLoading(false));
  }, [classId]);

  return (
    <div style={{ marginBottom: 16 }}>
       <Card
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: collapsed ? 0 : 24 }}
      title={
        <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none', fontWeight: 500, fontSize: 16, marginBottom: collapsed ? 0 : 16 }}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        <span>Thời khóa biểu tháng</span>
        <span>{collapsed ? '▼' : '▲'}</span>
      </div>
      }
    >
      
      {!collapsed && (
        loading ? (
          <div style={{ padding: 24 }}>Đang tải thời khóa biểu...</div>
        ) : error ? (
          <div style={{ padding: 24, color: 'red' }}>{error}</div>
        ) : (
          <FlexibleScheduleCalendar lessons={lessons} mode="class" />
        )
      )}
    
    </Card>
    </div>
  );
};

export default MonthlyTimetableSection; 