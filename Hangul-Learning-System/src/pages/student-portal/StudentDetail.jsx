import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../../components/dashboard/Sidebar';
import HeaderBar from '../../components/header/Header';
import FooterBar from '../../components/footer/Footer';

const { Content } = Layout;

const StudentDetail = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* <Sidebar /> */}
      <Layout>
        <Content style={{ margin: '24px', padding: '32px', background: '#fff', borderRadius: '30px', minHeight: 400 }}>
          <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Thông tin cá nhân học sinh</h2>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentDetail;
