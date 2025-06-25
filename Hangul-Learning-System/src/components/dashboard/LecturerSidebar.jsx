import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  CommentOutlined,
  IdcardOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import logo from '../../../public/images/logoB.png'
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../../utils/auth';

const { Sider } = Layout;

const LecturerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems = [
    {
      key: '/lecturer',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: '/lecturer/courses',
      icon: <BookOutlined />,
      label: 'Khóa học của tôi',
    },
    {
      key: '/lecturer/schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch giảng dạy',
    },
    {
      key: '/lecturer/assignments',
      icon: <FileTextOutlined />,
      label: 'Bài tập',
    },
    {
      key: '/lecturer/students',
      icon: <TeamOutlined />,
      label: 'Học viên',
    },
    {
      key: '/lecturer/messages',
      icon: <CommentOutlined />,
      label: 'Tin nhắn',
    },
    {
      key: '/lecturer/profile',
      icon: <IdcardOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: '/lecturer/settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider
      width={270}
      style={{
        height: '100vh',        // full chiều cao màn hình
        position: 'sticky',     // hoặc 'fixed' nếu muốn Sidebar đứng yên khi scroll
        top: 0,                 // dính sát trên cùng
        left: 0,                // nếu fixed thì cần để dính sát trái
        background: 'linear-gradient(180deg, #f8fbff 0%, #f3f7fa 100%)',
        borderRadius: '0px 30px 30px 0px',  // bo tròn góc phải
        margin: 0,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        zIndex: 1000,           // đảm bảo nổi trên các phần khác
      }}
    >
      <div
        style={{
          padding: '20px 0',
          textAlign: 'center',
          borderBottom: '1px solid #eee',
        }}
      >
        <img
          src={logo}
          alt="Logo"
          style={{ width: 100, height: 100, margin: '0 auto' }}
        />
        <div style={{ fontWeight: 700, fontSize: 20, color: '#000', marginTop: 10 }}>
          Lecturer
        </div>
        <div style={{ fontSize: 12, color: '#b0b7c3' }}>Learn From Home</div>
      </div>

      <div
        style={{
          flex: 1,                 // phần này chiếm hết chiều cao còn lại
          overflowY: 'auto',       // cuộn bên trong menu nếu dài
          padding: '0 16px',
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: 16,
            fontWeight: 500,
          }}
        />
      </div>
    </Sider>
  );
};

export default LecturerSidebar; 