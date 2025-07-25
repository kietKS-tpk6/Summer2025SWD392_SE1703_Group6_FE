import React, { useState } from 'react';
import { Layout, Menu, Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import {HiMenuAlt4, HiX} from 'react-icons/hi';
import {motion} from 'framer-motion';
import '../../styles/Header.css';
import Logo from '../../assets/Logo.svg';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons'; // Thêm icon
import { getUser, logout, getUserRole, getRedirectPath } from '../../utils/auth';

const { Header } = Layout;

const Items = [
  { label: 'Trang chủ', key: '/' },
  { label: 'Khóa học', key: '/classes' },
  { label: 'Về chúng tôi', key: '/about', disabled: true },
  { label: 'Tin tức', key: '/news', disabled: true },
];

const HeaderBar = () => {
  const navigate = useNavigate();
  const [toggle, setToggle] = useState(false);

  const handleApplyNow = () => {
    navigate('/login');
  };

  const user = getUser();

  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: () => {
        logout();
        navigate('/login');
      },
    });
  };

  return (
    <nav className="app__navbar-outer">
      <div className='app__navbar'>
        <div className='app__navbar-logo'>
          <img src={Logo} alt="Logo"/>
        </div>
        <div className='app__navlinks'>
          <ul>
            {Items.map((item) => (
              <li
                className="app__navlink"
                key={item.key}
                onClick={() => navigate(item.key)}
              >
                <a>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className='app__nav-actions'>
          {!user ? (
            <button className='app__navbar-btn' onClick={handleApplyNow}>Đăng Ký Ngay</button>
          ) : (
            <div className="app__navbar-user">
              <span className="app__navbar-hello">
                <UserOutlined style={{ marginRight: 6, color: "#fbb040" }} onClick={() => {
                  const role = getUserRole();
                  if (role === 'Manager') navigate('/dashboard');
                  else if (role === 'Lecture') navigate('/lecturer');
                  else if (role === 'Student') navigate('/student/enroll');
                  else navigate('/');
                }} />
                Chào, <span style={{marginRight: 4}}></span><b>{user.firstName}</b>
              </span>
              <button className="app__navbar-logout" onClick={handleLogout} title="Đăng xuất">
                <LogoutOutlined style={{ fontSize: 20, color: "#fbb040" }} />
              </button>
            </div>
          )}
        </div>
        <div className='app__navbar-menu'>
          <HiMenuAlt4 onClick={() => setToggle(true)} />
          {toggle && (
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: 300,
                transition: { duration: 0.5, type: "spring", damping: 10 }
              }}
              exit={{ width: 0 }}
            >
              <HiX onClick={() => setToggle(false)} />
              <ul>
                {Items.map((item) => (
                  <li key={item.key}>
                    <a onClick={() => {
                      navigate(item.key);
                      setToggle(false);
                    }}>
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button className='app__navbar-menu-btn' onClick={handleApplyNow}>
                    Đăng Ký Ngay
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderBar;