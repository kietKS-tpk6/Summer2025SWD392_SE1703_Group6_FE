import React, { useEffect, useState } from 'react';
import { Card, Typography, List, Spin, Alert, Tag, Button, Table } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const TestSchedule = ({ classId }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Lấy role từ localStorage
  let userRole = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userRole = user && user.role;
  } catch (e) {
    userRole = null;
  }

  if (loading) return <Spin style={{ display: 'block', margin: '40px auto' }} />;
  if (error) return <Alert type="error" message={error} style={{ margin: 24 }} />;

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

  // Nếu là giảng viên, hiển thị tất cả bài kiểm tra ở dạng bảng
  if (userRole === 'Lecture') {
    const columns = [
      { title: 'Tên bài kiểm tra', dataIndex: 'description', key: 'description', render: (text) => <b>{text}</b> },
      { title: 'Tiết', dataIndex: 'lessonTitle', key: 'lessonTitle' },
      { title: 'Ngày', dataIndex: 'lessonStartTime', key: 'lessonStartTime', render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '--' },
      { title: 'Giờ', dataIndex: 'lessonStartTime', key: 'lessonStartTime_time', render: (date) => date ? new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--' },
      { title: 'Thời gian kiểm tra', key: 'testTime', render: (_, item) => item.startAt && item.endAt ? `${new Date(item.startAt).toLocaleString('vi-VN')} - ${new Date(item.endAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Chưa có thời gian kiểm tra' },
      { title: 'Trạng thái', key: 'status', render: (_, item) => { const status = getVirtualStatus(item.startAt, item.endAt); return <Tag color={status.color}>{status.text}</Tag>; } },
      { title: 'Thao tác', key: 'actions', align: 'center', render: (_, item) => (
          <Button size="small" type="primary" onClick={() => navigate(`/lecturer/view-test/${item.testEventID}`)}>
            Xem chi tiết
          </Button>
        )
      },
    ];
    return (
      <Card bordered style={{ borderRadius: 18 }}>
        <Typography.Title level={4} style={{ marginBottom: 16 }}>Lịch kiểm tra</Typography.Title>
        <Table
          columns={columns}
          dataSource={tests.map((t, idx) => ({ ...t, key: t.testEventID || idx }))}
          pagination={false}
          locale={{ emptyText: 'Chưa có lịch kiểm tra.' }}
        />
      </Card>
    );
  }

  // Nếu không phải giảng viên, chỉ hiển thị các bài kiểm tra có status=1 ở dạng List
  const filteredTests = tests.filter(t => t.status === 1);
  const sortedTests = [...filteredTests].sort((a, b) => {
    if (!a.lessonStartTime) return 1;
    if (!b.lessonStartTime) return -1;
    return new Date(a.lessonStartTime) - new Date(b.lessonStartTime);
  });

  return (
    <Card bordered style={{ borderRadius: 18 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>Lịch kiểm tra</Typography.Title>
      <List
        dataSource={sortedTests}
        locale={{ emptyText: 'Chưa có lịch kiểm tra.' }}
        renderItem={item => (
          <List.Item>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  {item.description || 'Bài kiểm tra'}
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
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TestSchedule; 