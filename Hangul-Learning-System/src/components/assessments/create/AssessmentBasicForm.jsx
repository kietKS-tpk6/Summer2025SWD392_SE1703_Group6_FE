import React, { useEffect } from 'react';
import { Form, Input, Select } from 'antd';

const { Option } = Select;

const CATEGORY_OPTIONS = [
  { value: '15 phút', label: 'Kiểm tra 15 phút' },
  { value: 'Giữa kì', label: 'Thi giữa kì' },
  { value: 'Cuối kì', label: 'Thi cuối kì' },
];

const TEST_TYPE_OPTIONS = [
  { value: 'MCQ', label: 'MCQs' },
  { value: 'Writing', label: 'Writing' },
  { value: 'Mix', label: 'Mix' },
];

const AssessmentBasicForm = React.forwardRef(({ subjects = [], formData = {}, onChange }, ref) => {
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
      <Form.Item
        label="Tên bài kiểm tra"
        name="TestName"
        rules={[{ required: true, message: 'Vui lòng nhập tên bài kiểm tra' }]}
      >
        <Input placeholder="Nhập tên bài kiểm tra" />
      </Form.Item>
      <Form.Item
        label="Phân loại (Category)"
        name="Category"
        rules={[{ required: true, message: 'Vui lòng chọn phân loại' }]}
      >
        <Select placeholder="Chọn phân loại">
          {CATEGORY_OPTIONS.map(opt => (
            <Option key={opt.value} value={opt.value}>{opt.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Môn học"
        name="SubjectID"
        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
      >
        <Select placeholder="Chọn môn học">
          {subjects && subjects.map(sub => (
            <Option key={sub.SubjectID || sub.subjectID} value={sub.SubjectID || sub.subjectID}>
              {sub.SubjectName || sub.subjectName}
            </Option>
          ))}
        </Select>
      </Form.Item>
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
    </Form>
  );
});

export default AssessmentBasicForm;

