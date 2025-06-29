import React, { useEffect, useState } from 'react';
import { Layout, Descriptions, Tag, Spin, Alert, Button, Input, DatePicker, Select, message, Upload, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import dayjs from 'dayjs';
import Sidebar from '../../components/dashboard/Sidebar';
import HeaderBar from '../../components/header/Header';
import FooterBar from '../../components/footer/Footer';

const { Content } = Layout;
const { Option } = Select;

const genderMap = { 0: 'Nam', 1: 'Nữ', 2: 'Khác' };
const roleMap = { 1: 'Quản trị', 2: 'Học sinh', 3: 'Giảng viên', 4: 'Quản lý' };
// const statusMap = { 0: <Tag color="green">Đang hoạt động</Tag>, 1: <Tag color="red">Ngưng hoạt động</Tag> };

const StudentDetail = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Lấy accountID từ localStorage nếu có đăng nhập, nếu không thì hardcode
    let accountId = 'A00001';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.accountId) accountId = user.accountId;
    } catch {}

    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}api/Account/${accountId}`);
        setStudentData(res.data);
        setAvatarUrl(res.data.image || null);
      } catch (err) {
        setError('Không thể tải thông tin học sinh');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  // Khi bấm chỉnh sửa, copy dữ liệu sang editValues
  const handleEdit = () => {
    setEditValues({
      ...studentData,
      birthDate: studentData.birthDate ? dayjs(studentData.birthDate) : null,
      gender: String(studentData.gender),
      image: studentData.image || '',
    });
    setAvatarUrl(studentData.image || null);
    setIsEditing(true);
  };

  // Khi thay đổi trường
  const handleChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    if (field === 'image') setAvatarUrl(value);
  };

  // Upload avatar
  const handleAvatarChange = async (info) => {
    if (info.file.status === 'uploading') {
      setAvatarUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUploading(false);
      const url = info.file.response?.url || info.file.response?.data?.url || info.file.response;
      setAvatarUrl(url);
      setEditValues(prev => ({ ...prev, image: url }));
      message.success('Tải ảnh thành công!');
    } else if (info.file.status === 'error') {
      setAvatarUploading(false);
      message.error('Tải ảnh thất bại!');
    }
  };

  const customAvatarUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API_URL}${endpoints.cloudinary.uploadAvatar}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(res.data.url || res.data.data?.url || res.data);
    } catch (err) {
      onError(err);
    }
  };

  // Lưu thông tin
  const handleSave = async () => {
    try {
      const payload = {
        ...studentData,
        ...editValues,
        gender: editValues.gender,
        birthDate: editValues.birthDate ? dayjs(editValues.birthDate).format('YYYY-MM-DD') : null,
        image: avatarUrl || '',
      };
      await axios.put(`${API_URL}api/Account/update`, payload);
      message.success('Cập nhật thành công!');
      setIsEditing(false);
      setLoading(true);
      const res = await axios.get(`${API_URL}api/Account/${studentData.accountID}`);
      setStudentData(res.data);
      setAvatarUrl(res.data.image || null);
    } catch (err) {
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
    setAvatarUrl(studentData?.image || null);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      {/* <Sidebar /> */}
      {/* <Layout> */}
        <Content style={{ margin: '24px', padding: '32px', borderRadius: '30px', minHeight: 400 }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Thông tin cá nhân học sinh</h2>
          {loading ? (
            <Spin />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : studentData ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <Avatar size={80} src={avatarUrl} icon={<UserOutlined />} style={{ marginRight: 24 }} />
                <div>
                  <b>{studentData.lastName} {studentData.firstName}</b>
                </div>
              </div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã tài khoản">{studentData.accountID}</Descriptions.Item>
                <Descriptions.Item label="Họ">
                  {isEditing ? (
                    <Input value={editValues.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                  ) : (
                    studentData.lastName
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Tên">
                  {isEditing ? (
                    <Input value={editValues.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                  ) : (
                    studentData.firstName
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  {isEditing ? (
                    <Select value={editValues.gender} onChange={v => handleChange('gender', v)} style={{ width: '100%' }}>
                      <Option value="0">Nam</Option>
                      <Option value="1">Nữ</Option>
                      <Option value="2">Khác</Option>
                    </Select>
                  ) : (
                    genderMap[studentData.gender]
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {isEditing ? (
                    <Input value={editValues.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} />
                  ) : (
                    studentData.phoneNumber
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {isEditing ? (
                    <Input value={editValues.email} onChange={e => handleChange('email', e.target.value)} />
                  ) : (
                    studentData.email
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">
                  {isEditing ? (
                    <DatePicker value={editValues.birthDate} onChange={d => handleChange('birthDate', d)} format="YYYY-MM-DD" style={{ width: '100%' }} />
                  ) : (
                    studentData.birthDate
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">{roleMap[studentData.role]}</Descriptions.Item>
                <Descriptions.Item label="Ảnh đại diện">
                  {isEditing ? (
                    <>
                      <Upload
                        name="file"
                        showUploadList={false}
                        customRequest={customAvatarUpload}
                        onChange={handleAvatarChange}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />} loading={avatarUploading}>Tải ảnh lên</Button>
                      </Upload>
                      {avatarUrl && <Avatar src={avatarUrl} size={64} style={{ marginTop: 12 }} />}
                    </>
                  ) : (
                    studentData.image ? <Avatar src={studentData.image} size={64} /> : null
                  )}
                </Descriptions.Item>
              </Descriptions>
              {isEditing ? (
                <div style={{ marginTop: 24 }}>
                  <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>Lưu</Button>
                  <Button onClick={handleCancel}>Hủy</Button>
                </div>
              ) : (
                <Button
                  type="primary"
                  style={{ marginTop: 24 }}
                  onClick={handleEdit}
                  disabled={!studentData || !studentData.accountID}
                >
                  Chỉnh sửa
                </Button>
              )}
            </>
          ) : null}
        </Content>
      {/* </Layout> */}
    </Layout>
  );
};

export default StudentDetail;
