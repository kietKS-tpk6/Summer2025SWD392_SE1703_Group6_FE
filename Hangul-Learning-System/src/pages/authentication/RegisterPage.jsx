import React, { useState } from "react";
import "./RegisterPage.css";
import { Form, Input, Button, Alert, Select, DatePicker } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onFinish = (values) => {
    setError("");
    setSuccess("");
    if (values.password !== values.confirm) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Xử lý đăng ký ở đây (gọi API nếu có)
    setSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="register-hero-container">
      <div className="register-illustration">
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
        <div className="register-hero-title">
          <h1>Welcome!</h1>
          <p>Create your account to start learning</p>
        </div>
      </div>
      <Form
        className="register-form"
        name="register"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <h2>Đăng ký</h2>
        <div className="register-grid"> 
        <Form.Item
          label="Họ"
          name="lastName"
          rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
        >
          <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập họ..." size="large" />
        </Form.Item>
        <Form.Item
          label="Tên"
          name="firstName"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập tên..." size="large" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: "Vui lòng nhập Số điện thoại!" }]}
        >
          <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập họ..." size="large" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input prefix={<MailOutlined style={{ color: '#fad934' }} />} placeholder="Nhập email..." size="large" />
        </Form.Item>
        <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
            <Select
                placeholder="Chọn giới tính"
                size="large"
                suffixIcon={<UserOutlined style={{ color: '#fad934' }} />}
            >
                <Select.Option value="Male">Nam</Select.Option>
                <Select.Option value="Female">Nữ</Select.Option>
                <Select.Option value="Other">Khác</Select.Option>
            </Select>
        </Form.Item>
        <Form.Item
            label="Ngày sinh"
            name="birthDate"
            rules={[
                { required: true, message: "Vui lòng chọn ngày sinh!" },
                {
                validator: (_, value) => {
                    if (!value) return Promise.reject();
                    const age = new Date().getFullYear() - value.year();
                    return age >= 16 ? Promise.resolve() : Promise.reject("Bạn phải đủ 16 tuổi!");
                }
                }
            ]}
            >
            <DatePicker
                format="DD/MM/YYYY"
                size="large"
                style={{ width: "100%" }}
            />
        </Form.Item>
        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}
        >
          <Input.Password prefix={<LockOutlined style={{ color: '#fad934' }} />} placeholder="Nhập mật khẩu..." size="large" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu"
          name="confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined style={{ color: '#fad934' }} />} placeholder="Xác nhận mật khẩu..." size="large" />
        </Form.Item>
        </div>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
        {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 12 }} />}
        <Button type="primary" htmlType="submit" className="register-btn" size="large" block>
          Đăng ký
        </Button>
        <div className="register-footer">
          <span>Đã có tài khoản?</span>
          <a href="/login">Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
