import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Card, Spin, Alert } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import StudentTeacherClassCard from '../../components/Class/StudentTeacherClassCard';
import EnrollSummary from './EnrollSummary';
import SortByLecturer from './SortByLecturer';
// import './StudentPage.css';

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

const recentTests = [
  { subject: 'Lập trình Web', score: '8.5/10' },
  { subject: 'Toán rời rạc', score: '7.0/10' },
];

const notifications = [
  'Hạn đăng ký học phần đến 20/06/2024',
  'Lịch thi cuối kỳ sẽ được công bố vào tuần sau',
];

const EnrollClass = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledClasses = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const studentId = user?.accountId;
        if (!studentId) throw new Error('Không tìm thấy thông tin sinh viên.');
        const url = API_URL + endpoints.enrollment.myClasses.replace('{studentId}', studentId);
        const res = await axios.get(url);
        console.log(res);
        setEnrolledClasses(res.data);
      } catch (err) {
        setError('Không thể tải danh sách lớp đã đăng ký.');
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledClasses();
  }, []);

  return (
    <Row gutter={[32, 0]} style={{ padding: 24 }}>
      <Col xs={24} md={16}>
        <Typography.Title level={3} style={{ marginBottom: 24 }}>
          <BookOutlined /> Lớp đã đăng ký
        </Typography.Title>
        {loading ? (
          <Spin>
            <div style={{ minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Đang tải lớp đã đăng ký...
            </div>
          </Spin>
        ) : error ? (
          <Alert type="error" message={error} />
        ) : enrolledClasses.length === 0 ? (
          <div>Chưa đăng ký lớp nào.</div>
        ) : (
          <Row gutter={[0, 12]} justify="start">
            {enrolledClasses.map((item) => (
              <Col xs={24} key={item.classID} style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: 800 }}>
                  <StudentTeacherClassCard
                    role="Student"
                    id={item.classID}
                    imageURL={item.imageURL}
                    className={item.className}
                    subjectName={item.subjectName}
                    lecturerName={item.lecturerName}
                    horizontal
                  />
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Col>
      <Col xs={24} md={8}>
        <SortByLecturer classes={enrolledClasses}>
          {(filteredClasses) => (
            <>
              <EnrollSummary total={filteredClasses.length} />
            </>
          )}
        </SortByLecturer>
      </Col>
    </Row>
  );
};

export default EnrollClass; 