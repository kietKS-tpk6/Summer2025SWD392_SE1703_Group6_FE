import React, { useEffect, useRef, useState } from 'react';
import { Form, InputNumber, DatePicker } from 'antd';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const ClassConfigForm = React.forwardRef(({ formData = {}, onChange }, ref) => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState({
    minStudent: 0,
    maxStudent: 60
  });

  useEffect(() => {
    form.setFieldsValue(formData);
  }, [formData]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const [minRes, maxRes] = await Promise.all([
          axios.get(`${API_URL}api/SystemConfig/get-config-by-key/class_minStudent`),
          axios.get(`${API_URL}api/SystemConfig/get-config-by-key/class_maxStudent`)
        ]);
        
        setConfig({
          minStudent: parseInt(minRes.data.data.value) || 0,
          maxStudent: parseInt(maxRes.data.data.value) || 60
        });
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };

    fetchConfig();
  }, []);

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
    >
      <Form.Item
        label={`Số học viên tối thiểu (>= ${config.minStudent})`}
        name="minStudentAcp"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập số học viên tối thiểu!',
          },
          {
            type: 'number',
            min: config.minStudent,
            message: `Số học viên tối thiểu phải lớn hơn hoặc bằng ${config.minStudent}!`,
          },
        ]}
      >
        <InputNumber min={config.minStudent} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={`Số học viên tối đa (<= ${config.maxStudent})`}
        name="maxStudentAcp"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập số học viên tối đa!',
          },
          {
            type: 'number',
            max: config.maxStudent,
            message: `Số học viên tối đa phải nhỏ hơn hoặc bằng ${config.maxStudent}!`,
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              const minStudentAcp = getFieldValue('minStudentAcp');
              if (!value || !minStudentAcp || value > minStudentAcp) {
                return Promise.resolve();
              }
              return Promise.reject('Số học viên tối đa phải lớn hơn số học viên tối thiểu!');
            },
          }),
        ]}
      >
        <InputNumber max={config.maxStudent} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Học phí lớp"
        name="priceOfClass"
        rules={[
          { required: true, message: 'Vui lòng nhập học phí!' },
          { type: 'number', min: 0, message: 'Học phí phải là số không âm!' },
        ]}
        extra="Đơn vị: VNĐ"
      >
        <InputNumber 
          min={0} 
          style={{ width: '100%' }} 
          placeholder="Nhập học phí"
        />
      </Form.Item>
    </Form>
  );
});

export default ClassConfigForm;
