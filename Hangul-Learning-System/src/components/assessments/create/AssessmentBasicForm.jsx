import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const TEST_TYPE_OPTIONS = [
  { value: 'MCQ', label: 'MCQs' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Mix', label: 'Mix' },
];

// Mapping enum value to label
const CATEGORY_LABELS = {
  Quiz: 'Kiểm tra 15 phút',
  Midterm: 'Thi giữa kì',
  Final: 'Thi cuối kì',
};

const ALLOWED_CATEGORIES = ['Quiz', 'Midterm', 'Final'];

// Map số sang enum string
const CATEGORY_ENUM_MAP = {
  0: 'Quiz',
  2: 'Midterm',
  3: 'Final'
};

const AssessmentBasicForm = React.forwardRef(({ subjects = [], formData = {}, onChange, categoryOptions = [], onSubjectChange }, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(formData || {});
  }, [formData, form]);

  const handleValuesChange = (_, allValues) => {
    onChange && onChange(allValues);
  };

  React.useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formData}
      onValuesChange={handleValuesChange}
      ref={ref}
    >
      {/* Môn học lên trên */}
      <Form.Item
        label="Môn học"
        name="SubjectID"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select placeholder="Chọn môn học" onChange={onSubjectChange} allowClear>
          {subjects && subjects.map(sub => (
            <Option key={sub.SubjectID || sub.subjectID} value={sub.SubjectID || sub.subjectID}>
              {sub.SubjectName || sub.subjectName}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Tên bài kiểm tra */}
      <Form.Item
        label="Tên bài kiểm tra"
        name="TestName"
        rules={[{ required: true, message: 'Vui lòng nhập tên bài kiểm tra' }]}
      >
        <Input placeholder="Nhập tên bài kiểm tra" />
      </Form.Item>
      {/* Loại bài kiểm tra */}
      <Form.Item
        label="Loại bài kiểm tra"
        name="testType"
        rules={[{ required: true, message: 'Vui lòng chọn loại bài kiểm tra' }]}
      >
        <Select placeholder="Chọn loại bài kiểm tra">
          {TEST_TYPE_OPTIONS.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </Form.Item>
      {/* Category xuống dưới, lấy từ props */}
      <Form.Item
        label="Phân loại (Category)"
        name="Category"
        rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}
      >
        <Select placeholder="Chọn phân loại" disabled={categoryOptions.length === 0} allowClear>
          {categoryOptions.map(cat => (
            <Option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default AssessmentBasicForm;

