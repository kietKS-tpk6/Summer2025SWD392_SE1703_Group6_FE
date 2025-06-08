import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCardOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import '../../styles/Payment.css';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // For testing: Randomly succeed or fail
      const isSuccess = Math.random() > 0.5;
      if (isSuccess) {
        window.location.href = '/payment-success';
      } else {
        window.location.href = '/payment-failed';
      }
    }, 2000);
  };

  return (
    <motion.div 
      className="payment-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="payment-form-header">
        <CreditCardOutlined style={{ fontSize: '24px', marginRight: '10px' }} />
        <h2>Thanh toán</h2>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label>Số thẻ</label>
          <div className="input-with-icon">
            <CreditCardOutlined className="input-icon" />
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength="19"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Tên chủ thẻ</label>
          <div className="input-with-icon">
            <UserOutlined className="input-icon" />
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleInputChange}
              placeholder="NGUYEN VAN A"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ngày hết hạn</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
          </div>

          <div className="form-group">
            <label>CVV</label>
            <div className="input-with-icon">
              <LockOutlined className="input-icon" />
              <input
                type="password"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
                required
              />
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          className="submit-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Thanh toán'}
        </motion.button>
      </form>

      <div className="payment-info">
        <p className="test-info">
          <strong>Thông tin test:</strong><br />
          - Số thẻ: 4111 1111 1111 1111<br />
          - Ngày hết hạn: Bất kỳ ngày nào trong tương lai<br />
          - CVV: Bất kỳ 3 chữ số nào
        </p>
      </div>
    </motion.div>
  );
};

export default PaymentForm; 