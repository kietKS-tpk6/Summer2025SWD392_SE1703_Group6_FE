import React, { useEffect, useState } from 'react';
import { Layout, Descriptions, Tag, Spin, Alert, Button, Input, DatePicker, Select, message, Upload, Avatar, Modal } from 'antd';
import { UploadOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import dayjs from 'dayjs';
import Notification from './Notification';
import { useParams, useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

// Map enum string sang tiếng Việt
const genderViMap = { Male: 'Nam', Female: 'Nữ', Other: 'Khác' };
const roleViMap = { Manager: 'Quản lý', Lecture: 'Giảng viên', Student: 'Học sinh' };
// Map ngược lại từ tiếng Việt sang enum tiếng Anh
const genderEnMap = { 'Nam': 'Male', 'Nữ': 'Female', 'Khác': 'Other' };
const roleEnMap = { 'Quản lý': 'Manager', 'Giảng viên': 'Lecture', 'Học sinh': 'Student' };
const statusViMap = {
  Active: 'Đang hoạt động',
  Blocked: 'Đã bị khóa',
  Deleted: 'Đã xóa',
};
// const statusMap = { 0: <Tag color="green">Đang hoạt động</Tag>, 1: <Tag color="red">Ngưng hoạt động</Tag> };

const AccountDetail = ({ accountID: propAccountID }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [latestUploadedImage, setLatestUploadedImage] = useState(null);
  const [notification, setNotification] = useState({ visible: false, type: 'success', message: '', description: '' });
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  // Thêm biến kiểm tra role của user đăng nhập
  let showBackButton = false;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'Manager') showBackButton = true;
  } catch {}

  useEffect(() => {
    // Lấy accountID từ prop, nếu không có thì lấy từ URL, nếu không thì hardcode
    let accountId = propAccountID || params.accountId || 'A00001';
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!propAccountID && !params.accountId && user && user.accountId) accountId = user.accountId;
    } catch {}

    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}api/Account/${accountId}`);
        // Map dữ liệu về đúng format
        const apiData = res.data;
        const genderStr = genderViMap[apiData.gender] || apiData.gender;
        const roleStr = apiData.role; // giữ nguyên enum tiếng Anh
        // Giữ nguyên status là enum chuỗi từ backend
        const mappedData = {
          accountID: apiData.accountID,
          lastName: apiData.lastName,
          firstName: apiData.firstName,
          gender: genderStr,
          phoneNumber: apiData.phoneNumber,
          email: apiData.email,
          birthDate: apiData.birthDate,
          role: roleStr, // enum tiếng Anh
          status: apiData.status,
          img: apiData.img || 'https://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
        };
        console.log('Fetched account data:', mappedData);
        setStudentData(mappedData);
        setAvatarUrl(mappedData.img);
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError('Không thể tải thông tin học sinh');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [propAccountID, params.accountId]);

  // Hàm buildPayload dùng chung
  const buildPayload = (overrides = {}) => {
    // Ưu tiên URL mới nhất từ overrides nếu có
    const finalImageUrl = overrides.image || latestUploadedImage || editValues.image || avatarUrl || studentData.img || '';
    
    const payload = {
      accountID: studentData.accountID,
      firstName: editValues.firstName || studentData.firstName,
      lastName: editValues.lastName || studentData.lastName,
      phoneNumber: editValues.phoneNumber || studentData.phoneNumber,
      email: editValues.email || studentData.email,
      gender: genderEnMap[editValues.gender] || editValues.gender || 'Male',
      role: roleEnMap[editValues.role] || editValues.role || studentData.role,
      status: editValues.status || studentData.status || 'Active',
      birthDate: editValues.birthDate
        ? dayjs(editValues.birthDate).format('YYYY-MM-DD')
        : studentData.birthDate,
      img: finalImageUrl,
    };
    
    // Debug log để kiểm tra giá trị img
    console.log('Debug buildPayload:');
    console.log('- overrides.image:', overrides.image);
    console.log('- latestUploadedImage:', latestUploadedImage);
    console.log('- editValues.image:', editValues.image);
    console.log('- avatarUrl:', avatarUrl);
    console.log('- studentData.img:', studentData.img);
    console.log('- Final img value:', payload.img);
    
    return payload;
  };

  const handleEditConfirmed = () => {
    const currentImage = studentData.img || avatarUrl || '';
    setEditValues({
      ...studentData,
      birthDate: studentData.birthDate ? dayjs(studentData.birthDate) : null,
      gender: studentData.gender,
      image: currentImage,
    });
    setAvatarUrl(currentImage || null);
    setLatestUploadedImage(null);
    setIsEditing(true);
    setShowEditConfirm(false);
  };

  const handleEdit = () => {
    setShowEditConfirm(true);
  };

  // Khi thay đổi trường
  const handleChange = (field, value) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    if (field === 'image') {
      setAvatarUrl(value);
      console.log('handleChange - updated image:', value);
    }
  };

  // Upload avatar
  const handleAvatarChange = async (info) => {
    if (info.file.status === 'uploading') {
      setAvatarUploading(true);
      return;
    }
    if (info.file.status === 'done') {
      setAvatarUploading(false);
      const url = typeof info.file.response === 'string'
        ? info.file.response
        : info.file.response?.url || info.file.response?.data?.url;
      
      console.log('handleAvatarChange - new image URL:', url);
      
      // Cập nhật state với callback để đảm bảo thứ tự
      setAvatarUrl(url);
      setLatestUploadedImage(url);
      setEditValues(prev => {
        const updated = { ...prev, image: url };
        console.log('Updated editValues.image:', updated.image);
        return updated;
      });
      
      message.success('Tải ảnh thành công!');

      // Đợi một chút để state được cập nhật trước khi gửi request
      await new Promise(resolve => setTimeout(resolve, 100));

      // Gửi đầy đủ thông tin lên backend khi đổi ảnh
      try {
        // Tạo payload với URL mới trực tiếp
        const payload = {
          accountID: studentData.accountID,
          firstName: editValues.firstName || studentData.firstName,
          lastName: editValues.lastName || studentData.lastName,
          phoneNumber: editValues.phoneNumber || studentData.phoneNumber,
          email: editValues.email || studentData.email,
          gender: genderEnMap[editValues.gender] || editValues.gender || 'Male',
          role: roleEnMap[editValues.role] || editValues.role || studentData.role,
          status: editValues.status || studentData.status || 'Active',
          birthDate: editValues.birthDate
            ? dayjs(editValues.birthDate).format('YYYY-MM-DD')
            : studentData.birthDate,
          img: url, // Sử dụng URL mới trực tiếp
        };
        
        // console.log('Payload khi đổi ảnh (với URL mới):', payload);
        // console.log(studentData.accountID);
        const res = await axios.put(`${API_URL}api/Account/update`, payload);
        console.log(res);
        if (res.data && res.data.success) {
          try {
            const refreshed = await axios.get(`${API_URL}api/Account/${studentData.accountID}`);
            const refreshedData = {
              ...refreshed.data,
              img: url, // fallback nếu backend chưa cập nhật kịp
            };
            setStudentData(refreshedData);
            setAvatarUrl(refreshedData.img);
            message.success('Cập nhật ảnh đại diện thành công!');
            setNotification({ visible: true, type: 'success', message: 'Cập nhật ảnh đại diện thành công!', description: '' });
            window.location.reload();
          } catch (refreshError) {
            console.error('Lỗi khi load lại dữ liệu sau khi upload avatar:', refreshError);
            message.warning('Tải ảnh xong nhưng không thể làm mới thông tin người dùng');
          }
        } else {
          setNotification({ visible: true, type: 'error', message: 'Cập nhật thất bại!', description: res.data?.message || '' });
        }
      } catch (err) {
        console.error('Error updating avatar:', err);
        message.error('Cập nhật ảnh đại diện thất bại!');
      }
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
    // Validate đầu vào
    if (!editValues.firstName || !editValues.lastName || !editValues.email) {
      message.warning('Vui lòng nhập đầy đủ họ, tên và email!');
      return;
    }
    
    console.log('handleSave - editValues:', editValues);
    console.log('handleSave - avatarUrl:', avatarUrl);
    
    try {
      // Đảm bảo sử dụng ảnh mới nhất
      const currentImage = latestUploadedImage || avatarUrl || editValues.image || studentData.img || '';
      const payload = buildPayload({ image: currentImage });
      console.log('Payload gửi lên:', payload);
      const res = await axios.put(`${API_URL}api/Account/update`, payload);
      if (res.data && res.data.success) {
        setNotification({ visible: true, type: 'success', message: 'Cập nhật thành công!', description: res.data.message || '' });
        setIsEditing(false);
        setLoading(true);
        const refreshed = await axios.get(`${API_URL}api/Account/${studentData.accountID}`);
        const refreshedData = {
          ...refreshed.data,
          img: refreshed.data.img || avatarUrl,
        };
        setStudentData(refreshedData);
        setAvatarUrl(refreshedData.img);
      } else {
        setNotification({ visible: true, type: 'error', message: 'Cập nhật thất bại!', description: res.data?.message || '' });
      }
    } catch (err) {
      setNotification({ visible: true, type: 'error', message: 'Cập nhật thất bại!', description: err?.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    setEditValues({});
    setAvatarUrl(studentData?.img || null);
    setLatestUploadedImage(null);
  };

  // Thêm hàm kiểm tra role
  const isManager = (studentData?.role === 'Manager' || (editValues?.role === 'Manager'));

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Notification
        visible={notification.visible}
        type={notification.type}
        message={notification.message}
        description={notification.description}
        onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
      />
      {/* <Sidebar /> */}
      {/* <Layout> */}
        <Content style={{ margin: '24px', padding: '32px', borderRadius: '30px', minHeight: 400 }}>
          {showBackButton && (
            <Button
              style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/dashboard/users')}
              type="primary"
            >
              Quay lại
            </Button>
          )}
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Thông tin cá nhân</h2>
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
                <div style={{ marginLeft: 32 }}>
                  <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={customAvatarUpload}
                    onChange={handleAvatarChange}
                    accept="image/*"
                  >
                    <Button icon={<UploadOutlined />} loading={avatarUploading}>
                      Đổi ảnh đại diện
                    </Button>
                  </Upload>
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
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                      <Option value="Khác">Khác</Option>
                    </Select>
                  ) : (
                    studentData.gender
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
                    <DatePicker value={editValues.birthDate ? dayjs(editValues.birthDate) : null} onChange={d => handleChange('birthDate', d)} format="YYYY-MM-DD" style={{ width: '100%' }} />
                  ) : (
                    studentData.birthDate
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Vai trò">
                  {isEditing && isManager ? (
                    <Select value={editValues.role} onChange={v => handleChange('role', v)} style={{ width: '100%' }}>
                      <Option value="Manager">Quản lý</Option>
                      <Option value="Lecture">Giảng viên</Option>
                      <Option value="Student">Học sinh</Option>
                    </Select>
                  ) : (
                    roleViMap[studentData.role] || studentData.role
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  {isEditing && isManager ? (
                    <Select value={editValues.status} onChange={v => handleChange('status', v)} style={{ width: '100%' }}>
                      <Option value="Active">Đang hoạt động</Option>
                      <Option value="Blocked">Đã bị khóa</Option>
                      <Option value="Deleted">Đã xóa</Option>
                    </Select>
                  ) : (
                    statusViMap[studentData.status] || studentData.status
                  )}
                </Descriptions.Item>
              </Descriptions>
              {isEditing ? (
                <div style={{ marginTop: 24 }}>
                  <Button type="primary" onClick={() => setShowSaveConfirm(true)} style={{ marginRight: 8 }}>Lưu</Button>
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
          <Modal
            open={showEditConfirm}
            onCancel={() => setShowEditConfirm(false)}
            onOk={handleEditConfirmed}
            okText="Đồng ý"
            cancelText="Hủy"
            title="Bạn có chắc muốn chỉnh sửa?"
          >
            Thao tác này sẽ cho phép chỉnh sửa thông tin cá nhân.
          </Modal>
          <Modal
            open={showSaveConfirm}
            onCancel={() => setShowSaveConfirm(false)}
            onOk={() => {
              setShowSaveConfirm(false);
              handleSave();
            }}
            okText="Đồng ý"
            cancelText="Hủy"
            title="Bạn có chắc muốn lưu thay đổi?"
          >
            {isManager ? (
              'Thao tác này sẽ lưu lại các thay đổi thông tin cá nhân của người dùng này.'
            ) : (
              'Thao tác này sẽ lưu lại các thay đổi thông tin cá nhân của bạn.'
            )}
          </Modal>
        </Content>
      {/* </Layout> */}
    </Layout>
  );
};

export default AccountDetail;
