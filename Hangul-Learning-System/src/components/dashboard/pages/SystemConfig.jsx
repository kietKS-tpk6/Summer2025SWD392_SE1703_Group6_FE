import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Switch, Button, Typography, Select, Spin } from 'antd';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';
import Notification from '../../common/Notification';

const { Title } = Typography;

const typeMap = {
  int: 'number',
  string: 'text',
  bool: 'switch',
  password: 'password',
};

const SystemConfig = () => {
  const [form] = Form.useForm();
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [allConfigs, setAllConfigs] = useState([]);
  const [currentConfig, setCurrentConfig] = useState(null);
  const [notification, setNotification] = useState({ visible: false, type: 'success', message: '', description: '' });

  useEffect(() => {
    fetchAllConfigs();
  }, []);

  const fetchAllConfigs = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_URL}${endpoints.systemConfig.getAll}`);
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setAllConfigs(res.data.data);
      } else {
        setAllConfigs([]);
        setNotification({ visible: true, type: 'error', message: 'Lỗi', description: 'Không lấy được danh sách cấu hình!' });
      }
    } catch (err) {
      setAllConfigs([]);
      setNotification({ visible: true, type: 'error', message: 'Lỗi', description: 'Lỗi khi lấy danh sách cấu hình!' });
    } finally {
      setFetching(false);
    }
  };

  const onSelectKey = (key) => {
    setSelectedKey(key);
    const config = allConfigs.find(c => c.key === key);
    setCurrentConfig(config);
    if (config) {
      form.setFieldsValue({ value: parseValue(config.value, config.dataType) });
    } else {
      form.setFieldsValue({ value: undefined });
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}${endpoints.systemConfig.update}`, {
        keyToUpdate: selectedKey,
        value: values.value !== undefined && values.value !== null ? values.value.toString() : ''
      });
      setNotification({
        visible: true,
        type: res.data.success ? 'success' : 'error',
        message: res.data.message || (res.data.success ? 'Cập nhật thành công!' : 'Cập nhật thất bại!'),
        description: '',
      });
      if (res.data.success) {
        fetchAllConfigs(); // reload lại danh sách config để cập nhật value mới
      }
    } catch (err) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'Lỗi',
        description: err?.response?.data?.message || 'Cập nhật thất bại!',
      });
    } finally {
      setLoading(false);
    }
  };

  // Chuyển đổi giá trị về đúng kiểu input
  const parseValue = (value, dataType) => {
    if (dataType === 'int') return Number(value);
    if (dataType === 'bool') return value === 'true' || value === true;
    return value;
  };

  const renderInput = (config) => {
    if (!config) return null;
    const type = typeMap[config.dataType] || 'text';
    switch (type) {
      case 'number':
        return <Form.Item name="value" label={config.description} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><InputNumber style={{ width: '100%' }} /></Form.Item>;
      case 'switch':
        return <Form.Item name="value" label={config.description} valuePropName="checked"><Switch /></Form.Item>;
      case 'password':
        return <Form.Item name="value" label={config.description} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><Input.Password style={{ width: '100%' }} /></Form.Item>;
      default:
        return <Form.Item name="value" label={config.description} rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}><Input style={{ width: '100%' }} /></Form.Item>;
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <Notification
        visible={notification.visible}
        type={notification.type}
        message={notification.message}
        description={notification.description}
        onClose={() => setNotification(n => ({ ...n, visible: false }))}
      />
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
            loading={fetching}
            onChange={onSelectKey}
            options={allConfigs.map(c => ({ value: c.key, label: c.description }))}
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
        {fetching && <Spin style={{ marginBottom: 16 }} />}
        {selectedKey && !fetching && renderInput(currentConfig)}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block disabled={!selectedKey}>
            Lưu cấu hình
          </Button>
        </Form.Item>
      </Form>
      {currentConfig && (
        <div style={{ marginTop: 16, color: '#888', fontSize: 15, lineHeight: 2 }}>
          <div><b>Key:</b> {currentConfig.key}</div>
          <div><b>Mô tả:</b> {currentConfig.description}</div>
          <div><b>Kiểu dữ liệu:</b> {currentConfig.dataType}</div>
          <div><b>Đã kích hoạt:</b> {currentConfig.isActive ? 'Có' : 'Không'}</div>
        </div>
      )}
    </div>
  );
};

export default SystemConfig; 