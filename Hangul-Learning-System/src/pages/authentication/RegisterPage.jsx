import React, { useState } from "react";
import "../../styles/RegisterPage.css";
import { Form, Input, Button, Alert, Select, DatePicker, Modal } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, endpoints } from "../../config/api";
import dayjs from "dayjs";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  // Step 1: Gửi OTP
  const handleSendOtp = async () => {
    try {
      setError("");
      setLoading(true);
      const values = await form.validateFields();

      // Kiểm tra email đã tồn tại chưa
      const checkRes = await axios.get(API_URL + "api/Account/search",{
          params: {
            SearchValue: values.email,
            SearchByEmail: true
          }
        }
      );
      if (checkRes.data && checkRes.data.data && checkRes.data.data.length > 0) {
        form.setFields([
          {
            name: 'email',
            errors: ['Email này đã được sử dụng']
          }
        ]);
        setLoading(false);
        return;
      }

      setEmail(values.email);
      await axios.post(API_URL + endpoints.account.sendOTP, { email: values.email });
      setStep(2);
      setOtp("");
      setOtpModalVisible(true);
    } catch (err) {
      // Nếu lỗi là do validate form thì không hiển thị lỗi chung
      if (err && err.errorFields) {
        // Không setError, Form đã hiển thị lỗi dưới từng trường
      } else {
        setError("Không thể gửi OTP: " + (err.response?.data || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Xác thực OTP và đăng ký
  const handleVerifyAndRegister = async () => {
    try {
      setError("");
      setLoading(true);
      const values = await form.validateFields();
      if (!otp) {
        setError("Vui lòng nhập OTP!");
        setLoading(false);
        return;
      }
      // Xác thực OTP
      await axios.post(API_URL + endpoints.account.verifyOTP, { email: values.email, otp });
      // Đăng ký
      const registerData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : "",
        gender: values.gender,
        password: values.password,
      };
      await axios.post(API_URL + endpoints.account.register, registerData);
      setSuccess("Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập...");
      setStep(3);
      setOtpModalVisible(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      let errorMsg = "Lỗi xác thực hoặc đăng ký!";
      if (err.response && err.response.data) {
        const backendMsg = typeof err.response.data === 'string' ? err.response.data : err.response.data.errorMessage;
        if (backendMsg) {
          errorMsg = backendMsg;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
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
        form={form}
        autoComplete="off"
      >
        <h2>Đăng ký</h2>
        <div className="register-grid">
          <Form.Item
            label="Họ"
            name="lastName"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập họ..." size="large" disabled={step !== 1} />
          </Form.Item>
          <Form.Item
            label="Tên"
            name="firstName"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập tên..." size="large" disabled={step !== 1} />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập Số điện thoại!" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  // Chuẩn hóa: bỏ dấu cách, chỉ lấy số
                  const phone = value.replace(/\s+/g, "");
                  // Regex kiểm tra số điện thoại Việt Nam theo yêu cầu
                  const regex = /^(0|\+84|84)(3[2-9]|5[689]|7[06789]|8[1-9]|9[0-9])\d{7}$/;
                  if (regex.test(phone)) {
                    return Promise.resolve();
                  }
                  return Promise.reject("Số điện thoại không hợp lệ");
                }
              }
            ]}
          >
            <Input prefix={<UserOutlined style={{ color: '#fad934' }} />} placeholder="Nhập số điện thoại..." size="large" disabled={step !== 1} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<MailOutlined style={{ color: '#fad934' }} />} placeholder="Nhập email..." size="large" disabled={step !== 1} />
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
              disabled={step !== 1}
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
                  const age = dayjs().year() - value.year();
                  return age >= 16 ? Promise.resolve() : Promise.reject("Bạn phải đủ 16 tuổi!");
                }
              }
            ]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              size="large"
              style={{ width: "100%" }}
              disabled={step !== 1}
            />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }, { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" }]}
          >
            <Input.Password prefix={<LockOutlined style={{ color: '#fad934' }} />} placeholder="Nhập mật khẩu..." size="large" disabled={step !== 1} />
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
            <Input.Password prefix={<LockOutlined style={{ color: '#fad934' }} />} placeholder="Xác nhận mật khẩu..." size="large" disabled={step !== 1} />
          </Form.Item>
        </div>
        {step === 2 && (
          <Modal
            title={<span style={{ fontWeight: 700, color: '#b48a00', display: 'flex', alignItems: 'center' }}><SafetyCertificateOutlined style={{ color: '#fad934', marginRight: 8, fontSize: 22 }} />Nhập mã OTP xác nhận</span>}
            open={otpModalVisible}
            onCancel={() => setOtpModalVisible(false)}
            footer={null}
            centered
            maskClosable={false}
            bodyStyle={{ background: '#fff9f3', borderRadius: 12, boxShadow: '0 2px 16pxrgb(255, 247, 228)' }}
          >
            <Input
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              size="large"
              maxLength={6}
              style={{
                marginBottom: 16,
                background: '#fff',
                borderRadius: 8,
                fontWeight: 600,
                color: '#b48a00',
              }}

            />
            {error && (
              <div style={{ color: '#d4380d', background: '#fff2e8', border: '1px solid #ffd36b', borderRadius: 6, padding: '6px 12px', marginBottom: 12, fontWeight: 500 }}>
                {error}
              </div>
            )}
            <Button
              type="primary"
              onClick={handleVerifyAndRegister}
              loading={loading}
              block
              style={{
                background: 'linear-gradient(90deg,rgb(255, 240, 167) 0%, #ffd36b 100%)',
                border: 'none',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                borderRadius: 8,
                boxShadow: '0 2px 8px #ffe9b0',
                marginTop: 4
              }}
            >
              Xác thực & Đăng ký
            </Button>
          </Modal>
        )}
        {/* Không hiển thị lỗi chung khi lỗi email đã được sử dụng, lỗi sẽ hiển thị ở ô email */}
        {error && step !== 1 && <Alert message={error} type="error" showIcon style={{ marginBottom: 12 }} />}
        {success && <Alert message={success} type="success" showIcon style={{ marginBottom: 12 }} />}
        {step === 1 && (
          <Button type="primary" onClick={handleSendOtp} className="register-btn" size="large" block loading={loading}>
            Xác Nhận
          </Button>
        )}
        {step === 3 && (
          <div style={{ textAlign: "center", margin: "16px 0" }}>
            <h3>Đăng ký thành công!</h3>
            <p>Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...</p>
          </div>
        )}
        <div className="register-footer">
          <span>Đã có tài khoản?</span>
          <a href="/login">Đăng nhập</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;
