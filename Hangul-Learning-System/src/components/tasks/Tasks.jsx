import React, { useEffect, useState } from 'react';
import { Select, Spin, Alert, Card, Typography } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import TasktableComponent from './TasktableComponent';
import { getUser } from '../../utils/auth';

const TASK_TYPES = [
  { label: 'Lịch kiểm tra', value: 'testSchedule' },
  { label: 'Họp', value: 'meeting' },
  { label: 'Lịch dạy học', value: 'teachingSchedule' },
];

const Tasks = () => {
  const [taskType, setTaskType] = useState('testSchedule');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testEvents, setTestEvents] = useState([]);

  useEffect(() => {
    if (taskType === 'testSchedule') {
      fetchTestEvents();
    }
    // Add logic for other task types later
  }, [taskType]);

  const fetchTestEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getUser();
      const teacherId = user?.accountId;
      if (!teacherId) throw new Error('Không tìm thấy thông tin giảng viên.');
  
      // 1. Gọi API lấy danh sách lớp
      const classRes = await axios.get(`${API_URL}api/Class/get-by-teacher`, {
        params: { teacherId, page: 1, pageSize: 100 },
      });
  
      const classList = (classRes.data?.data?.items || []);
      console.log("Filtered class list", classList.map(c => ({ classID: c.classID, status: c.status })));
  
      // 2. Với mỗi lớp, gọi API testEvent
      const allTestEvents = [];
      for (const cl of classList) {
        try {
          const testRes = await axios.get(`${API_URL}api/TestEvent/get-by-class-id/${cl.classID}`);
          const testData = testRes.data?.data;
  
          if (Array.isArray(testData)) {
            allTestEvents.push(...testData.map(ev => ({ ...ev, className: cl.className, classID: cl.classID })));
          } else if (testData) {
            allTestEvents.push({ ...testData, className: cl.className, classID: cl.classID });
          }
        } catch (innerErr) {
          console.warn(`Lỗi khi lấy testEvent cho lớp ${cl.classID}:`, innerErr);
        }
      }
  
      console.log('All test events:', allTestEvents);
      setTestEvents(allTestEvents);
    } catch (err) {
      console.error(err);
      setError('Không thể tải lịch kiểm tra.');
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Card bordered style={{ borderRadius: 18 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Quản lí công việc</Typography.Title>
      <div style={{ marginBottom: 24 }}>
        <Select
          value={taskType}
          onChange={setTaskType}
          options={TASK_TYPES}
          style={{ width: 220 }}
          placeholder="Loại công việc"
        />
      </div>
      {taskType === 'testSchedule' && (
        loading ? <Spin style={{ display: 'block', margin: '40px auto' }} /> :
        error ? <Alert type="error" message={error} style={{ margin: 24 }} /> :
        <TasktableComponent testEvents={testEvents} />
      )}
      {/* Các loại công việc khác sẽ được xử lý sau */}
    </Card>
  );
};

export default Tasks;
