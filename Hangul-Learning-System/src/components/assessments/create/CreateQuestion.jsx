import React from 'react';
import { Input, Button, Card, Upload, Radio, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const DEFAULT_ANSWERS = [
  { text: '', key: 'A' },
  { text: '', key: 'B' },
  { text: '', key: 'C' },
  { text: '', key: 'D' },
];

const CreateQuestion = ({ questions = [], onChange, type = 'MCQ', score }) => {
  // Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const newQuestions = [
      type === 'MCQ'
        ? {
            content: '',
            answers: DEFAULT_ANSWERS.map(a => ({ ...a })),
            correct: 0,
          }
        : { content: '' },
      ...questions,
    ];
    onChange && onChange(newQuestions);
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = idx => {
    const newQuestions = questions.filter((_, i) => i !== idx);
    onChange && onChange(newQuestions);
  };

  // Sửa nội dung câu hỏi
  const handleQuestionChange = (idx, value) => {
    const newQuestions = questions.map((q, i) =>
      i === idx ? { ...q, content: value } : q
    );
    onChange && onChange(newQuestions);
  };

  // Sửa đáp án
  const handleAnswerChange = (qIdx, aIdx, value) => {
    const newQuestions = questions.map((q, i) => {
      if (i !== qIdx) return q;
      const newAnswers = q.answers.map((a, j) =>
        j === aIdx ? { ...a, text: value } : a
      );
      return { ...q, answers: newAnswers };
    });
    onChange && onChange(newQuestions);
  };

  // Chọn đáp án đúng
  const handleCorrectChange = (qIdx, value) => {
    const newQuestions = questions.map((q, i) =>
      i === qIdx ? { ...q, correct: value } : q
    );
    onChange && onChange(newQuestions);
  };

  // Upload ảnh/audio cho từng câu hỏi (MCQ)
  const handleQuestionUpload = (qIdx, file, type) => {
    const newQuestions = questions.map((q, i) => {
      if (i !== qIdx) return q;
      if (type === 'image') {
        return { ...q, imageURL: file.name, audioURL: undefined };
      } else if (type === 'audio') {
        return { ...q, audioURL: file.name, imageURL: undefined };
      }
      return q;
    });
    onChange && onChange(newQuestions);
  };

  // Tính điểm mỗi câu
  const perQuestionScore =
    questions.length > 0 && score
      ? (Number(score) / questions.length).toFixed(2)
      : '';

  return (
    <div>
      {questions.map((q, idx) => (
        <Card
          key={idx}
          style={{ marginBottom: 24 }}
          title={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{`Câu ${idx + 1}:`}</span>
              <span style={{ color: '#888', fontSize: 14 }}>
                Điểm: {perQuestionScore || '0'}
              </span>
            </div>
          }
          extra={
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteQuestion(idx)}
            />
          }
        >
          {type === 'MCQ' && (
            <>
              {/* Upload ảnh/audio cho từng câu hỏi */}
              <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <Upload
                  customRequest={e => handleQuestionUpload(idx, e.file, 'image')}
                  showUploadList={false}
                  accept="image/*"
                  disabled={!!q.audioURL}
                >
                  <Button icon={<UploadOutlined />} disabled={!!q.audioURL}>
                    {q.imageURL ? 'Đổi ảnh' : 'Thêm ảnh'}
                  </Button>
                </Upload>
                {q.imageURL && <span style={{ color: '#1890ff' }}>{q.imageURL}</span>}
                <Upload
                  customRequest={e => handleQuestionUpload(idx, e.file, 'audio')}
                  showUploadList={false}
                  accept="audio/*"
                  disabled={!!q.imageURL}
                >
                  <Button icon={<UploadOutlined />} disabled={!!q.imageURL}>
                    {q.audioURL ? 'Đổi audio' : 'Thêm audio'}
                  </Button>
                </Upload>
                {q.audioURL && <span style={{ color: '#1890ff' }}>{q.audioURL}</span>}
              </div>
            </>
          )}
          <Input.TextArea
            placeholder={type === 'MCQ' ? 'Nhập nội dung câu hỏi' : 'Nhập nội dung câu hỏi viết'}
            value={q.content}
            onChange={e => handleQuestionChange(idx, e.target.value)}
            style={{ marginBottom: 16 }}
          />
          {type === 'MCQ' && (
            <>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Đáp án (chọn đáp án đúng):
                {perQuestionScore && (
                  <span style={{ float: 'right', color: '#888' }}>
                    Điểm mỗi câu: {perQuestionScore}
                  </span>
                )}
              </div>
              <Radio.Group
                value={q.correct}
                onChange={e => handleCorrectChange(idx, e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  {q.answers.map((a, aIdx) => (
                    <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Radio value={aIdx} />
                      <Input
                        placeholder={`Đáp án ${a.key}`}
                        value={a.text}
                        onChange={e => handleAnswerChange(idx, aIdx, e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            </>
          )}
        </Card>
      ))}
      {questions.length === 0 && (
        <div style={{ textAlign: 'center', color: '#aaa' }}>
          Chưa có câu hỏi nào. Nhấn <b>Thêm câu hỏi</b> để bắt đầu.
        </div>
      )}
      {/* Nút + lớn để thêm câu hỏi (đưa xuống dưới) */}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={handleAddQuestion}
        style={{ width: '100%', marginTop: 24, height: 48, fontSize: 18 }}
      >
        Thêm câu hỏi
      </Button>
    </div>
  );
};

export default CreateQuestion;
