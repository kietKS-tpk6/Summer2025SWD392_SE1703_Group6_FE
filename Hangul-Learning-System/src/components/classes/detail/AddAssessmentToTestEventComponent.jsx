import React from 'react';
import { Modal, Form, Select, Input, DatePicker, TimePicker } from 'antd';

const AddAssessmentToTestEventComponent = ({
  open,
  onCancel,
  onOk,
  availableTests = [],
  form,
  initialValues = {},
  endAt,
  loading,
  onTestChange,
  onDescriptionChange,
  onStartDateChange,
  onStartTimeChange,
  onAttemptLimitChange,
  onPasswordChange,
}) => (
  <Modal
    open={open}
    title="Thêm đề kiểm tra"
    onCancel={onCancel}
    onOk={onOk}
    okText="Xác nhận"
    cancelText="Hủy"
    confirmLoading={loading}
  >
    <Form form={form} layout="vertical" initialValues={initialValues}>
      <Form.Item
        label="Chọn bài test"
        name="testID"
        rules={[{ required: true, message: 'Vui lòng chọn bài test' }]}
      >
        <Select placeholder="Chọn bài test" onChange={onTestChange}>
          {availableTests.map(test => (
            <Select.Option key={test.testID} value={test.testID}>{test.testName}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input.TextArea rows={2} onChange={onDescriptionChange} />
      </Form.Item>
      <Form.Item label="Thời gian bắt đầu" required style={{ marginBottom: 0 }}>
        <Form.Item
          name="startDate"
          rules={[{ required: true, message: 'Chọn ngày' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" onChange={onStartDateChange} />
        </Form.Item>
        <Form.Item
          name="startTime"
          rules={[{ required: true, message: 'Chọn giờ' }]}
          style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
        >
          <TimePicker style={{ width: '100%' }} format="HH:mm" onChange={onStartTimeChange} />
        </Form.Item>
      </Form.Item>
      <Form.Item label="Số lần học sinh làm bài" name="attemptLimit" rules={[{ required: true, message: 'Nhập số lượng học sinh' }]}> 
        <Input type="number" min={1} onChange={onAttemptLimitChange} />
      </Form.Item>
      <Form.Item label="Password cho bài test" name="password" rules={[{ required: true, message: 'Nhập password' }]}> 
        <Input onChange={onPasswordChange} />
      </Form.Item>
      {endAt && (
        <Form.Item label="Thời gian kết thúc">
          <Input value={endAt.format('DD/MM/YYYY HH:mm')} disabled />
        </Form.Item>
      )}
    </Form>
  </Modal>
);

export default AddAssessmentToTestEventComponent;
