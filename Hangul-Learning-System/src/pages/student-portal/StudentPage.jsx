import React from 'react';
import { Layout, Typography, Row, Col, Card, Avatar, Tag, List } from 'antd';
import HeaderBar from '../../components/header/Header';
import FooterBar from '../../components/footer/Footer';
import { UserOutlined, NotificationOutlined, BookOutlined, CalendarOutlined } from '@ant-design/icons';
// import './StudentPage.css';

const { Content } = Layout;
const { Title } = Typography;

const studentInfo = {
  name: 'Nguyễn Văn A',
  id: '20231234',
  email: 'nguyenvana@example.com',
  avatar: '',
};

const todaySchedule = [
  { time: '08:00 - 10:00', subject: 'Lập trình Web', room: 'Phòng 101' },
  { time: '13:00 - 15:00', subject: 'Toán rời rạc', room: 'Phòng 202' },
];

const classList = [
  { code: 'SE1703', name: 'Lập trình Web' },
  { code: 'SE1704', name: 'Toán rời rạc' },
  { code: 'SE1705', name: 'Cơ sở dữ liệu' },
];

const recentTests = [
  { subject: 'Lập trình Web', score: '8.5/10' },
  { subject: 'Toán rời rạc', score: '7.0/10' },
];

const notifications = [
  'Hạn đăng ký học phần đến 20/06/2024',
  'Lịch thi cuối kỳ sẽ được công bố vào tuần sau',
];

const StudentPage = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <HeaderBar />
      <Content style={{ margin: '24px', padding: '32px', borderRadius: '30px', minHeight: 400 }}>
        <Title level={2} style={{ fontWeight: 700, marginBottom: 32 }}>Trang tổng hợp sinh viên</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card bordered style={{ borderRadius: 16 }}>
              <Card.Meta
                avatar={<Avatar size={64} icon={<UserOutlined />} src={studentInfo.avatar} />}
                title={<span style={{ fontWeight: 600 }}>{studentInfo.name}</span>}
                description={
                  <>
                    <div>MSSV: {studentInfo.id}</div>
                    <div>Email: {studentInfo.email}</div>
                  </>
                }
              />
            </Card>
            <Card bordered style={{ borderRadius: 16, marginTop: 24 }}>
              <Title level={4} style={{ marginBottom: 16 }}><CalendarOutlined /> Lịch học hôm nay</Title>
              <List
                dataSource={todaySchedule}
                locale={{ emptyText: 'Không có lịch học hôm nay.' }}
                renderItem={item => (
                  <List.Item>
                    <Tag color="blue">{item.time}</Tag> {item.subject} <span style={{ color: '#888' }}>({item.room})</span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered style={{ borderRadius: 16 }}>
              <Title level={4} style={{ marginBottom: 16 }}><BookOutlined /> Lớp đang học</Title>
              <List
                dataSource={classList}
                locale={{ emptyText: 'Không có lớp nào.' }}
                renderItem={item => (
                  <List.Item>
                    <Tag color="purple">{item.code}</Tag> {item.name}
                  </List.Item>
                )}
              />
            </Card>
            <Card bordered style={{ borderRadius: 16, marginTop: 24 }}>
              <Title level={4} style={{ marginBottom: 16 }}>Kết quả kiểm tra gần nhất</Title>
              <List
                dataSource={recentTests}
                locale={{ emptyText: 'Chưa có kết quả.' }}
                renderItem={item => (
                  <List.Item>
                    <b>{item.subject}:</b> <Tag color="green">{item.score}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card bordered style={{ borderRadius: 16, minHeight: 200 }}>
              <Title level={4} style={{ marginBottom: 16 }}><NotificationOutlined /> Thông báo mới</Title>
              <List
                dataSource={notifications}
                locale={{ emptyText: 'Không có thông báo.' }}
                renderItem={item => (
                  <List.Item>
                    <span>{item}</span>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
      <FooterBar />
    </Layout>
  );
};

export default StudentPage; 