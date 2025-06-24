import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Upload, Button, Row, Col, Radio, Space, Card, Tabs } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TabPane } = Tabs;

const TEST_SECTION_TYPE_OPTIONS = [
  { value: 'Multiple', label: 'Multiple Choice' },
  { value: 'TrueFalse', label: 'True/False' },
];

const SECTION_TYPE_OPTIONS = [
  { value: 'MCQ', label: 'MCQs' },
  { value: 'Writing', label: 'Writing' },
];

const DEFAULT_ANSWERS = [
  { text: '', key: 'A' },
  { text: '', key: 'B' },
  { text: '', key: 'C' },
  { text: '', key: 'D' },
];

function SectionMCQForm({ section = {}, onChange }) {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState(section.questions || []);

  React.useEffect(() => {
    form.setFieldsValue(section || {});
  }, [section, form]);

  const handleValuesChange = (_, allValues) => {
    onChange && onChange(allValues);
  };

  const handleUpload = async ({ file }, field) => {
    // TODO: upload logic, demo chỉ lấy file name
    onChange && onChange({ ...form.getFieldsValue(), [field]: file.name });
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
    onChange && onChange([{ ...section, questions: newQuestions }]);
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = idx => {
    const newQuestions = questions.filter((_, i) => i !== idx);
    setQuestions(newQuestions);
    onChange && onChange({ ...section, questions: newQuestions });
  };

  // Sửa nội dung câu hỏi
  const handleQuestionChange = (idx, field, value) => {
    const newQuestions = questions.map((q, i) =>
      i === idx ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
    onChange && onChange({ ...section, questions: newQuestions });
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
    onChange && onChange({ ...section, questions: newQuestions });
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
    onChange && onChange({ ...section, questions: newQuestions });
  };

  // Chọn đáp án đúng
  const handleCorrectChange = (qIdx, value) => {
    const newQuestions = questions.map((q, i) =>
      i === qIdx ? { ...q, correct: value } : q
    );
    setQuestions(newQuestions);
    onChange && onChange({ ...section, questions: newQuestions });
  };

  // Tính điểm mỗi câu MCQ
  const perQuestionScore =
    questions.length > 0 && section.score
      ? (Number(section.score) / questions.length).toFixed(2)
      : '';

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={section}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Miêu tả bài test" name="context" rules={[{ required: true, message: 'Nhập miêu tả!' }]}> 
        <Input.TextArea placeholder="Nhập miêu tả cho section này" />
      </Form.Item>
      <Form.Item label="Loại câu hỏi" name="testSectionType" rules={[{ required: true, message: 'Chọn loại câu hỏi!' }]}> 
        <Select placeholder="Chọn loại câu hỏi">
          {TEST_SECTION_TYPE_OPTIONS.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Ảnh (tùy chọn)" name="imageURL">
        <Upload customRequest={e => handleUpload(e, 'imageURL')} showUploadList={false} accept="image/*">
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
        {section.imageURL && <span style={{ marginLeft: 8 }}>{section.imageURL}</span>}
      </Form.Item>
      <Form.Item label="Audio (tùy chọn)" name="audioURL">
        <Upload customRequest={e => handleUpload(e, 'audioURL')} showUploadList={false} accept="audio/*">
          <Button icon={<UploadOutlined />}>Tải audio lên</Button>
        </Upload>
        {section.audioURL && <span style={{ marginLeft: 8 }}>{section.audioURL}</span>}
      </Form.Item>
      <Form.Item label="Điểm cho section" name="score" rules={[{ required: true, message: 'Nhập điểm!' }, { type: 'number', max: 10, message: 'Điểm tối đa là 10!' }]}> 
        <InputNumber min={0} max={10} style={{ width: '100%' }} placeholder="Nhập điểm cho section này" step={0.1} />
      </Form.Item>
      <Form.Item label="Câu hỏi" name="questions" rules={[{ required: true, message: 'Nhập câu hỏi!' }]}>
        {/* Danh sách câu hỏi */}
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
            <Input.TextArea
              placeholder="Nhập nội dung câu hỏi"
              value={q.content}
              onChange={e => handleQuestionChange(idx, 'content', e.target.value)}
              style={{ marginBottom: 16 }}
            />
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
      </Form.Item>
    </Form>
  );
}

function SectionWritingForm({ section = {}, onChange }) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(section || {});
  }, [section, form]);

  const handleValuesChange = (_, allValues) => {
    onChange && onChange(allValues);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={section}
      onValuesChange={handleValuesChange}
    >
      <Form.Item label="Miêu tả bài test" name="context" rules={[{ required: true, message: 'Nhập miêu tả!' }]}> 
        <Input.TextArea placeholder="Nhập miêu tả cho section này" />
      </Form.Item>
      <Form.Item label="Điểm cho section" name="score" rules={[{ required: true, message: 'Nhập điểm!' }, { type: 'number', max: 10, message: 'Điểm tối đa là 10!' }]}> 
        <InputNumber min={0} max={10} style={{ width: '100%' }} placeholder="Nhập điểm cho section này" />
      </Form.Item>
    </Form>
  );
}

