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
  Avatar
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

const { Title, Text, Paragraph } = Typography;

const ViewTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);

  // Mock test data
  useEffect(() => {
    setTimeout(() => {
      const testDataMap = {
        'T0004': {
          testId: 'T0004',
          testName: 'Bài kiểm tra 15 phút - Đại số',
          subject: 'Toán',
          className: 'Lớp 10A1',
          date: dayjs().format('YYYY-MM-DD'),
          startTime: '14:00',
          endTime: '14:15',
          duration: 15,
          totalQuestions: 10,
          maxScore: 10,
          status: 'ongoing',
          description: 'Kiểm tra kiến thức về phương trình bậc hai và đại số cơ bản',
          room: 'Phòng 101',
          lecturer: 'Nguyễn Văn A',
          testType: 'Trắc nghiệm',
          category: 'Kiểm tra 15 phút',
          sections: [
            {
              name: 'Phần 1: Phương trình bậc hai',
              questionCount: 4,
              timeLimit: 8
            },
            {
              name: 'Phần 2: Tính toán đại số',
              questionCount: 6,
              timeLimit: 7
            }
          ]
        },
        'T0005': {
          testId: 'T0005',
          testName: 'Kiểm tra từ vựng Unit 5',
          subject: 'Tiếng Anh',
          className: 'Lớp 10A2',
          date: '2024-01-20',
          startTime: '14:00',
          endTime: '14:20',
          duration: 20,
          totalQuestions: 15,
          maxScore: 15,
          status: 'ongoing',
          description: 'Kiểm tra từ vựng và ngữ pháp về chủ đề công nghệ',
          room: 'Phòng 103',
          lecturer: 'Lê Văn C',
          testType: 'Trắc nghiệm',
          category: 'Kiểm tra từ vựng',
          sections: [
            {
              name: 'Phần 1: Từ vựng cơ bản',
              questionCount: 5,
              timeLimit: 10
            },
            {
              name: 'Phần 2: Ngữ pháp và từ vựng nâng cao',
              questionCount: 10,
              timeLimit: 10
            }
          ]
        },
        'T0006': {
          testId: 'T0006',
          testName: 'Bài kiểm tra tiếng Anh tổng hợp',
          subject: 'Tiếng Anh',
          className: 'Lớp 10A2',
          date: '2024-01-22',
          startTime: '09:00',
          endTime: '09:45',
          duration: 45,
          totalQuestions: 25,
          maxScore: 25,
          status: 'upcoming',
          description: 'Bài kiểm tra tổng hợp các kỹ năng Reading, Listening và Writing',
          room: 'Phòng Lab 2',
          lecturer: 'Lê Văn C',
          testType: 'Tổng hợp',
          category: 'Kiểm tra kỹ năng',
          sections: [
            {
              name: 'Reading: Đọc hiểu',
              questionCount: 5,
              timeLimit: 15
            },
            {
              name: 'Listening: Nghe hiểu',
              questionCount: 5,
              timeLimit: 15
            },
            {
              name: 'Writing: Viết luận',
              questionCount: 5,
              timeLimit: 15
            }
          ]
        }
      };

      const selectedTest = testDataMap[testId] || testDataMap['T0004'];
      setTestData(selectedTest);
      setLoading(false);
    }, 1000);
  }, [testId]);

  const handleStartTest = () => {
    // Navigate to test taking page
    navigate(`/student/take-test/${testId}`);
  };

  const handleViewResult = () => {
    // Navigate to test result page
    navigate(`/student/test-result/${testId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sắp diễn ra':
        return 'blue';
      case 'Đang diễn ra':
        return 'orange';
      case 'Đã hoàn thành':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Sắp diễn ra':
        return <ClockCircleOutlined />;
      case 'Đang diễn ra':
        return <FileTextOutlined />;
      case 'Đã hoàn thành':
        return <CheckCircleOutlined />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
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
          {testData.testName}
        </Title>
      </div>

      <Row gutter={24}>
        {/* Main content */}
        <Col xs={24} lg={16}>
          <Card>
            <Descriptions title="Thông tin bài kiểm tra" bordered column={1}>
              <Descriptions.Item label="Môn học">
                <Space>
                  <BookOutlined />
                  {testData.subject}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Lớp học">
                {testData.className}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày kiểm tra">
                <Space>
                  <CalendarOutlined />
                  {dayjs(testData.date).format('DD/MM/YYYY')}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian">
                <Space>
                  <ClockCircleOutlined />
                  {testData.startTime} - {testData.endTime} ({testData.duration} phút)
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng thi">
                {testData.room}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                <Space>
                  <UserOutlined />
                  {testData.lecturer}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Loại bài kiểm tra">
                {testData.testType}
              </Descriptions.Item>
              <Descriptions.Item label="Phân loại">
                {testData.category}
              </Descriptions.Item>
              <Descriptions.Item label="Số câu hỏi">
                {testData.totalQuestions} câu
              </Descriptions.Item>
              <Descriptions.Item label="Điểm tối đa">
                {testData.maxScore} điểm
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(testData.status)} icon={getStatusIcon(testData.status)}>
                  {testData.status}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Mô tả bài kiểm tra</Title>
            <Paragraph>{testData.description}</Paragraph>

            {testData.sections && (
              <>
                <Title level={4}>Cấu trúc bài kiểm tra</Title>
                <List
                  dataSource={testData.sections}
                  renderItem={(section, index) => (
                    <List.Item>
                      <Card size="small" style={{ width: '100%', marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <Text strong>{section.name}</Text>
                            <br />
                            <Text type="secondary">{section.questionCount} câu hỏi</Text>
                          </div>
                          <Tag color="blue">{section.timeLimit} phút</Tag>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </>
            )}

            {testData.instructions && (
              <>
                <Title level={4}>Hướng dẫn làm bài</Title>
                <List
                  dataSource={testData.instructions}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text>{index + 1}. {item}</Text>
                    </List.Item>
                  )}
                />
              </>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card title="Thao tác">
            <Space direction="vertical" style={{ width: '100%' }}>
              {testData.status === 'Sắp diễn ra' && (
                <Alert
                  message="Bài kiểm tra chưa bắt đầu"
                  description="Vui lòng đợi đến thời gian quy định để bắt đầu làm bài."
                  type="info"
                  showIcon
                />
              )}

              {testData.status === 'Đang diễn ra' && !testData.studentScore && (
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

              {testData.status === 'Đã hoàn thành' && testData.studentScore !== null && (
                <>
                  <Alert
                    message="Đã hoàn thành bài kiểm tra"
                    description={`Điểm của bạn: ${testData.studentScore}/${testData.maxScore}`}
                    type="success"
                    showIcon
                  />
                  <Button 
                    type="default" 
                    size="large" 
                    block
                    onClick={handleViewResult}
                    icon={<CheckCircleOutlined />}
                  >
                    Xem kết quả chi tiết
                  </Button>
                </>
              )}

              {testData.status === 'Đã hoàn thành' && testData.studentScore === null && (
                <Alert
                  message="Chưa tham gia bài kiểm tra"
                  description="Bạn chưa tham gia bài kiểm tra này."
                  type="warning"
                  showIcon
                />
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewTest; 