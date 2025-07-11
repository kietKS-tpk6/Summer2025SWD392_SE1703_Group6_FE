import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, List, Badge, Typography, Alert, Spin, Tag, Button, Modal, Divider, Calendar, Form, Input, DatePicker, message, Select } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  ClockCircleOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '../../../config/api';
import { getUser } from '../../../utils/auth';
import { endpoints } from '../../../config/api';

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
  const [lessons, setLessons] = useState([]);
  // State cho modal chi tiết task
  const [detailModal, setDetailModal] = useState({ open: false, task: null });
  // State cho modal tạo task mới
  const [createTaskModal, setCreateTaskModal] = useState(false);
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  const [formCreateTask] = Form.useForm();
  const [completeTaskLoading, setCompleteTaskLoading] = useState(false);
  // State cho modal xác nhận hoàn thành task
  const [confirmModal, setConfirmModal] = useState(false);
  const user = getUser();
  const lecturerId = user?.accountId;
  // Hàm hoàn thành task
  const handleCompleteTask = async () => {
    if (!detailModal.task) return;
    // Nếu là Meeting thì không cho hoàn thành
    if (detailModal.task.type === 'Meeting') {
      message.warning('Không thể hoàn thành công việc loại Meeting!');
      setConfirmModal(false);
      return;
    }
    setCompleteTaskLoading(true);
    try {
      await axios.put(`${API_URL}api/Task/${detailModal.task.taskID}/complete`, {
        lecturerID: lecturerId
      });
      message.success('Đã hoàn thành công việc!');
      setDetailModal({ open: false, task: null });
      setConfirmModal(false);
      fetchDashboardData();
    } catch (e) {
      message.error('Hoàn thành công việc thất bại!');
    } finally {
      setCompleteTaskLoading(false);
    }
  };

  

  useEffect(() => {
    if (lecturerId) {
      fetchDashboardData();
    }
  }, [lecturerId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch lecturer's classes
      const classesResponse = await axios.get(`${API_URL}api/Class/get-by-teacher?teacherId=${lecturerId}&page=1&pageSize=100`);
      const classes = classesResponse.data.items || [];
      
      // Fetch active student count (new API)
      const activeStudentCountUrl = API_URL + endpoints.class.activeStudentCount.replace('{lecturerId}', lecturerId);
      const activeStudentCountResponse = await axios.get(activeStudentCountUrl);
      const totalStudents = activeStudentCountResponse.data.data || 0;
      
      // Fetch ongoing class count (new API)
      const ongoingCountUrl = API_URL + endpoints.class.ongoingCount.replace('{lecturerId}', lecturerId);
      const ongoingCountResponse = await axios.get(ongoingCountUrl);
      const totalClasses = ongoingCountResponse.data.data || 0;
      
      // Fetch pending writing assignments count (new API)
      const pendingWritingCountUrl = API_URL + endpoints.class.pendingWritingCount.replace('{lecturerId}', lecturerId);
      const pendingWritingCountResponse = await axios.get(pendingWritingCountUrl);
      const ungradedAssignments = pendingWritingCountResponse.data.data || 0;
      
      // Fetch upcoming tests count (new API)
      const upcomingTestCountUrl = API_URL + endpoints.class.upcomingTestCount.replace('{lecturerId}', lecturerId);
      const upcomingTestCountResponse = await axios.get(upcomingTestCountUrl);
      const upcomingTests = upcomingTestCountResponse.data.data || 0;
      
      // Fetch lessons for calendar
      const lessonsResponse = await axios.get(`${API_URL}api/Lesson/get-by-lecturer?lecturerID=${lecturerId}`);
      const allLessons = lessonsResponse.data.data || [];
      setLessons(allLessons);
      
      // Calculate statistics
      // const totalClasses = classes.length; // Đã thay bằng ongoingCount
      // const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
      
      // Get today's lessons
      const today = dayjs().format('YYYY-MM-DD');
      const todaySchedule = allLessons.filter(lesson => 
        dayjs(lesson.startTime).format('YYYY-MM-DD') === today
      ).sort((a, b) => dayjs(a.startTime) - dayjs(b.startTime));

      // Mock data for upcoming tests and ungraded assignments (replace with actual API calls)
      // const upcomingTests = 3; // Mock data

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
      let tasksData = [];
      if (Array.isArray(tasksResponse.data)) {
        tasksData = tasksResponse.data;
      } else if (Array.isArray(tasksResponse.data.data)) {
        tasksData = tasksResponse.data.data;
      } else if (Array.isArray(tasksResponse.data.tasks)) {
        tasksData = tasksResponse.data.tasks;
      }

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

  // const getNotificationColor = (type) => {
  //   switch (type) {
  //     case 'info':
  //       return '#e6f7ff';
  //     case 'warning':
  //       return '#fff7e6';
  //     case 'success':
  //       return '#f6ffed';
  //     default:
  //       return '#f5f5f5';
  //   }
  // };

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

  // Icon cho từng loại task
  const getTaskIcon = (type) => {
    switch (type) {
      case 'GradeAssignment': return <FileTextOutlined style={{ color: '#faad14' }} />;
      case 'CreateExam': return <CalendarOutlined style={{ color: '#1890ff' }} />;
      case 'UpdateTestEvent': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'Meeting': return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'ReviewContent': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'PrepareLesson': return <BookOutlined style={{ color: '#52c41a' }} />;
      case 'Other': return <BellOutlined style={{ color: '#bfbfbf' }} />;
      default: return <BellOutlined />;
    }
  };
  const mapTaskStatus = (status) => {
    switch (status) {
      case 0: return <Tag color="blue">Đang thực hiện</Tag>; // InProgress
      case 1: return <Tag color="green">Hoàn thành</Tag>; // Completed
      default: return status;
    }
  };

  // Calendar hiển thị cả task và lessons
  const DashboardMiniCalendar = ({ tasks = [], lessons = [] }) => {
    // Map ngày có task
    const tasksByDate = React.useMemo(() => {
      const map = {};
      tasks.forEach(task => {
        if (!task.dateStart) return;
        const dateStr = dayjs(task.dateStart).format('YYYY-MM-DD');
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push({ ...task, _type: 'task' });
      });
      return map;
    }, [tasks]);
    // Map ngày có lesson
    const lessonsByDate = React.useMemo(() => {
      const map = {};
      lessons.forEach(lesson => {
        if (!lesson.startTime) return;
        const dateStr = dayjs(lesson.startTime).format('YYYY-MM-DD');
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push({ ...lesson, _type: 'lesson' });
      });
      return map;
    }, [lessons]);

    const dateCellRender = (value) => {
      const dateStr = value.format('YYYY-MM-DD');
      const dayTasks = tasksByDate[dateStr] || [];
      const dayLessons = lessonsByDate[dateStr] || [];
      if (!dayTasks.length && !dayLessons.length) return null;
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {dayLessons.map((lesson, idx) => (
            <li key={'lesson-' + idx} style={{ marginBottom: 2 }}>
              <Badge status="processing" text={lesson.subjectName || 'Tiết học'} />
              {lesson.linkMeetURL && (
                <Button
                  type="link"
                  size="small"
                  href={lesson.linkMeetURL}
                  target="_blank"
                  style={{ padding: 0, marginLeft: 4 }}
                >
                  Vào lớp
                </Button>
              )}
            </li>
          ))}
          {dayTasks.map((task, idx) => (
            <li key={'task-' + idx}>
              <Badge status={task.status === 1 ? 'success' : 'processing'} text={mapTaskType(task.type)} />
            </li>
          ))}
        </ul>
      );
    };

    return (
      <Card title={<span><CalendarOutlined style={{ marginRight: 8 }} />Lịch công việc</span>} style={{ borderRadius: 15, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 32 }}>
        <Calendar fullscreen={false} dateCellRender={dateCellRender} style={{ borderRadius: 8 }} />
      </Card>
    );
  };

  // Hàm submit tạo task mới
  const handleCreateTask = async (values) => {
    setCreateTaskLoading(true);
    try {
      const payload = {
        lecturerID: lecturerId,
        type: Number(values.type),
        content: values.content,
        dateStart: values.dateStart.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : null,
        note: values.note || '',
        resourcesURL: values.resourcesURL || '',
      };
      await axios.post(`${API_URL}api/Task/create`, payload);
      message.success('Tạo công việc thành công!');
      setCreateTaskModal(false);
      formCreateTask.resetFields();
      fetchDashboardData(); // reload lại task
    } catch (e) {
      message.error('Tạo công việc thất bại!');
    } finally {
      setCreateTaskLoading(false);
    }
  };

  // Validate deadline không được trước dateStart
  const validateDeadline = (_, value) => {
    const dateStart = formCreateTask.getFieldValue('dateStart');
    if (!value || !dateStart) return Promise.resolve();
    if (value.isBefore(dateStart)) {
      return Promise.reject(new Error('Deadline không được trước ngày bắt đầu!'));
    }
    return Promise.resolve();
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

      {/* Lịch công việc & Công việc cần làm */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          <DashboardMiniCalendar tasks={tasks} lessons={lessons} />
        </Col>
        <Col xs={24} lg={6}>
          <Card
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 600 }}><FileTextOutlined style={{ marginRight: 8 }} />Công việc cần làm</span>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => setCreateTaskModal(true)}
                >
                  {/* Thêm công việc */}
                </Button>
              </div>
            }
            style={{ borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            {tasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#aaa' }}>Không có công việc nào.</div>
            ) : (
              <div style={{ maxHeight: 4 * 125 + 8, overflowY: 'auto' }}>
                <List
                  dataSource={tasks}
                  renderItem={task => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={getTaskIcon(task.type)}
                        title={<span>{mapTaskType(task.type)}</span>}
                        description={
                          <>
                            <div><b>Nội dung:</b> {task.content}</div>
                            <div><b>Thời gian:</b> {dayjs(task.dateStart).format('DD/MM/YYYY HH:mm')}</div>
                            {task.note && <div><b>Ghi chú:</b> {task.note}</div>}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginTop: 8 }}>
                              <div>{mapTaskStatus(task.status)}</div>
                              {task.resourcesURL && (
                                <Button
                                  type="primary"
                                  size="small"
                                  href={task.resourcesURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Tài liệu
                                </Button>
                              )}
                              <Button
                                key="detail"
                                type="default"
                                size="small"
                                onClick={() => setDetailModal({ open: true, task })}
                              >
                                Xem chi tiết
                              </Button>
                            </div>
                          </>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
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

      {/* Modal chi tiết task */}
      <Modal
        open={detailModal.open}
        title={detailModal.task ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {detailModal.task && getTaskIcon(detailModal.task.type)}
            <span style={{ fontWeight: 700, fontSize: 20 }}>
              {mapTaskType(detailModal.task.type)}
            </span>
          </div>
        ) : ''}
        onCancel={() => setDetailModal({ open: false, task: null })}
        footer={[
          <Button key="back" onClick={() => setDetailModal({ open: false, task: null })}>
            Quay lại
          </Button>,
          detailModal.task && detailModal.task.status !== 1 && detailModal.task.type !== 'Meeting' && (
            <Button
              key="complete"
              type="primary"
              loading={completeTaskLoading}
              onClick={() => setConfirmModal(true)}
            >
              Hoàn thành
            </Button>
          )
        ]}
        width={500}
      >
        {detailModal.task && (
          <div style={{ lineHeight: 2, padding: 8 }}>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <div style={{ width: 120, color: '#888' }}>Nội dung:</div>
              <div style={{ fontWeight: 500 }}>{detailModal.task.content}</div>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <div style={{ width: 120, color: '#888' }}>Thời gian bắt đầu:</div>
              <div>{dayjs(detailModal.task.dateStart).format('DD/MM/YYYY HH:mm')}</div>
            </div>
            <div style={{ display: 'flex', marginBottom: 8 }}>
              <div style={{ width: 120, color: '#888' }}>Deadline:</div>
              <div>{detailModal.task.deadline ? dayjs(detailModal.task.deadline).format('DD/MM/YYYY HH:mm') : <span style={{ color: '#aaa' }}>Không có</span>}</div>
            </div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ display: 'flex', marginBottom: 8, alignItems: 'center' }}>
              <div style={{ width: 120, color: '#888' }}>Trạng thái:</div>
              <div>{mapTaskStatus(detailModal.task.status)}</div>
            </div>
            {detailModal.task.note && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', marginBottom: 8 }}>
                  <div style={{ width: 120, color: '#888' }}>Ghi chú:</div>
                  <div>{detailModal.task.note}</div>
                </div>
              </>
            )}
            {detailModal.task.resourcesURL && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 120, color: '#888' }}>Tài liệu:</div>
                  <Button type="primary" icon={<LinkOutlined />} size="small" href={detailModal.task.resourcesURL} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 0 }}>
                    Xem tài liệu
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Modal tạo task mới */}
      <Modal
        open={createTaskModal}
        title="Thêm công việc mới"
        onCancel={() => setCreateTaskModal(false)}
        footer={null}
        width={420}
      >
        <Form
          form={formCreateTask}
          layout="vertical"
          onFinish={handleCreateTask}
          style={{ padding: 8 }}
        >
          <Form.Item
            name="type"
            label="Loại công việc"
            rules={[{ required: true, message: 'Vui lòng chọn loại công việc' }]}
          >
            <Select placeholder="Chọn loại công việc">
              <Select.Option value={0}>Chấm bài tập</Select.Option>
              <Select.Option value={1}>Tạo đề thi</Select.Option>
              <Select.Option value={2}>Cập nhật lịch thi</Select.Option>
              <Select.Option value={3}>Cuộc họp</Select.Option>
              <Select.Option value={4}>Duyệt nội dung</Select.Option>
              <Select.Option value={5}>Chuẩn bị bài giảng</Select.Option>
              <Select.Option value={6}>Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="deadline"
            label="Deadline"
            dependencies={["dateStart"]}
            rules={[{ validator: validateDeadline }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="resourcesURL"
            label="Link tài liệu"
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={createTaskLoading}>
            Thêm công việc
          </Button>
        </Form>
      </Modal>

      {/* Modal xác nhận hoàn thành task */}
      <Modal
        open={confirmModal}
        title={<span><ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />Xác nhận hoàn thành</span>}
        onCancel={() => setConfirmModal(false)}
        onOk={handleCompleteTask}
        okText="Xác nhận"
        cancelText="Huỷ"
        confirmLoading={completeTaskLoading}
      >
        Bạn có chắc chắn muốn đánh dấu công việc này là <b>hoàn thành</b> không?
      </Modal>
    </div>
  );
};

export default DashboardOverview; 