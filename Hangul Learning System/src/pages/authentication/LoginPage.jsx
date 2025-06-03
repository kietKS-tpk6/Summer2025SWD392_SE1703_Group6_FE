import React, { useState } from "react";
import "./LoginPage.css";
import axios from "axios";
import { API_URL, endpoints } from "../../config/api";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setError(null);
    try {
      const response = await axios.post(API_URL + endpoints.account.login, {
        email: values.email,
        password: values.password,
      });
      if (response.data.token) {
        const token = response.data.token;
        const decodedToken = jwtDecode(token);
        localStorage.setItem("token", token);
        localStorage.setItem("role", decodedToken.Role);
        const user = {
          accountId: decodedToken.AccountID,
          firstName: decodedToken.FirstName,
          lastName: decodedToken.LastName,
          role: decodedToken.Role,
        };
        localStorage.setItem("user", JSON.stringify(user));
        switch (decodedToken.Role) {
          case "Manager":
            navigate("/manager");
            break;
          case "Teacher":
            navigate("/teacher");
            break;
          case "Student":
            navigate("/student");
            break;
          default:
            navigate("/");
            break;
        }
      } else if (response.data.errorMessage) {
        setError(response.data.errorMessage);
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("Lỗi khi đăng nhập. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="login-hero-container">
      <div className="login-illustration">
        {/* SVG minh họa học sinh/campus phong cách pastel vàng nhạt */}
        <svg width="340" height="340" viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="170" cy="270" rx="140" ry="50" fill="#ffe9b0"/>
          <ellipse cx="100" cy="220" rx="40" ry="18" fill="#fad934"/>
          <ellipse cx="240" cy="230" rx="50" ry="20" fill="#ffd36b"/>
          <rect x="120" y="120" width="40" height="80" rx="18" fill="#fff9f3"/>
          <rect x="180" y="110" width="40" height="90" rx="18" fill="#fff9f3"/>
          <circle cx="140" cy="110" r="20" fill="#ffe9b0"/>
          <circle cx="200" cy="100" r="20" fill="#ffe9b0"/>
          <ellipse cx="140" cy="130" rx="8" ry="4" fill="#fad934"/>
          <ellipse cx="200" cy="120" rx="8" ry="4" fill="#fad934"/>
        </svg>
        <div className="login-hero-title">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your learning journey</p>
        </div>
      </div>
      <Form
        className="login-form"
        name="login"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2>Đăng nhập</h2>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#fad934' }} />}
            placeholder="Nhập email..."
            size="large"
          />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#fad934' }} />}
            placeholder="Nhập mật khẩu..."
            size="large"
          />
        </Form.Item>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} className="error-text" />}
        <Button type="primary" htmlType="submit" className="login-btn" size="large" block>
          Đăng nhập
        </Button>
        <div className="login-footer">
          <span>Chưa có tài khoản?</span>
          <a href="/register">Đăng ký</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
