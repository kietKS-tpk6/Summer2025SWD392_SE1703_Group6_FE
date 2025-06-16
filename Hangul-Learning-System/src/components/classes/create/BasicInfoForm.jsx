import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Upload, Button, message  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../../config/api';

const BasicInfoForm = React.forwardRef(({ lectures = [], subjects = [], formData = {}, onChange }, ref) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = React.useState(false);
  const [imageURL, setImageURL] = useState(); 

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
        label="Giảng viên"
        name="accountID"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
      >
        <Select 
          placeholder="Chọn giảng viên"
          onChange={(value, option) => {
            const selectedLecturer = lectures.find(lec => lec.accountID === value);
            if (selectedLecturer) {
              const fullName = `${selectedLecturer.lastName} ${selectedLecturer.firstName}`;
              form.setFieldsValue({ 
                accountID: value,
                lecturerName: fullName 
              });
              handleValuesChange(null, { 
                ...form.getFieldsValue(), 
                accountID: value,
                lecturerName: fullName 
              });
            }
          }}
        >
          {lectures.map(lec => (
            <Select.Option key={lec.accountID} value={lec.accountID}>
              {lec.lastName + ' ' + lec.firstName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="lecturerName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Môn học"
        name="subjectID"
        rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
      >
        <Select 
          placeholder="Chọn môn học"
          onChange={(value, option) => {
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
        {imageURL  && (
          <img
            src={imageURL}
            alt="preview"
            style={{ maxWidth: 200, marginTop: 8 }}
          />
        )}
      </Form.Item>
    </Form>
  );
});

export default BasicInfoForm;
