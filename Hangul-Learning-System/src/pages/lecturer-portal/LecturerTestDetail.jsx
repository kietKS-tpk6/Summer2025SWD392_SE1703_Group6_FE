import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Spin, Alert, Descriptions, Divider, Tag, Input, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { Title, Text } = Typography;

const statusMap = {
  Pending: 'Chưa làm',
  Submitted: 'Đã nộp bài',
  AutoGradedWaitingForWritingGrading: 'Đã chấm tự động',
  WaitingForWritingGrading: 'Chờ chấm tự luận',
  Graded: 'Đã chấm',
  Published: 'Đã công bố điểm',
};

const LecturerTestDetail = () => {
  // Lấy testEventID và studentID từ params hoặc state
  const { testEventID, studentID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Nếu không có params, thử lấy từ state (khi chuyển trang bằng navigate)
  const testEventIdParam = testEventID || location.state?.testEventID;
  const studentIdParam = studentID || location.state?.studentID;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [writingScores, setWritingScores] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        // Gọi API lấy chi tiết bài làm theo testEventID và studentID
        if (!testEventIdParam || !studentIdParam) {
          setData(null);
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_URL}api/StudentTests/detail-by-event-student?testEventID=${testEventIdParam}&studentID=${studentIdParam}`);
        if (res.data && res.data.success && res.data.data) {
          setData(res.data.data);
          // Khởi tạo state điểm và feedback cho các câu writing
          const found = res.data.data;
          if (found && Array.isArray(found.sections)) {
            const scores = {};
            const fbs = {};
            found.sections.forEach(section => {
              if (Array.isArray(section.questions)) {
                section.questions.forEach(q => {
                  if (q.type === 2) {
                    scores[q.questionID] = q.studentAnswer?.writingScore ?? '';
                    fbs[q.questionID] = q.studentAnswer?.feedback ?? '';
                  }
                });
              }
            });
            setWritingScores(scores);
            setFeedbacks(fbs);
          }
        } else {
          setData(null);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [testEventIdParam, studentIdParam]);

  const handleScoreChange = (questionID, value) => {
    setWritingScores(prev => ({ ...prev, [questionID]: value }));
  };
  const handleFeedbackChange = (questionID, value) => {
    setFeedbacks(prev => ({ ...prev, [questionID]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Gửi API chấm điểm và feedback cho từng câu writing
      const payload = Object.keys(writingScores).map(qid => ({
        questionID: qid,
        writingScore: writingScores[qid],
        feedback: feedbacks[qid]
      }));
      // await axios.post(`${API_URL}api/StudentTests/grade-writing`, { testEventID: testEventIdParam, studentID: studentIdParam, grades: payload });
      message.success('Đã lưu/chấm điểm thành công!');
    } catch (err) {
      message.error('Có lỗi khi lưu/chấm điểm.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><Spin size="large" /></div>;
  }
  if (!data) {
    return <Alert message="Không tìm thấy thông tin bài làm" type="error" showIcon style={{ margin: 24 }} />;
  }

  // Tổng điểm tối đa
  const maxScore = Array.isArray(data.sections)
    ? data.sections.reduce((sum, s) => sum + (s.sectionScore || 0), 0)
    : '';

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, margin: 24, minHeight: 600 }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>
      <Title level={2} style={{ fontWeight: 700, marginBottom: 8 }}>Chấm bài tự luận</Title>
      <Descriptions bordered column={2} style={{ marginBottom: 24, background: '#fafcff', borderRadius: 12, padding: 16 }}>
        <Descriptions.Item label="Học sinh">{data.studentName}</Descriptions.Item>
        <Descriptions.Item label="Mã bài làm">{data.studentTestID}</Descriptions.Item>
        <Descriptions.Item label="Thời gian bắt đầu">{data.startTime ? dayjs(data.startTime).format('DD/MM/YYYY HH:mm') : ''}</Descriptions.Item>
        <Descriptions.Item label="Thời gian nộp">{data.submitTime ? dayjs(data.submitTime).format('DD/MM/YYYY HH:mm') : ''}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái" span={2}>
          <Tag color="blue" style={{ fontSize: 16 }}>{statusMap[data.status] || data.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Điểm" span={2}>
          <Text strong style={{ fontSize: 16}}>{data.originalSubmissionScore}{maxScore ? ` / ${maxScore}` : ''}</Text>
        </Descriptions.Item>
        {data.comment && <Descriptions.Item label="Nhận xét" span={2}>{data.comment}</Descriptions.Item>}
      </Descriptions>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>Điều chỉnh cỡ chữ:</span>
        <Button size="small" onClick={() => setFontSize(f => Math.max(12, f - 2))}>A-</Button>
        <Button size="small" onClick={() => setFontSize(f => Math.min(32, f + 2))}>A+</Button>
        <span style={{ fontSize: 14, color: '#888' }}>{fontSize}px</span>
      </div>
      {Array.isArray(data.sections) && data.sections.map((section, idx) => (
        <Card
          key={section.testSectionID || idx}
          style={{ marginBottom: 32, borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2' }}
          bodyStyle={{ background: '#fafdff', borderRadius: 16 }}
          title={<span style={{ fontWeight: 600, fontSize: 18 }}>{section.context}</span>}
          extra={<Text type="secondary">Điểm phần này: <b>{section.studentGetScore} / {section.sectionScore}</b></Text>}
        >
          <Divider />
          {section.questions.map((q, qIdx) => (
            <div
              key={q.questionID}
              style={{
                marginBottom: 24,
                padding: 16,
                border: '1px solid #e6f4ff',
                borderRadius: 10,
                background: '#fff',
                fontSize: fontSize
              }}
            >
              <div style={{ 
                marginBottom: 8, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <Text strong style={{ fontSize: fontSize }}>Câu {qIdx + 1}:</Text> <span style={{ fontSize: fontSize }}>{q.context}</span>
                </div>
                {/* Chỉ cho phép nhập điểm ở câu tự luận */}
                {q.type === 2 && (
                  <span style={{ fontWeight: 600, fontSize: fontSize - 2 }}>
                    Điểm: <Input
                      style={{ width: 80 }}
                      type="number"
                      min={0}
                      max={q.score}
                      value={writingScores[q.questionID]}
                      onChange={e => handleScoreChange(q.questionID, e.target.value)}
                    />
                    / {q.score}
                  </span>
                )}
                {q.type !== 2 && (
                  <span style={{ fontWeight: 600, fontSize: fontSize - 2 }}>
                    Điểm: {typeof q.score === 'number' ? q.score : 0} / {q.score}
                  </span>
                )}
              </div>
              {q.type === 2 && (
                <div style={{ marginBottom: 8 }}>
                  <Text>Đáp án của học sinh: </Text>
                  <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, fontSize: fontSize, minHeight: 100 }}>
                    {q.studentAnswer?.studentEssay || <i>Chưa trả lời</i>}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <Text>Feedback:</Text>
                    <Input.TextArea
                      rows={2}
                      placeholder="Nhận xét cho học sinh..."
                      value={feedbacks[q.questionID]}
                      onChange={e => handleFeedbackChange(q.questionID, e.target.value)}
                      style={{ marginTop: 4 }}
                    />
                  </div>
                </div>
              )}
              {q.type !== 2 && (
                <div style={{ marginBottom: 8 }}>
                  <Text type="secondary">(Không phải câu tự luận)</Text>
                </div>
              )}
            </div>
          ))}
        </Card>
      ))}
      <div style={{ textAlign: 'right', marginTop: 24 }}>
        <Button type="primary" size="large" loading={saving} onClick={handleSave}>
          Lưu / Chấm điểm
        </Button>
      </div>
    </div>
  );
};

export default LecturerTestDetail; 