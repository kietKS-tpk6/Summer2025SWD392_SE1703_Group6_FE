import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Descriptions,
  Button,
  Space,
  Tag,
  Divider,
  Alert,
  Spin,
  Row,
  Col,
  List,
  Avatar,
  Modal,
  Input,
  Table
} from 'antd';
import {
  ClockCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  CalendarOutlined,
  BookOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import { message } from 'antd';

const { Title, Text, Paragraph } = Typography;

const statusMap = {
  0: 'Sắp diễn ra',
  1: 'Đang diễn ra',
  2: 'Đã kết thúc',
  3: 'Đã xóa'
};

const ViewTest = () => {
  const { testEventID } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}${endpoints.testEvent.getById.replace('{testEventID}', testEventID)}`);
        if (res.data && res.data.success && res.data.data) {
          setTestData(res.data.data);
        } else {
          setTestData(null);
        }
      } catch (err) {
        setTestData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [testEventID]);

  useEffect(() => {
    const fetchSections = async () => {
      if (testData && testData.testID) {
        try {
          const res = await axios.get(`${API_URL}api/TestSection/by-test/${testData.testID}`);
          if (Array.isArray(res.data)) {
            setSections(res.data);
          } else {
            setSections([]);
          }
        } catch (err) {
          setSections([]);
        }
      } else {
        setSections([]);
      }
    };
    fetchSections();
  }, [testData]);

  const handleStartTest = () => {
    if (testData && testData.password) {
      setPasswordModalVisible(true);
      setInputPassword('');
      setPasswordError('');
      return;
    }
    if (testData && testData.testID) {
      navigate(`/student/take-test/${testData.testID}`);
    }
  };

  const handlePasswordOk = () => {
    if (inputPassword === testData.password) {
      setPasswordModalVisible(false);
      navigate(`/student/take-test/${testData.testID}`);
    } else {
      setPasswordError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  const handlePasswordCancel = () => {
    setPasswordModalVisible(false);
    setInputPassword('');
    setPasswordError('');
  };

  const handleViewResult = () => {
    if (testData && testData.testID) {
      navigate(`/student/test-result/${testData.testID}`);
    }
  };

  const testSectionTypeMap = {
    0: 'Trắc nghiệm',
    1: 'Đúng/Sai',
    2: 'Viết luận',
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!testData) {
    return <Alert message="Không tìm thấy thông tin bài kiểm tra" type="error" showIcon style={{ margin: 24 }} />;
  }

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, margin: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/student/test-schedule')}
          style={{ marginBottom: 16 }}
        >
          Quay lại lịch kiểm tra
        </Button>
        <Title level={2} style={{ fontWeight: 700, margin: 0 }}>
          {testData.lessonTitle || testData.description || 'Bài kiểm tra'}
        </Title>
      </div>

      <Row gutter={24}>
        {/* Main content */}
        <Col xs={24} lg={16}>
          <Card>
            <Descriptions title="Thông tin bài kiểm tra" bordered column={1}>
              {/* <Descriptions.Item label="Mã bài kiểm tra">
                {testData.testID}
              </Descriptions.Item> */}
              <Descriptions.Item label="Tên bài kiểm tra">
                {testData.description || 'Bài kiểm tra'}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Mô tả">
                {testData.description}
              </Descriptions.Item> */}
              <Descriptions.Item label="Thời gian kiểm tra">
                <Space>
                  <CalendarOutlined />
                  {testData.startAt ? dayjs(testData.startAt).format('DD/MM/YYYY') : ''}
                  {testData.startAt ? dayjs(testData.startAt).format('HH:mm') : ''}
                  {testData.startAt && testData.endAt ? '-' : ''}
                  {testData.endAt ? dayjs(testData.endAt).format('HH:mm') : ''}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian làm bài">
                {testData.durationMinutes ? `${testData.durationMinutes} phút` : ''}
              </Descriptions.Item>
              <Descriptions.Item label="Loại bài kiểm tra">
                {testData.testType}
              </Descriptions.Item>
              <Descriptions.Item label="Giới hạn lượt làm">
                {testData.attemptLimit}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(statusMap[testData.status])} icon={getStatusIcon(statusMap[testData.status])}>
                  {statusMap[testData.status] || 'Không xác định'}
                </Tag>
              </Descriptions.Item> */}
            </Descriptions>

            {/* Bảng thông tin các phần của bài kiểm tra */}
            {sections.length > 0 && (
              <>
                <Divider />
                <Table
                  dataSource={sections.map((s, idx) => ({
                    key: s.testSectionID || idx,
                    context: s.context,
                    testSectionType: testSectionTypeMap[s.testSectionType],
                    score: s.score,
                  }))}
                  columns={[
                    { title: 'Nội dung', dataIndex: 'context', key: 'context' },
                    { title: 'Dạng', dataIndex: 'testSectionType', key: 'testSectionType' },
                    { title: 'Điểm', dataIndex: 'score', key: 'score' },
                  ]}
                  pagination={false}
                  bordered
                  title={() => (
                    <span style={{ fontWeight: 700, fontSize: 16 }}>
                      Các phần của bài kiểm tra
                    </span>
                  )}
                />
              </>
            )}

            {/* Bảng thông tin tiết học nếu có */}
            {testData.classLessonID && (
              <>
                <Divider />
                <Descriptions title="Thông tin tiết học liên quan" bordered column={1}>
                  {/* <Descriptions.Item label="Mã tiết học">
                    {testData.classLessonID}
                  </Descriptions.Item> */}
                  <Descriptions.Item label="Tên tiết học">
                    {testData.lessonTitle}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian bắt đầu">
                    {testData.lessonStartTime ? dayjs(testData.lessonStartTime).format('DD/MM/YYYY HH:mm') : ''}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian kết thúc">
                    {testData.lessonEndTime ? dayjs(testData.lessonEndTime).format('DD/MM/YYYY HH:mm') : ''}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card title="Thao tác">
            <Space direction="vertical" style={{ width: '100%' }}>
              {statusMap[testData.status] === 'Sắp diễn ra' && (
                <Alert
                  message="Bài kiểm tra chưa bắt đầu"
                  description="Vui lòng đợi đến thời gian quy định để bắt đầu làm bài."
                  type="info"
                  showIcon
                />
              )}

              {statusMap[testData.status] === 'Đang diễn ra' && (
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleStartTest}
                  icon={<FileTextOutlined />}
                >
                  Bắt đầu làm bài
                </Button>
              )}

              {statusMap[testData.status] === 'Đã hoàn thành' && (
                <Button
                  type="default"
                  size="large"
                  block
                  onClick={handleViewResult}
                  icon={<CheckCircleOutlined />}
                >
                  Xem kết quả chi tiết
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Modal nhập mật khẩu */}
      <Modal
        title="Nhập mật khẩu để làm bài"
        open={passwordModalVisible}
        onOk={handlePasswordOk}
        onCancel={handlePasswordCancel}
        okText="Vào làm bài"
        cancelText="Hủy"
      >
        <Input.Password
          placeholder="Nhập mật khẩu"
          value={inputPassword}
          onChange={e => setInputPassword(e.target.value)}
          onPressEnter={handlePasswordOk}
        />
        {passwordError && <div style={{ color: 'red', marginTop: 8 }}>{passwordError}</div>}
      </Modal>
    </div>
  );
};

export default ViewTest; 