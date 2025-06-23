import React from 'react';
import { Form, Input, Select, InputNumber, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const TEST_SECTION_TYPE_OPTIONS = [
  { value: 'Multiple', label: 'Multiple Choice' },
  { value: 'TrueFalse', label: 'True/False' },
];

function SectionMCQForm({ section = {}, onChange }) {
  const [form] = Form.useForm();

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
      <Form.Item label="Điểm cho section" name="score" rules={[{ required: true, message: 'Nhập điểm!' }]}> 
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập điểm cho section này" />
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
      <Form.Item label="Điểm cho section" name="score" rules={[{ required: true, message: 'Nhập điểm!' }]}> 
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập điểm cho section này" />
      </Form.Item>
    </Form>
  );
}

const CreateAssessmentSection = ({ testType, sections = [], onChange }) => {
  // sections: [{...}, ...] theo testType
  const handleSectionChange = (sectionData, idx) => {
    const newSections = [...sections];
    newSections[idx] = sectionData;
    onChange && onChange(newSections);
  };

  if (testType === 'MCQ') {
    return (
      <SectionMCQForm section={sections[0] || {}} onChange={data => handleSectionChange(data, 0)} />
    );
  }
  if (testType === 'Writing') {
    return (
      <SectionWritingForm section={sections[0] || {}} onChange={data => handleSectionChange(data, 0)} />
    );
  }
  if (testType === 'Mix') {
    return (
      <>
        <h4>Section MCQ</h4>
        <SectionMCQForm section={sections[0] || {}} onChange={data => handleSectionChange(data, 0)} />
        <h4 style={{ marginTop: 32 }}>Section Writing</h4>
        <SectionWritingForm section={sections[1] || {}} onChange={data => handleSectionChange(data, 1)} />
      </>
    );
  }
  return <div>Chọn loại bài kiểm tra trước!</div>;
};

export default CreateAssessmentSection;
