import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import { HomeOutlined, BookOutlined, LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import './Header.css';

const { Header: AntHeader } = Layout;

const items = [
  {
    label: <a href="/">Trang chủ</a>,
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: <a href="/courses">Khóa học</a>,
    key: 'courses',
    icon: <BookOutlined />,
  },
  {
    label: <a href="/login">Đăng nhập</a>,
    key: 'login',
    icon: <LoginOutlined />,
  },
  {
    label: <a href="/logout">Đăng xuất</a>,
    key: 'logout',
    icon: <LogoutOutlined />,
  },
];

const Header = () => (
  <AntHeader className="header">
    <div className="header__logo">
      <Avatar src="/logo192.png" size={40} style={{ marginRight: 12 }} />
      <span className="header__title">Hangul Learning</span>
    </div>
    <Menu
      theme="dark"
      mode="horizontal"
      items={items}
      className="header__nav"
      style={{ flex: 1, justifyContent: 'center', background: 'transparent' }}
    />
  </AntHeader>
);

export default Header; 