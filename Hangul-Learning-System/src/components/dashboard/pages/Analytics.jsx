import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, RiseOutlined } from '@ant-design/icons';

const Analytics = () => {
  return (
    <div>
      <h1>Analytics & Evaluation</h1>
      
      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={1128}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Classes"
              value={24}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completed Lessons"
              value={156}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Progress"
              value={78}
              suffix="%"
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Analytics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Student Progress">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Chart will be displayed here
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Class Performance">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Chart will be displayed here
            </div>
          </Card>
        </Col>
      </Row>

      {/* Additional Analytics */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Learning Path Completion">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Chart will be displayed here
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Student Engagement">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Chart will be displayed here
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics; 