const CreateAssessmentSection = ({ testType, sections = [], onChange }) => {
  // Quản lý index của section đang active
  const [activeKey, setActiveKey] = useState('0');
  // Nếu sections rỗng thì tạo 1 section mặc định
  const sectionList = sections.length > 0 ? sections : [{ name: '', type: testType === 'MCQ' ? 'MCQ' : 'Writing', score: '', questions: [] }];
  const [questions, setQuestions] = useState(sectionList[0].questions || []);

  // Handler cho các trường header
  const handleHeaderChange = (field, value) => {
    const idx = Number(activeKey);
    const newSections = sectionList.map((sec, i) => i === idx ? { ...sec, [field]: value } : sec);
    onChange && onChange(newSections);
  };

  // Thêm section mới
  const handleAddSection = () => {
    const newSection = { name: '', type: testType === 'MCQ' ? 'MCQ' : 'Writing', score: '', questions: [] };
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

  return (
    <div>
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
            Tạo section mới
          </Button>
        }
      >
        {sectionList.map((section, idx) => (
          <TabPane tab={`Section ${idx + 1}`} key={String(idx)} closable={sectionList.length > 1}>
      {/* Header: Tên trang, Loại, Điểm */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <div style={{ marginBottom: 8 }}>Tên trang</div>
          <Input
            placeholder="Tên trang/section"
            value={section.name || ''}
            onChange={e => handleHeaderChange('name', e.target.value)}
          />
        </Col>
        <Col span={8}>
          <div style={{ marginBottom: 8 }}>Loại</div>
          {testType === 'Mix' ? (
            <Select
              value={section.type || 'MCQ'}
              onChange={val => handleHeaderChange('type', val)}
              style={{ width: '100%' }}
            >
              {SECTION_TYPE_OPTIONS.map(opt => (
                <Option key={opt.value} value={opt.value}>{opt.label}</Option>
              ))}
            </Select>
          ) : (
            <Input value={testType === 'MCQ' ? 'MCQs' : 'Writing'} disabled />
          )}
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
                  initialValue={section.score || ''}
                >
          <InputNumber
            min={0}
            max={10}
            style={{ width: '100%' }}
            value={section.score || ''}
            onChange={val => handleHeaderChange('score', val)}
            placeholder="Nhập điểm cho section"
                    step={0.1}
          />
                </Form.Item>
        </Col>
      </Row>
      {/* Khung lớn nhập câu hỏi/đáp án */}
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 24, minHeight: 200 }}>
              {section.type === 'Writing' ? (
                <>
                  {questions.map((q, qIdx) => (
                    <Card
                      key={qIdx}
                      style={{ marginBottom: 24 }}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{`Câu ${qIdx + 1}:`}</span>
                          <span style={{ color: '#888', fontSize: 14 }}>
                            Điểm: {perQuestionScore(section) || '0'}
                          </span>
                        </div>
                      }
                      extra={
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={() => handleDeleteQuestion(qIdx)}
                        />
                      }
                    >
                      <Input.TextArea
                        placeholder="Nhập nội dung câu hỏi viết"
                        value={q.content}
                        onChange={e => handleQuestionChange(qIdx, 'content', e.target.value)}
                        style={{ marginBottom: 16 }}
                      />
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
                </>
              ) : (
                <>
                  {/* Upload 1 hình ảnh hoặc 1 audio cho nhiều câu hỏi */}
                  <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <Upload
                      customRequest={e => handleSectionUpload(e.file, 'image')}
                      showUploadList={false}
                      accept="image/*"
                      disabled={!!section.audioURL}
                    >
                      <Button icon={<UploadOutlined />} disabled={!!section.audioURL}>
                        {section.imageURL ? 'Đổi ảnh' : 'Tải ảnh lên'}
                      </Button>
                    </Upload>
                    {section.imageURL && <span style={{ color: '#1890ff' }}>{section.imageURL}</span>}
                    <Upload
                      customRequest={e => handleSectionUpload(e.file, 'audio')}
                      showUploadList={false}
                      accept="audio/*"
                      disabled={!!section.imageURL}
                    >
                      <Button icon={<UploadOutlined />} disabled={!!section.imageURL}>
                        {section.audioURL ? 'Đổi audio' : 'Tải audio lên'}
                      </Button>
                    </Upload>
                    {section.audioURL && <span style={{ color: '#1890ff' }}>{section.audioURL}</span>}
                  </div>
        {/* Danh sách câu hỏi */}
                  {questions.map((q, qIdx) => (
          <Card
                      key={qIdx}
            style={{ marginBottom: 24 }}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{`Câu ${qIdx + 1}:`}</span>
                          <span style={{ color: '#888', fontSize: 14 }}>
                            Điểm: {perQuestionScore(section) || '0'}
                          </span>
                        </div>
                      }
            extra={
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                          onClick={() => handleDeleteQuestion(qIdx)}
                        />
                      }
                    >
                      {/* Upload ảnh/audio cho từng câu hỏi */}
                      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                        <Upload
                          customRequest={e => handleQuestionUpload(qIdx, e.file, 'image')}
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
                          customRequest={e => handleQuestionUpload(qIdx, e.file, 'audio')}
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
            <Input.TextArea
              placeholder="Nhập nội dung câu hỏi"
              value={q.content}
                        onChange={e => handleQuestionChange(qIdx, 'content', e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              Đáp án (chọn đáp án đúng):
                        {perQuestionScore(section) && (
                <span style={{ float: 'right', color: '#888' }}>
                            Điểm mỗi câu: {perQuestionScore(section)}
                </span>
              )}
            </div>
            <Radio.Group
              value={q.correct}
                        onChange={e => handleCorrectChange(qIdx, e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {q.answers.map((a, aIdx) => (
                  <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Radio value={aIdx} />
                    <Input
                      placeholder={`Đáp án ${a.key}`}
                      value={a.text}
                                onChange={e => handleAnswerChange(qIdx, aIdx, e.target.value)}
                      style={{ flex: 1 }}
                    />
                  </div>
                ))}
              </Space>
            </Radio.Group>
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
                </>
        )}
      </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default CreateAssessmentSection;
