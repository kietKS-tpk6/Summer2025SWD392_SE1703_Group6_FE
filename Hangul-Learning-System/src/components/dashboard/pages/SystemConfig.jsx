import React, { useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, Typography, Select, Spin, message } from 'antd';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';

const { Title } = Typography;

const configKeys = [
  { key: 'class_maxStudent', label: 'Số học sinh tối đa mỗi lớp', type: 'number' },
  { key: 'class_minStudent', label: 'Số học sinh tối thiểu mỗi lớp', type: 'number' },
  { key: 'class_maxSlot', label: 'Số slot tối đa mỗi lớp', type: 'number' },
  { key: 'banner_num1', label: 'Banner số 1', type: 'text' },
  { key: 'student_registration_deadline_days', label: 'Số ngày hạn đăng ký học sinh', type: 'number' },
  { key: 'default_language', label: 'Ngôn ngữ mặc định', type: 'text' },
  { key: 'maintenance_mode', label: 'Chế độ bảo trì', type: 'switch' },
  { key: 'support_email', label: 'Email hỗ trợ', type: 'text' },
  { key: 'support_address', label: 'Địa chỉ hỗ trợ', type: 'text' },
  { key: 'support_phone', label: 'Số điện thoại hỗ trợ', type: 'text' },
  { key: 'auto_approve_test_after_pending_duration', label: 'Tự động duyệt bài kiểm tra sau (phút)', type: 'number' },
  { key: 'max_mcq_option_per_question', label: 'Số lựa chọn tối đa cho mỗi câu hỏi trắc nghiệm', type: 'number' },
  { key: 'default_password_for_account', label: 'Mật khẩu mặc định cho tài khoản mới', type: 'password' },
  { key: 'min_days_before_class_start_for_creation', label: 'Số ngày tối thiểu trước khi mở lớp', type: 'number' },
  { key: 'min_mcq_option_per_question', label: 'Số lựa chọn tối thiểu cho mỗi câu hỏi trắc nghiệm', type: 'number' },
  { key: 'auto_approve_class_open_duration', label: 'Tự động duyệt mở lớp sau (phút)', type: 'number' },
  { key: 'class_status_update_time', label: 'Thời gian cập nhật trạng thái lớp (phút)', type: 'number' },
  { key: 'max_total_weeks_allowed', label: 'Tổng số tuần tối đa cho phép', type: 'number' },
  { key: 'max_weekly_slots_allowed', label: 'Số slot tối đa mỗi tuần', type: 'number' },
  { key: 'max_total_minutes_allowed', label: 'Tổng số phút tối đa cho phép', type: 'number' },
];

const SystemConfig = () => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [configData, setConfigData] = useState(null);

  const onFinish = (values) => {
    setLoading(true);
    // TODO: Gửi dữ liệu cấu hình lên server
    setTimeout(() => {
      setLoading(false);
      window.alert('Cấu hình đã được lưu (demo)!');
    }, 1000);
  };

  const fetchConfig = async (key) => {
    setFetching(true);
    setConfigData(null);
    try {
      const res = await axios.get(`${API_URL}${endpoints.systemConfig.getConfigByKey}${key}`);
      if (res.data && res.data.success && res.data.data) {
        setConfigData(res.data.data);
        // Gán giá trị vào form
        form.setFieldsValue({ value: parseValue(res.data.data.value, key) });
      } else {
        setConfigData(null);
        form.setFieldsValue({ value: undefined });
        message.error('Không lấy được cấu hình!');
      }
    } catch (err) {
      setConfigData(null);
      form.setFieldsValue({ value: undefined });
      message.error('Lỗi khi lấy cấu hình!');
    } finally {
      setFetching(false);
    }
  };

  // Chuyển đổi giá trị về đúng kiểu input
  const parseValue = (value, key) => {
    const type = configKeys.find(k => k.key === key)?.type;
    if (type === 'number') return Number(value);
    if (type === 'switch') return value === 'true' || value === true;
    return value;
  };

  const renderInput = (keyObj) => {
    switch (keyObj.type) {
      case 'number':
        return <Form.Item name="value" label={keyObj.label} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><InputNumber style={{ width: '100%' }} /></Form.Item>;
      case 'switch':
        return <Form.Item name="value" label={keyObj.label} valuePropName="checked"><Switch /></Form.Item>;
      case 'password':
        return <Form.Item name="value" label={keyObj.label} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><Input.Password style={{ width: '100%' }} /></Form.Item>;
      default:
        return <Form.Item name="value" label={keyObj.label} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><Input style={{ width: '100%' }} /></Form.Item>;
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <Title level={2}>Cấu hình hệ thống</Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        key={selectedKey}
      >
        <Form.Item name="key" label="Chọn cấu hình" rules={[{ required: true, message: 'Vui lòng chọn một cấu hình!' }]}> 
          <Select
            placeholder="Chọn cấu hình cần chỉnh"
            onChange={value => {
              setSelectedKey(value);
              form.setFieldsValue({ value: undefined });
              fetchConfig(value);
            }}
            options={configKeys.map(k => ({ value: k.key, label: k.label }))}
          />
        </Form.Item>
        {fetching && <Spin style={{ marginBottom: 16 }} />}
        {selectedKey && !fetching && renderInput(configKeys.find(k => k.key === selectedKey))}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block disabled={!selectedKey}>
            Lưu cấu hình
          </Button>
        </Form.Item>
      </Form>
      {configData && (
        <div style={{ marginTop: 16, color: '#888', fontSize: 15, lineHeight: 2 }}>
          <div><b>Mô tả:</b> {configData.description}</div>
          <div><b>Kiểu dữ liệu:</b> {configData.dataType}</div>
          <div><b>Đã kích hoạt:</b> {configData.isActive ? 'Có' : 'Không'}</div>
        </div>
      )}
    </div>
  );
};

export default SystemConfig; 