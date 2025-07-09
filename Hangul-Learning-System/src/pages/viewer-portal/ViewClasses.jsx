import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Typography, Card, Empty, Pagination } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import ClassCard from '../../components/class/ClassCard';
import { BookOutlined } from '@ant-design/icons';

const { Title } = Typography;

// Định nghĩa enum ClassStatus
const ClassStatus = {
  Pending: 0,
  Open: 1,
  Ongoing: 2,
  Completed: 3,
  Deleted: 4,
  Cancelled: 5,
};

const ViewClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [total, setTotal] = useState(0);

  // Lấy role từ localStorage
  let role = null;
  try {
    role = localStorage.getItem('role');
    if (!role) {
      const user = JSON.parse(localStorage.getItem('user'));
      role = user?.role;
    }
  } catch {}

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}api/Class/get-all-paginated`, {
          params: {
            page,
            pageSize,
          },
        });
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        let filtered = items;
        if (role === 'Student') {
          filtered = items.filter(cls => cls.status === ClassStatus.Open);
        }
        setClasses(filtered);
        setTotal(res.data.total || filtered.length);
      } catch (e) {
        setClasses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [role, page, pageSize]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #f8fafc 0%, #fbb04011 100%)',
        padding: '0',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 16px 32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <BookOutlined style={{ fontSize: 38, color: '#fbb040', marginBottom: 8 }} />
          <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#222', letterSpacing: 1 }}>
            Danh sách lớp học
          </Title>
          <div style={{ color: '#888', fontSize: 17, marginTop: 4 }}>
            Khám phá các lớp học đang mở và đăng ký ngay hôm nay!
          </div>
        </div>
        <Card
          style={{
            borderRadius: 24,
            boxShadow: '0 4px 32px #fbb04022',
            background: '#fff',
            padding: 0,
            minHeight: 400,
            border: 'none',
          }}
          bodyStyle={{ padding: '32px 16px 16px 16px' }}
        >
          {loading ? (
            <Spin size="large" style={{ display: 'block', margin: '80px auto' }} />
          ) : classes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={<span style={{ color: '#888', fontSize: 18 }}>Không có lớp nào phù hợp</span>}
              />
            </div>
          ) : (
            <>
              <Row gutter={[32, 32]} justify="center">
                {classes.map(cls => (
                  <Col key={cls.classID} xs={24} sm={12} md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'center' }}>
                    <ClassCard
                      imageURL={cls.imageURL}
                      className={cls.className}
                      lecturerName={cls.lecturerName}
                      priceOfClass={cls.priceOfClass}
                      status={cls.status}
                      id={cls.classID}
                    />
                  </Col>
                ))}
              </Row>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={(p, ps) => {
                    setPage(p);
                    setPageSize(ps);
                  }}
                  showSizeChanger={false}
                />
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ViewClasses;
