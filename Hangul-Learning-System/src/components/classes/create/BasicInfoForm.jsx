import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, message, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const BasicInfoForm = React.forwardRef(({ lectures = [], subjects = [], formData = {}, onChange }, ref) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = React.useState(false);
  const [imageURL, setImageURL] = useState();
  const [config, setConfig] = useState({
    minStudent: 0,
    maxStudent: 60
  });

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

  const handleUpload = async ({ file }) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await axios.post(`${API_URL}api/Cloudinary/upload-image-class`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data;
      if (url) {
        form.setFieldsValue({ imageURL: url }); 
        setImageURL(url);
        onChange && onChange({ ...form.getFieldsValue(), imageURL: url });
      }
    } catch (e) {
      message.error('Tải ảnh lên thất bại. Vui lòng thử lại sau!');
    }
    setUploading(false);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={formData}
      onValuesChange={handleValuesChange}
      ref={ref}
    >
      <Form.Item
        label="Môn học"
        name="subjectID"
        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
      >
        <Select 
          placeholder="Chọn môn học"
          onChange={(value) => {
            const selectedSubject = subjects.find(sub => sub.subjectID === value);
            if (selectedSubject) {
              form.setFieldsValue({ 
                subjectID: value,
                subjectName: selectedSubject.subjectName 
              });
              handleValuesChange(null, { 
                ...form.getFieldsValue(), 
                subjectID: value,
                subjectName: selectedSubject.subjectName 
              });
            }
          }}
        >
          {subjects.map(sub => (
            <Select.Option key={sub.subjectID} value={sub.subjectID}>
              {sub.subjectName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="subjectName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tên lớp"
        name="className"
        rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
      >
        <Input placeholder="Nhập tên lớp" />
      </Form.Item>

      <Form.Item
        label="Ảnh lớp"
        name="imageURL"
        rules={[{ required: true, message: 'Vui lòng tải ảnh lớp!' }]}
      >
        <Upload
          customRequest={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />} loading={uploading}>Chọn ảnh</Button>
        </Upload>
        {imageURL && (
          <img
            src={imageURL}
            alt="preview"
            style={{ maxWidth: 200, marginTop: 8 }}
          />
        )}
      </Form.Item>

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
        <InputNumber min={config.minStudent} style={{ width: '100%' }} placeholder='Nhập số học viên tối thiểu' />
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
        <InputNumber max={config.maxStudent} style={{ width: '100%' }} placeholder='Nhập số học viên tối đa' />
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

export default BasicInfoForm;
