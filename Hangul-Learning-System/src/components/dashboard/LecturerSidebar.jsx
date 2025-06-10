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
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const LecturerSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
        minHeight: '80vh',
        background: 'linear-gradient(180deg, #f8fbff 0%, #f3f7fa 100%)',
        borderRadius: '30px',
        margin: '16px 0 16px 16px',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '0px 0',
      }}
    >
      <div>
        {/* Logo & Slogan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 10,
        }}>
          <img src='../../../public/images/logoB.png' alt="" style={{
            width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0'
          }}/>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#000' }}>Lecturer</div>
          <div style={{ fontSize: 12, color: '#b0b7c3' }}>Learn From Home</div>
        </div>

        {/* Menu */}
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