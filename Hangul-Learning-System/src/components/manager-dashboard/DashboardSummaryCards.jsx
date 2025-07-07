import React from "react";
import { Card, Row, Col } from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined
} from "@ant-design/icons";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
});
const mockData = {
    totalLecturers: 35,
    totalSubjects: 18,
    activeClasses: 24,
    totalRevenue: 127500000,
  };

const DashboardSummaryCards = ({ data = mockData}) => {
  const cards = [
    {
      title: "Tổng giảng viên",
      value: data.totalLecturers,
      icon: <UserOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Tổng môn học",
      value: data.totalSubjects,
      icon: <BookOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Lớp đang hoạt động",
      value: data.activeClasses,
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Tổng doanh thu",
      value: formatter.format(data.totalRevenue),
      icon: <DollarOutlined style={{ fontSize: 24 }} />,
    },
  ];

  return (
    <Row gutter={[24, 24]} justify="center" align="middle">
      {cards.map((card, index) => (
        <Col xs={24} sm={12} md={6} key={index}>
          <Card
            bordered
            hoverable
            style={{
              borderRadius: 16,
              minHeight: 120,
              height: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 8px',
            }}
            bodyStyle={{ padding: 0, width: '100%' }}
          >
            <div style={{ width: '100%' }}>
              {React.cloneElement(card.icon, { style: { fontSize: 24, color: '#1890ff' } })}
              <div style={{ color: "#888", fontSize: 14, marginTop: 8 }}>{card.title}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#222', marginTop: 2 }}>
                {card.value}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default DashboardSummaryCards;
