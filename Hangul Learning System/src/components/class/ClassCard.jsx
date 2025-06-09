import React from 'react';
import { Card, Button, Tag, Tooltip, Avatar } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import '../../styles/ClassCard.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const statusColor = (status) => (status === 1 ? 'success' : 'default');
const statusText = (status) => (status === 1 ? 'ACTIVE' : 'INACTIVE');

const ClassCard = ({
  imageURL,
  className,
  lecturerName,
  priceOfClass,
  status,
  onView,
  id,
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/class-detail/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="class-card-motion"
    >
      <Card
        hoverable
        className="class-card"
        cover={
          <div className="class-card-img-wrap">
            <img alt={className} src={imageURL} className="class-card-img" />
            {status === 1 && (
              <Tag color="green" className="class-card-badge">Mới</Tag>
            )}
          </div>
        }
        style={{
          width: 320,
          borderRadius: 22,
          margin: '1.2rem 0.7rem',
          boxShadow: '0 8px 32px 0 rgba(251,176,64,0.10), 0 1.5rem 3rem #fbb04011',
          border: 'none',
          overflow: 'visible',
          background: '#fff',
        }}
        bodyStyle={{ padding: '22px 22px 18px 22px', minHeight: 180 }}
      >
        <Tooltip title={className}>
          <h3 className="class-card-title" style={{ marginBottom: 14, minHeight: 48 }}>
            {className}
          </h3>
        </Tooltip>
        <div className="class-card-lecturer-row">
          <Avatar
            size={32}
            icon={<UserOutlined />}
            style={{ background: '#ffe9b0', color: '#fbb040', marginRight: 8 }}
          />
          <span className="class-card-lecturer">{lecturerName}</span>
        </div>
        <div className="class-card-info-row" style={{ margin: '18px 0 16px 0' }}>
          <span className="class-card-price">{priceOfClass} <span style={{ fontSize: 13, fontWeight: 500 }}>VNĐ</span></span>
          <Tag color={statusColor(status)} className="class-card-status">
            {statusText(status)}
          </Tag>
        </div>
        <Button
          type="primary"
          icon={<EyeOutlined />}
          block
          className="class-card-view-btn"
          onClick={handleView}
          style={{
            background: 'linear-gradient(90deg, #fbb040 0%, #ffe9b0 100%)',
            color: '#222',
            border: 'none',
            fontWeight: 700,
            borderRadius: 10,
            fontSize: 16,
            boxShadow: '0 2px 8px #fbb04022',
            letterSpacing: 1,
          }}
        >
          Xem chi tiết
        </Button>
      </Card>
    </motion.div>
  );
};

export default ClassCard;