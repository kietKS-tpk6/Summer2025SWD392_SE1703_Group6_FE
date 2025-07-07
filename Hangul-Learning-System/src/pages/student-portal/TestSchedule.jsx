import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Spin, Alert, Tag } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';

const TestSchedule = ({ classId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}api/TestEvent/get-by-class-id/${classId}`);
        setTests(res.data.data || []);
      } catch (err) {
        setError('Không thể tải lịch kiểm tra.');
      } finally {
        setLoading(false);
      }
    };
    if (classId) fetchTests();
  }, [classId]);

  if (loading) return <Spin style={{ display: 'block', margin: '40px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 24 }} />;

  // Sắp xếp theo lessonStartTime tăng dần
  // Chỉ lấy các bài kiểm tra có status là 1
  const filteredTests = tests.filter(t => t.status === 1);
  const sortedTests = [...filteredTests].sort((a, b) => {
    if (!a.lessonStartTime) return 1;
    if (!b.lessonStartTime) return -1;
    return new Date(a.lessonStartTime) - new Date(b.lessonStartTime);
  });

  // Hàm xác định trạng thái bài kiểm tra dựa trên thời gian
  const getVirtualStatus = (startAt, endAt) => {
    const now = new Date();
    if (!startAt || !endAt) return { text: 'Chưa có thời gian kiểm tra', color: 'orange' };
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (now < start) return { text: 'Sắp diễn ra', color: 'yellow' };
    if (now >= start && now <= end) return { text: 'Đang diễn ra', color: 'green' };
    if (now > end) return { text: 'Đã kết thúc', color: 'red' };
    return { text: 'Không xác định', color: 'default' };
  };

  return (
    <Card bordered style={{ borderRadius: 18 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Lịch kiểm tra</Typography.Title>
      <List
        dataSource={sortedTests}
        locale={{ emptyText: 'Chưa có lịch kiểm tra.' }}
        renderItem={item => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <div style={{ fontWeight: 600, fontSize: 16 }}>
                {item.testName || 'Bài kiểm tra'}
              </div>
              {item.lessonTitle && (
                <div style={{ color: '#888', fontSize: 14 }}>
                  <b>Tiết:</b> {item.lessonTitle}
                  {item.lessonStartTime && (
                    <>
                      {' | '}
                      {new Date(item.lessonStartTime).toLocaleDateString('vi-VN')} {new Date(item.lessonStartTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </>
                  )}
                </div>
              )}
              <div style={{ color: '#888', fontSize: 14 }}>
                <b>Thời gian kiểm tra:</b> {' '}
                {item.startAt && item.endAt
                  ? `${new Date(item.startAt).toLocaleString('vi-VN')} - ${new Date(item.endAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Chưa có thời gian kiểm tra'}
              </div>
              {(() => {
                const status = getVirtualStatus(item.startAt, item.endAt);
                return (
                  <span style={{
                    marginTop: 4,
                    fontWeight: 500,
                    color: status.color,
                    display: 'inline-block',
                    fontWeight: 'bold'
                  }}>
                    {status.text}
                  </span>
                );
              })()}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TestSchedule; 