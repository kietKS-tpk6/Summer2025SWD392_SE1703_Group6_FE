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
import logo from '../../../public/images/logoB.png'
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
          Manager
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

export default Sidebar;
