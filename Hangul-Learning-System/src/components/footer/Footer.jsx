import React from 'react';
import { Layout } from 'antd';
import { FacebookFilled, TwitterSquareFilled, YoutubeFilled, MailOutlined } from '@ant-design/icons';
import './Footer.css';

const { Footer: AntFooter } = Layout;

const Footer = () => (
  <AntFooter className="footer">
    <div className="footer__copyright">
      © {new Date().getFullYear()} Hệ Thống Học Tập Trực Tuyến. Đã đăng ký bản quyền.
    </div>
    <div className="footer__contact">
      <MailOutlined style={{ marginRight: 6 }} />
      Liên hệ: <a href="mailto:support@elearning.com">support@elearning.com</a>
    </div>
    <div className="footer__social">
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FacebookFilled /></a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><TwitterSquareFilled /></a>
      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><YoutubeFilled /></a>
    </div>
  </AntFooter>
);

export default Footer; 