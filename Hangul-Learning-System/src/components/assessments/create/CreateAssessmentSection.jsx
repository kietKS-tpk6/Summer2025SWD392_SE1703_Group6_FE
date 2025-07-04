import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, Upload, Button, Row, Col, Radio, Space, Card, Tabs, Alert } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateQuestion from './CreateQuestion';

const { Option } = Select;
const { TabPane } = Tabs;

const TEST_SECTION_TYPE_OPTIONS = [
  { value: 'Multiple', label: 'Multiple Choice' },
  { value: 'TrueFalse', label: 'True/False' },
];

const SECTION_TYPE_OPTIONS_MAP = {
  default: [
    { value: 'MCQ', label: 'MCQs' },
    { value: 'TrueFalse', label: 'True/False' },
  ],
  writing: [
    { value: 'Writing', label: 'Writing' },
  ],
  all: [
    { value: 'Writing', label: 'Writing' },
    { value: 'MCQ', label: 'MCQs' },
    { value: 'TrueFalse', label: 'True/False' },
  ],
};

const DEFAULT_ANSWERS = [
  { text: '', key: 'A' },
  { text: '', key: 'B' },
  { text: '', key: 'C' },
  { text: '', key: 'D' },
];

const CreateAssessmentSection = ({ testType, sections = [], onChange, onImportExcel }) => {
  // Quản lý index của section đang active
  const [activeKey, setActiveKey] = useState('0');
  // Luôn lấy sectionList từ props.sections
  const sectionList = sections && sections.length > 0 ? sections : [];
  // State questions luôn đồng bộ với section đang active
  const [questions, setQuestions] = useState(sectionList[0]?.questions || []);

  // Đồng bộ questions khi sections hoặc activeKey thay đổi
  useEffect(() => {
    setQuestions(sectionList[Number(activeKey)]?.questions || []);
  }, [sections, activeKey]);

  // Đồng bộ lại type của section khi testType thay đổi
  useEffect(() => {
    let updatedSections = sectionList;
    if (testType === 'Writing') {
      updatedSections = sectionList.map(sec => ({ ...sec, type: 'Writing' }));
    } else {
      updatedSections = sectionList.map(sec => ({ ...sec, type: undefined }));
    }
    if (JSON.stringify(updatedSections) !== JSON.stringify(sectionList)) {
      onChange && onChange(updatedSections);
    }
    // eslint-disable-next-line
  }, [testType]);

  // Handler cho các trường header
  const handleHeaderChange = (field, value) => {
    const idx = Number(activeKey);
    const newSections = sectionList.map((sec, i) => i === idx ? { ...sec, [field]: value } : sec);
    onChange && onChange(newSections);
  };

  // Thêm section mới
  const handleAddSection = () => {
    let newType;
    if (testType === 'Writing') {
      newType = 'Writing';
    } else {
      newType = undefined;
    }
    const newSection = { name: '', type: newType, score: '', questions: [] };
    const newSections = [...sectionList, newSection];
    onChange && onChange(newSections);
    setActiveKey(String(newSections.length - 1));
  };

  // Xóa section
  const handleRemoveSection = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = 0;
    const newSections = sectionList.filter((_, i) => {
      if (String(i) === targetKey) {
        lastIndex = i - 1;
      }
      return String(i) !== targetKey;
    });
    if (newSections.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = String(lastIndex);
      } else {
        newActiveKey = '0';
      }
    }
    setActiveKey(newActiveKey);
    onChange && onChange(newSections);
  };

  // Khi chuyển tab
  const handleTabChange = (key) => {
    setActiveKey(key);
    setQuestions(sectionList[Number(key)].questions || []);
  };

  // Xử lý upload ảnh/audio chỉ cho phép 1 loại
  const handleSectionUpload = (file, type) => {
    if (type === 'image') {
      // Nếu upload ảnh thì xóa audio
      const newSection = { ...sectionList[Number(activeKey)], imageURL: file.name, audioURL: undefined };
      onChange && onChange([...sectionList.slice(0, Number(activeKey)), newSection, ...sectionList.slice(Number(activeKey) + 1)]);
    } else if (type === 'audio') {
      // Nếu upload audio thì xóa ảnh
      const newSection = { ...sectionList[Number(activeKey)], audioURL: file.name, imageURL: undefined };
      onChange && onChange([...sectionList.slice(0, Number(activeKey)), newSection, ...sectionList.slice(Number(activeKey) + 1)]);
    }
  };

  // Thêm câu hỏi mới
  const handleAddQuestion = () => {
    const newQuestions = [
      {
        content: '',
        answers: DEFAULT_ANSWERS.map(a => ({ ...a })),
        correct: 0, // index
      },
      ...questions,
    ];
    setQuestions(newQuestions);
    // Chỉ cập nhật questions, giữ nguyên các trường khác của section
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = idx => {
    const newQuestions = questions.filter((_, i) => i !== idx);
    setQuestions(newQuestions);
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
  };

  // Sửa nội dung câu hỏi
  const handleQuestionChange = (idx, field, value) => {
    const newQuestions = questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
  };

  // Upload ảnh/audio cho từng câu hỏi
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
    setQuestions(newQuestions);
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
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
    setQuestions(newQuestions);
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
  };

  // Chọn đáp án đúng
  const handleCorrectChange = (qIdx, value) => {
    const newQuestions = questions.map((q, i) =>
      i === qIdx ? { ...q, correct: value } : q
    );
    setQuestions(newQuestions);
    onChange && onChange([...sectionList.slice(0, Number(activeKey)), { ...sectionList[Number(activeKey)], questions: newQuestions }, ...sectionList.slice(Number(activeKey) + 1)]);
  };

  // Tính điểm mỗi câu MCQ
  const perQuestionScore = (section) =>
    section.questions && section.questions.length > 0 && section.score
      ? (Number(section.score) / section.questions.length).toFixed(2)
      : '';

  // Tính tổng điểm các section
  const totalScore = sectionList.reduce((sum, sec) => sum + (Number(sec.score) || 0), 0);

  // Kiểm tra có section nào điểm <= 0 không
  const hasInvalidSectionScore = sectionList.some(sec => Number(sec.score) <= 0);

  return (
    <div>
      {hasInvalidSectionScore ? (
        <Alert
          message="Mỗi trang phải có điểm lớn hơn 0 và không được là số âm."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : totalScore !== 10 && (
        <Alert
          message={`Tổng điểm của tất cả trang hiện tại là ${totalScore}. Tổng điểm phải đúng bằng 10.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={handleTabChange}
        onEdit={(targetKey, action) => {
          if (action === 'add') handleAddSection();
          if (action === 'remove') handleRemoveSection(targetKey);
        }}
        hideAdd                    
        tabBarExtraContent={
          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddSection}>
            Tạo trang mới
          </Button>
        }
      >
        {sectionList.map((section, idx) => (
          <TabPane tab={`Trang ${idx + 1}`} key={String(idx)} closable={sectionList.length > 1}>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>Tên trang</div>
                <Input
                  placeholder="Nhập tên trang"
                  value={section.name || ''}
                  onChange={e => handleHeaderChange('name', e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Điểm"
                  name={`score_${idx}`}
                  rules={[
                    { required: true, message: 'Nhập điểm!' },
                    { type: 'number', max: 10, message: 'Không được phép cao hơn 10 điểm' }
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <InputNumber
                    min={0}
                    max={10}
                    style={{ width: '100%' }}
                    value={section.score || ''}
                    onChange={val => handleHeaderChange('score', val)}
                    placeholder="Nhập điểm  "
                    step={0.1}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>Loại</div>
                {(() => {
                  const MULTIPLE_TYPES = ['Vocabulary', 'Grammar', 'Listening', 'Reading', 'MCQ'];
                  if (MULTIPLE_TYPES.includes(testType)) {
                    return (
                      <Select
                        value={section.type || undefined}
                        onChange={val => handleHeaderChange('type', val)}
                        style={{ width: '100%' }}
                        placeholder="Chọn thể loại kiểm tra"
                      >
                        {SECTION_TYPE_OPTIONS_MAP.default.map(opt => (
                          <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                        ))}
                      </Select>
                    );
                  }
                  if (testType === 'Writing') {
                    return (
                      <Select
                        value={section.type || undefined}
                        onChange={val => handleHeaderChange('type', val)}
                        style={{ width: '100%' }}
                        placeholder="Chọn thể loại kiểm tra"
                        disabled
                      >
                        {SECTION_TYPE_OPTIONS_MAP.writing.map(opt => (
                          <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                        ))}
                      </Select>
                    );
                  }
                  if (testType === 'Mix' || testType === 'Other') {
                    return (
                      <Select
                        value={section.type || undefined}
                        onChange={val => handleHeaderChange('type', val)}
                        style={{ width: '100%' }}
                        placeholder="Chọn thể loại kiểm tra"
                      >
                        {SECTION_TYPE_OPTIONS_MAP.all.map(opt => (
                          <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                        ))}
                      </Select>
                    );
                  }
                  return <Input value={section.type || ''} disabled />;
                })()}
              </Col>
            </Row>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 24, minHeight: 200 }}>
              <div style={{ marginBottom: 16, fontWeight: 500, color: '#1677ff', fontSize: 16 }}>
                Tổng số câu hỏi: {section.questions ? section.questions.length : 0}
              </div>
              {section.type === 'Writing' ? (
                <>
                  {section.questions && section.questions.map((q, qIdx) => (
                    <Card
                      key={qIdx}
                      style={{ marginBottom: 24 }}
                      title={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{`Câu ${qIdx + 1}:`}</span></div>}
                      extra={<Button type="text" icon={<DeleteOutlined />} danger onClick={() => {
                        const newQuestions = section.questions.filter((_, i) => i !== qIdx);
                        const newSections = [...sectionList];
                        newSections[Number(activeKey)] = { ...newSections[Number(activeKey)], questions: newQuestions };
                        onChange && onChange(newSections);
                      }} />}
                    >
                      <Input.TextArea
                        placeholder="Nhập nội dung câu hỏi viết"
                        value={q.content}
                        onChange={e => {
                          const newQuestions = section.questions.map((item, i) => i === qIdx ? { ...item, content: e.target.value } : item);
                          const newSections = [...sectionList];
                          newSections[Number(activeKey)] = { ...newSections[Number(activeKey)], questions: newQuestions };
                          onChange && onChange(newSections);
                        }}
                        style={{ marginBottom: 16 }}
                      />
                    </Card>
                  ))}
                  {(!section.questions || section.questions.length === 0) && (
                    <div style={{ textAlign: 'center', color: '#aaa' }}>
                      Chưa có câu hỏi nào. Nhấn <b>Thêm câu hỏi</b> để bắt đầu.
                    </div>
                  )}
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      const newQuestions = [...(section.questions || []), { content: '' }];
                      const newSections = [...sectionList];
                      newSections[Number(activeKey)] = { ...newSections[Number(activeKey)], questions: newQuestions };
                      onChange && onChange(newSections);
                    }}
                    style={{ width: '100%', marginTop: 24, height: 48, fontSize: 18 }}
                  >
                    Thêm câu hỏi
                  </Button>
                </>
              ) : section.type === 'MCQ' || section.type === 'TrueFalse' ? (
                <CreateQuestion
                  questions={section.questions || []}
                  onChange={newQuestions => {
                    const newSections = [...sectionList];
                    newSections[Number(activeKey)] = { ...newSections[Number(activeKey)], questions: newQuestions };
                    onChange && onChange(newSections);
                  }}
                  type={section.type}
                  score={section.score}
                  onImportExcel={file => onImportExcel && onImportExcel(file, Number(activeKey))}
                />
              ) : (
                <div style={{ color: '#aaa', textAlign: 'center', margin: 24 }}>
                  Hãy chọn thể loại kiểm tra cho trang này.
                </div>
              )}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default CreateAssessmentSection;
