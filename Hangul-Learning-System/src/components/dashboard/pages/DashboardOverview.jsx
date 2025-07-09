import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Badge, Typography, Alert, Spin, Tag } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '../../../config/api';
import { getUser } from '../../../utils/auth';

const { Title, Text } = Typography;

const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    upcomingTests: 0,
    ungradedAssignments: 0,
    todaySchedule: [],
    notifications: []
  });
  const [tasks, setTasks] = useState([]);

  const user = getUser();
  const lecturerId = user?.accountId;

  useEffect(() => {
    if (lecturerId) {
      fetchDashboardData();
    }
  }, [lecturerId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch lecturer's classes
      const classesResponse = await axios.get(`${API_URL}api/Class/get-by-lecturer?lecturerID=${lecturerId}`);
      const classes = classesResponse.data.data || [];
      
      // Fetch lessons for today's schedule
      const lessonsResponse = await axios.get(`${API_URL}api/Lesson/get-by-lecturer?lecturerID=${lecturerId}`);
      const allLessons = lessonsResponse.data.data || [];
      
      // Calculate statistics
      const totalClasses = classes.length;
      const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
      
      // Get today's lessons
      const today = dayjs().format('YYYY-MM-DD');
      const todaySchedule = allLessons.filter(lesson => 
        dayjs(lesson.startTime).format('YYYY-MM-DD') === today
      ).sort((a, b) => dayjs(a.startTime) - dayjs(b.startTime));

      // Mock data for upcoming tests and ungraded assignments (replace with actual API calls)
      const upcomingTests = 3; // Mock data
      const ungradedAssignments = 5; // Mock data

      // Mock notifications
      const notifications = [
        {
          id: 1,
          type: 'info',
          title: 'Hệ thống bảo trì',
          message: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng ngày mai',
          time: '2 giờ trước'
        },
        {
          id: 2,
          type: 'warning',
          title: 'Bài tập chưa chấm',
          message: 'Bạn có 5 bài tập cần chấm điểm',
          time: '4 giờ trước'
        },
        {
          id: 3,
          type: 'success',
          title: 'Lớp học mới',
          message: 'Lớp Hangul Nâng cao đã được tạo thành công',
          time: '1 ngày trước'
        }
      ];

      // Fetch lecturer tasks
      const tasksResponse = await axios.get(`${API_URL}api/Task/lecturer/${lecturerId}`);
      const tasksData = tasksResponse.data.data || [];

      setStats({
        totalClasses,
        totalStudents,
        upcomingTests,
        ungradedAssignments,
        todaySchedule,
        notifications
      });
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info':
        return '#e6f7ff';
      case 'warning':
        return '#fff7e6';
      case 'success':
        return '#f6ffed';
      default:
        return '#f5f5f5';
    }
  };

  // Mapping helpers
  const mapTaskType = (type) => {
    switch (type) {
      case 'GradeAssignment': return 'Chấm bài tập';
      case 'CreateExam': return 'Tạo đề thi';
      case 'UpdateTestEvent': return 'Cập nhật lịch thi';
      case 'Meeting': return 'Cuộc họp';
      case 'ReviewContent': return 'Duyệt nội dung';
      case 'PrepareLesson': return 'Chuẩn bị bài giảng';
      case 'Other': return 'Khác';
      default: return type;
    }
  };
  const mapTaskStatus = (status) => {
    switch (status) {
      case 0: return <Tag color="blue">Đang thực hiện</Tag>; // InProgress
      case 1: return <Tag color="green">Hoàn thành</Tag>; // Completed
      default: return status;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px', color: '#1a1a1a' }}>
        Tổng Quan Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: '16px' }}>Tổng số lớp đang dạy</span>}
              value={stats.totalClasses}
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 600 }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Lớp học kỳ này
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: '16px' }}>Tổng số sinh viên</span>}
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 600 }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Gộp toàn bộ lớp
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: '16px' }}>Bài kiểm tra sắp diễn ra</span>}
              value={stats.upcomingTests}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 600 }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Đếm và hiển thị ngày gần nhất
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)',
            }}
          >
            <Statistic
              title={<span style={{ color: '#666', fontSize: '16px' }}>Số bài chưa chấm</span>}
              value={stats.ungradedAssignments}
              prefix={<FileTextOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d', fontWeight: 600 }}
            />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Highlight để giảng viên xử lý
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Today's Schedule and Notifications */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Lịch dạy hôm nay
              </span>
            }
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            {stats.todaySchedule.length > 0 ? (
              <List
                dataSource={stats.todaySchedule}
                renderItem={(lesson) => (
                  <List.Item>
                    <List.Item.Meta
                      title={lesson.className || 'Lớp học'}
                      description={
                        <div>
                          <Text type="secondary">
                            {dayjs(lesson.startTime).format('HH:mm')} - {dayjs(lesson.endTime).format('HH:mm')}
                          </Text>
                          <br />
                          <Text type="secondary">{lesson.roomName || 'Phòng học'}</Text>
                        </div>
                      }
                    />
                    <Tag color="blue">Hôm nay</Tag>
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text type="secondary">Không có lịch dạy nào hôm nay</Text>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <span style={{ fontSize: '18px', fontWeight: 600 }}>
                <BellOutlined style={{ marginRight: 8 }} />
                Thông báo quan trọng
              </span>
            }
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <List
              dataSource={stats.notifications}
              renderItem={(notification) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getNotificationIcon(notification.type)}
                    title={notification.title}
                    description={
                      <div>
                        <Text>{notification.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {notification.time}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Tasks To Do */}
      <Row style={{ marginTop: 32, marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600 }}><FileTextOutlined style={{ marginRight: 8 }} />Công việc cần làm</span>}
            style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#aaa' }}>Không có công việc nào.</div>
            ) : (
              <List
                dataSource={tasks}
                renderItem={task => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span>{mapTaskType(task.type)}</span>}
                      description={
                        <>
                          <div><b>Nội dung:</b> {task.content}</div>
                          <div><b>Thời gian:</b> {dayjs(task.dateStart).format('DD/MM/YYYY HH:mm')}</div>
                        </>
                      }
                    />
                    {mapTaskStatus(task.status)}
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Thao tác nhanh</span>}
            style={{
              borderRadius: '15px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  size="small"
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/lecturer/class'}
                >
                  <BookOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                  <div>Xem lớp học</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  size="small"
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/lecturer/schedule'}
                >
                  <CalendarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                  <div>Lịch giảng dạy</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  size="small"
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/lecturer/class'}
                >
                  <FileTextOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }} />
                  <div>Chấm bài tập</div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  size="small"
                  hoverable
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => window.location.href = '/lecturer/profile'}
                >
                  <UserOutlined style={{ fontSize: '24px', color: '#722ed1', marginBottom: '8px' }} />
                  <div>Thông tin cá nhân</div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardOverview; 