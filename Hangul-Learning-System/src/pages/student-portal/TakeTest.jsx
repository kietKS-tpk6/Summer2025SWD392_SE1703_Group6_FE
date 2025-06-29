import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Button, 
  Space, 
  Progress,
  Alert,
  Spin,
  Row,
  Col,
  Radio,
  Checkbox,
  Input,
  Divider,
  Modal,
  message,
  Steps,
  Tabs,
  Tag
} from 'antd';
import { 
  ClockCircleOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReadOutlined,
  CustomerServiceOutlined,
  EditOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // Mock test data with sections
  useEffect(() => {
    setTimeout(() => {
      // Dữ liệu câu hỏi cho các bài kiểm tra khác nhau
      const testQuestionsMap = {
        'T0004': {
          testId: 'T0004',
          testName: 'Bài kiểm tra 15 phút - Đại số',
          duration: 15, // minutes
          totalQuestions: 10,
          sections: [
            {
              id: 1,
              name: 'Phần 1: Phương trình bậc hai',
              description: 'Giải các phương trình bậc hai cơ bản',
              timeLimit: 8, // minutes for this section
              questions: [
                {
                  id: 1,
                  type: 'mcq',
                  question: 'Câu 1: Giải phương trình x² - 5x + 6 = 0',
                  options: ['x = 2, x = 3', 'x = -2, x = -3', 'x = 1, x = 6', 'x = -1, x = -6'],
                  correctAnswer: 0
                },
                {
                  id: 2,
                  type: 'mcq',
                  question: 'Câu 2: Phương trình x² + 4x + 4 = 0 có nghiệm là:',
                  options: ['x = 2', 'x = -2', 'x = 2 và x = -2', 'Vô nghiệm'],
                  correctAnswer: 1
                },
                {
                  id: 3,
                  type: 'mcq',
                  question: 'Câu 3: Phương trình x² - 9 = 0 có nghiệm là:',
                  options: ['x = 3', 'x = -3', 'x = 3 và x = -3', 'x = 9'],
                  correctAnswer: 2
                },
                {
                  id: 4,
                  type: 'mcq',
                  question: 'Câu 4: Giải phương trình: x² - 4x + 4 = 0',
                  options: ['x = 2', 'x = -2', 'x = 2 và x = -2', 'x = 4'],
                  correctAnswer: 0
                }
              ]
            },
            {
              id: 2,
              name: 'Phần 2: Tính toán đại số',
              description: 'Tính giá trị biểu thức và giải phương trình bậc nhất',
              timeLimit: 7, // minutes for this section
              questions: [
                {
                  id: 5,
                  type: 'mcq',
                  question: 'Câu 5: Tính giá trị của biểu thức A = 2x + 3y khi x = 2, y = 3',
                  options: ['7', '13', '10', '12'],
                  correctAnswer: 1
                },
                {
                  id: 6,
                  type: 'mcq',
                  question: 'Câu 6: Tìm x biết: 3x - 7 = 8',
                  options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
                  correctAnswer: 1
                },
                {
                  id: 7,
                  type: 'mcq',
                  question: 'Câu 7: Giải phương trình: 2x + 5 = 3x - 1',
                  options: ['x = 6', 'x = 4', 'x = 2', 'x = 0'],
                  correctAnswer: 0
                },
                {
                  id: 8,
                  type: 'mcq',
                  question: 'Câu 8: Tìm x biết: 4x = 20',
                  options: ['x = 4', 'x = 5', 'x = 6', 'x = 8'],
                  correctAnswer: 1
                },
                {
                  id: 9,
                  type: 'mcq',
                  question: 'Câu 9: Tính: (x + 2)²',
                  options: ['x² + 4', 'x² + 4x + 4', 'x² + 2x + 4', 'x² + 4x + 2'],
                  correctAnswer: 1
                },
                {
                  id: 10,
                  type: 'mcq',
                  question: 'Câu 10: Tính: 3x² - 2x + 1 khi x = 2',
                  options: ['9', '11', '13', '15'],
                  correctAnswer: 0
                }
              ]
            }
          ]
        },
        'T0005': {
          testId: 'T0005',
          testName: 'Kiểm tra từ vựng Unit 5',
          duration: 20,
          totalQuestions: 15,
          sections: [
            {
              id: 1,
              name: 'Phần 1: Từ vựng cơ bản',
              description: 'Kiểm tra từ vựng về công nghệ cơ bản',
              timeLimit: 10,
              questions: [
                {
                  id: 1,
                  type: 'mcq',
                  question: 'Câu 1: What does "technology" mean?',
                  options: ['Khoa học', 'Công nghệ', 'Máy tính', 'Điện tử'],
                  correctAnswer: 1
                },
                {
                  id: 2,
                  type: 'mcq',
                  question: 'Câu 2: Choose the correct word: "I use my _____ to browse the internet."',
                  options: ['computer', 'computers', 'computing', 'computed'],
                  correctAnswer: 0
                },
                {
                  id: 3,
                  type: 'mcq',
                  question: 'Câu 3: What does "software" refer to?',
                  options: ['Phần cứng', 'Phần mềm', 'Mạng internet', 'Máy tính'],
                  correctAnswer: 1
                },
                {
                  id: 4,
                  type: 'mcq',
                  question: 'Câu 4: "Password" means:',
                  options: ['Tên đăng nhập', 'Mật khẩu', 'Email', 'Số điện thoại'],
                  correctAnswer: 1
                },
                {
                  id: 5,
                  type: 'mcq',
                  question: 'Câu 5: What is a "website"?',
                  options: ['Một trang web', 'Một ứng dụng', 'Một email', 'Một file'],
                  correctAnswer: 0
                }
              ]
            },
            {
              id: 2,
              name: 'Phần 2: Ngữ pháp và từ vựng nâng cao',
              description: 'Kiểm tra ngữ pháp và từ vựng internet',
              timeLimit: 10,
              questions: [
                {
                  id: 6,
                  type: 'mcq',
                  question: 'Câu 6: What is the opposite of "online"?',
                  options: ['offline', 'inline', 'outline', 'underline'],
                  correctAnswer: 0
                },
                {
                  id: 7,
                  type: 'mcq',
                  question: 'Câu 7: "Download" means:',
                  options: ['Tải lên', 'Tải xuống', 'Tải về', 'Tải đi'],
                  correctAnswer: 1
                },
                {
                  id: 8,
                  type: 'mcq',
                  question: 'Câu 8: Choose the correct form: "She _____ emails every day."',
                  options: ['send', 'sends', 'sending', 'sent'],
                  correctAnswer: 1
                },
                {
                  id: 9,
                  type: 'mcq',
                  question: 'Câu 9: Choose the correct word: "I need to _____ my phone."',
                  options: ['charge', 'charging', 'charged', 'charges'],
                  correctAnswer: 0
                },
                {
                  id: 10,
                  type: 'mcq',
                  question: 'Câu 10: "Social media" includes:',
                  options: ['Facebook, Instagram, Twitter', 'Email, Phone, Fax', 'TV, Radio, Newspaper', 'Books, Magazines, Newspapers'],
                  correctAnswer: 0
                },
                {
                  id: 11,
                  type: 'mcq',
                  question: 'Câu 11: What does "upload" mean?',
                  options: ['Tải xuống', 'Tải lên', 'Tải về', 'Tải đi'],
                  correctAnswer: 1
                },
                {
                  id: 12,
                  type: 'mcq',
                  question: 'Câu 12: Choose the correct form: "They _____ videos on YouTube."',
                  options: ['watch', 'watches', 'watching', 'watched'],
                  correctAnswer: 0
                },
                {
                  id: 13,
                  type: 'mcq',
                  question: 'Câu 13: "WiFi" is:',
                  options: ['Mạng có dây', 'Mạng không dây', 'Mạng di động', 'Mạng vệ tinh'],
                  correctAnswer: 1
                },
                {
                  id: 14,
                  type: 'mcq',
                  question: 'Câu 14: What is an "app"?',
                  options: ['Ứng dụng', 'Trang web', 'Email', 'File'],
                  correctAnswer: 0
                },
                {
                  id: 15,
                  type: 'mcq',
                  question: 'Câu 15: "Digital" means:',
                  options: ['Số hóa', 'Tương tự', 'Cơ học', 'Thủ công'],
                  correctAnswer: 0
                }
              ]
            }
          ]
        },
        'T0006': {
          testId: 'T0006',
          testName: 'Bài kiểm tra tiếng Anh tổng hợp',
          duration: 45,
          totalQuestions: 25,
          sections: [
            {
              id: 1,
              name: 'Reading: Đọc hiểu',
              description: 'Đọc đoạn văn và trả lời câu hỏi',
              timeLimit: 15,
              questions: [
                {
                  id: 1,
                  type: 'mcq',
                  question: 'Câu 1: What is the main topic of the passage?',
                  options: ['Technology in education', 'Online learning', 'Digital devices', 'Internet safety'],
                  correctAnswer: 1
                },
                {
                  id: 2,
                  type: 'mcq',
                  question: 'Câu 2: According to the passage, what is the advantage of online learning?',
                  options: ['It is cheaper', 'It is more flexible', 'It is faster', 'It is easier'],
                  correctAnswer: 1
                },
                {
                  id: 3,
                  type: 'mcq',
                  question: 'Câu 3: The word "flexible" in paragraph 2 means:',
                  options: ['Rigid', 'Adaptable', 'Fixed', 'Strict'],
                  correctAnswer: 1
                },
                {
                  id: 4,
                  type: 'mcq',
                  question: 'Câu 4: What does the author suggest about traditional classrooms?',
                  options: ['They are outdated', 'They are still useful', 'They should be replaced', 'They are expensive'],
                  correctAnswer: 1
                },
                {
                  id: 5,
                  type: 'mcq',
                  question: 'Câu 5: Which of the following is NOT mentioned as a benefit of online learning?',
                  options: ['Cost savings', 'Time flexibility', 'Better grades', 'Access to resources'],
                  correctAnswer: 2
                }
              ]
            },
            {
              id: 2,
              name: 'Listening: Nghe hiểu',
              description: 'Nghe audio và chọn đáp án đúng',
              timeLimit: 15,
              questions: [
                {
                  id: 6,
                  type: 'mcq',
                  question: 'Câu 6: What is the speaker talking about?',
                  options: ['A new restaurant', 'A travel destination', 'A shopping mall', 'A movie theater'],
                  correctAnswer: 1
                },
                {
                  id: 7,
                  type: 'mcq',
                  question: 'Câu 7: How long is the flight mentioned?',
                  options: ['2 hours', '3 hours', '4 hours', '5 hours'],
                  correctAnswer: 2
                },
                {
                  id: 8,
                  type: 'mcq',
                  question: 'Câu 8: What is the weather like at the destination?',
                  options: ['Cold and rainy', 'Hot and sunny', 'Mild and pleasant', 'Snowy and cold'],
                  correctAnswer: 2
                },
                {
                  id: 9,
                  type: 'mcq',
                  question: 'Câu 9: What does the speaker recommend bringing?',
                  options: ['Warm clothes', 'Swimming suit', 'Camera', 'All of the above'],
                  correctAnswer: 3
                },
                {
                  id: 10,
                  type: 'mcq',
                  question: 'Câu 10: When is the best time to visit according to the speaker?',
                  options: ['Summer', 'Winter', 'Spring', 'Fall'],
                  correctAnswer: 2
                }
              ]
            },
            {
              id: 3,
              name: 'Writing: Viết luận',
              description: 'Viết đoạn văn ngắn theo chủ đề',
              timeLimit: 15,
              questions: [
                {
                  id: 11,
                  type: 'essay',
                  question: 'Câu 11: Write a short paragraph (50-80 words) about your favorite hobby. Explain why you like it and how often you do it.',
                  maxLength: 200
                },
                {
                  id: 12,
                  type: 'essay',
                  question: 'Câu 12: Describe your ideal vacation destination. What would you do there and why would you choose this place? (50-80 words)',
                  maxLength: 200
                },
                {
                  id: 13,
                  type: 'text',
                  question: 'Câu 13: What is your favorite food? (One sentence answer)'
                },
                {
                  id: 14,
                  type: 'text',
                  question: 'Câu 14: How do you usually spend your weekends? (One sentence answer)'
                },
                {
                  id: 15,
                  type: 'essay',
                  question: 'Câu 15: Write about a memorable experience you had recently. What happened and how did you feel? (50-80 words)',
                  maxLength: 200
                }
              ]
            }
          ]
        }
      };

      const selectedTest = testQuestionsMap[testId] || testQuestionsMap['T0004'];
      setTestData(selectedTest);
      setTimeLeft(selectedTest.duration * 60); // Convert minutes to seconds
      setLoading(false);
    }, 1000);
  }, [testId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextSection = () => {
    if (currentSection < testData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmitTest = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    setShowConfirmSubmit(false);
    message.success('Đã nộp bài kiểm tra thành công!');
    navigate(`/student/test-result/${testId}`);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'mcq':
        return (
          <Radio.Group 
            value={answers[question.id]} 
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.options.map((option, index) => (
                <Radio key={index} value={index}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'checkbox':
        return (
          <Checkbox.Group 
            value={answers[question.id] || []} 
            onChange={(values) => handleAnswerChange(question.id, values)}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {question.options.map((option, index) => (
                <Checkbox key={index} value={index}>
                  {option}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        );

      case 'text':
        return (
          <Input 
            placeholder="Nhập câu trả lời"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          />
        );

      case 'essay':
        return (
          <TextArea 
            rows={6}
            placeholder="Nhập câu trả lời"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={question.maxLength}
            showCount
          />
        );

      default:
        return <Text>Loại câu hỏi không được hỗ trợ</Text>;
    }
  };

  const getSectionIcon = (sectionName) => {
    if (sectionName.toLowerCase().includes('reading')) return <ReadOutlined />;
    if (sectionName.toLowerCase().includes('listening')) return <CustomerServiceOutlined />;
    if (sectionName.toLowerCase().includes('writing')) return <EditOutlined />;
    return <FileTextOutlined />;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const currentSectionData = testData.sections[currentSection];
  const progress = ((currentSection + 1) / testData.sections.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = testData.sections.reduce((total, section) => total + section.questions.length, 0);
  const progressByQuestions = (answeredCount / totalQuestions) * 100;

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, margin: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/student/view-test/${testId}`)}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
        <Title level={2} style={{ fontWeight: 700, margin: 0 }}>
          {testData.testName}
        </Title>
      </div>

      {/* Timer and Progress */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Alert
            message={`Thời gian còn lại: ${formatTime(timeLeft)}`}
            type={timeLeft < 300 ? 'warning' : 'info'}
            icon={<ClockCircleOutlined />}
            showIcon
          />
        </Col>
        <Col xs={24} md={12}>
          <div style={{ textAlign: 'right' }}>
            <Text>Tiến độ: {answeredCount}/{totalQuestions} câu hỏi</Text>
            <Progress percent={progressByQuestions} size="small" style={{ marginTop: 8 }} />
          </div>
        </Col>
      </Row>

      {/* Section Navigation */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {testData.sections.map((section, index) => {
            const sectionAnsweredCount = section.questions.filter(q => answers[q.id] !== undefined).length;
            const isCompleted = sectionAnsweredCount === section.questions.length;
            
            return (
              <Button
                key={section.id}
                type={currentSection === index ? 'primary' : 'default'}
                size="small"
                onClick={() => setCurrentSection(index)}
                icon={getSectionIcon(section.name)}
                style={{
                  minWidth: 140,
                  height: 'auto',
                  padding: '8px 12px',
                  backgroundColor: isCompleted ? '#52c41a' : undefined,
                  borderColor: isCompleted ? '#52c41a' : undefined,
                  color: isCompleted ? 'white' : undefined
                }}
              >
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 500 }}>{section.name.split(':')[0]}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginTop: 2 }}>
                    {sectionAnsweredCount}/{section.questions.length} câu
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            Đã trả lời: {answeredCount}/{totalQuestions} câu hỏi
          </Text>
        </div>
      </Card>

      {/* Current Section */}
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={3}>{currentSectionData.name}</Title>
          <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
            {currentSectionData.description}
          </Paragraph>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary">
              Thời gian cho trang này: {currentSectionData.timeLimit} phút
            </Text>
            <Text type="secondary">
              {currentSectionData.questions.length} câu hỏi
            </Text>
          </div>
        </div>

        <Divider />

        {/* Questions in current section */}
        <div style={{ marginBottom: 32 }}>
          {currentSectionData.questions.map((question, index) => (
            <div key={question.id} style={{ marginBottom: 32, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
              <div style={{ marginBottom: 16 }}>
                <Title level={4}>Câu {question.id}</Title>
                <Paragraph style={{ fontSize: 16, marginBottom: 16 }}>
                  {question.question}
                </Paragraph>
              </div>

              <div style={{ marginBottom: 16 }}>
                {renderQuestion(question)}
              </div>

              {/* Question status indicator */}
              <div style={{ marginTop: 8 }}>
                {answers[question.id] !== undefined ? (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Đã trả lời
                  </Tag>
                ) : (
                  <Tag color="orange">
                    Chưa trả lời
                  </Tag>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handlePrevSection}
            disabled={currentSection === 0}
          >
            Trang trước
          </Button>
          
          <Space>
            {currentSection < testData.sections.length - 1 ? (
              <Button type="primary" onClick={handleNextSection}>
                Trang sau
              </Button>
            ) : (
              <Button 
                type="primary" 
                danger
                icon={<CheckCircleOutlined />}
                onClick={handleSubmitTest}
              >
                Nộp bài
              </Button>
            )}
          </Space>
        </div>
      </Card>

      {/* Confirm Submit Modal */}
      <Modal
        title="Xác nhận nộp bài"
        open={showConfirmSubmit}
        onOk={confirmSubmit}
        onCancel={() => setShowConfirmSubmit(false)}
        okText="Nộp bài"
        cancelText="Tiếp tục làm bài"
      >
        <p>Bạn có chắc chắn muốn nộp bài kiểm tra?</p>
        <p>Đã trả lời: {answeredCount}/{totalQuestions} câu hỏi</p>
        {answeredCount < totalQuestions && (
          <Alert
            message="Cảnh báo"
            description={`Bạn chưa trả lời ${totalQuestions - answeredCount} câu hỏi. Bạn có muốn tiếp tục?`}
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Modal>
    </div>
  );
};

export default TakeTest; 