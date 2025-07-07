import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, TeamOutlined, BookOutlined, MessageOutlined } from '@ant-design/icons';
import SystemConfig from '../dashboard/pages/SystemConfig';
import ManagerRightSidebar from './ManagerRightSidebar';
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex' }}>
      

      {/* Main Content */}
      <div style={{ flex: 1 }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
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
              title="Total Lessons"
              value={156}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Messages"
              value={89}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>
      </div>

      {/* Right Sidebar */}
      <ManagerRightSidebar />
    </div>
     
    </div>
  );
};

export default Dashboard; 