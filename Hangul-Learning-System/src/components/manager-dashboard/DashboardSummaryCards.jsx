import React, { useEffect, useState } from "react";
import { Card, Row, Col, Skeleton } from "antd";
import axios from "axios";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined
} from "@ant-design/icons";
import { API_URL, endpoints } from "../../config/api";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  minimumFractionDigits: 0,
});

const DashboardSummaryCards = () => {
  const [data, setData] = useState({
    totalLecturers: 0,
    totalSubjects: 0,
    activeClasses: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL + endpoints.dashboardManager.overview);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const cards = [
    {
      title: "Tổng giảng viên",
      value: loading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : data.totalLecturers,
      icon: <UserOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Tổng môn học",
      value: loading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : data.totalSubjects,
      icon: <BookOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Lớp đang hoạt động",
      value: loading ? <Skeleton.Input active size="small" style={{ width: 60 }} /> : data.activeClasses,
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: "Tổng doanh thu",
      value: loading ? <Skeleton.Input active size="small" style={{ width: 80 }} /> : formatter.format(data.totalRevenue),
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
