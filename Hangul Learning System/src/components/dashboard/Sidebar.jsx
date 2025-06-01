import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  ApartmentOutlined,
  ReadOutlined,
  BarChartOutlined,
  CommentOutlined,
  CalendarOutlined,
  IdcardOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Bảng điều khiển',
    },
    {
      key: '/dashboard/users',
      icon: <TeamOutlined />, // icon người dùng nhóm
      label: 'Quản lí tài khoản',
    },
    {
      key: '/dashboard/subject',
      icon: <BookOutlined />, // icon sách
      label: 'Quản lí môn học',
    },
    {
      key: '/dashboard/class',
      icon: <ApartmentOutlined />, // icon sơ đồ lớp/phòng
      label: 'Quản lí lớp học',
    },
    {
      key: '/dashboard/blog',
      icon: <ReadOutlined />, // icon đọc bài viết
      label: 'Quản lí Blog',
    },
    {
      key: '/dashboard/analytics',
      icon: <BarChartOutlined />,
      label: 'Phân tích & Đánh giá',
    },
    {
      key: '/dashboard/chat',
      icon: <CommentOutlined />, // icon tin nhắn
      label: 'Chat',
    },
    {
      key: '/dashboard/schedule',
      icon: <CalendarOutlined />,
      label: 'Lịch học',
    },
    {
      key: '/dashboard/profile',
      icon: <IdcardOutlined />, // icon thẻ ID
      label: 'Hồ sơ',
    },
    {
      key: '/dashboard/settings',
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
        padding: '24px 0',
      }}
    >
      <div>
        {/* Logo & Slogan */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 32,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#4fd18b', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, color: '#fff', fontWeight: 700, marginBottom: 8
          }}>
            E
          </div>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#000' }}>Hangul Learning</div>
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

export default Sidebar;
