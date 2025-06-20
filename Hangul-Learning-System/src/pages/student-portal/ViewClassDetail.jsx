import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Rate, Spin, Row, Col, Typography, Divider, Tooltip, Avatar } from 'antd';
import axios from 'axios';
import { API_URL, endpoints } from '../../config/api';
import '../../styles/ViewClassDetail.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../../components/header/Header';
import FooterBar from '../../components/footer/Footer';
import { UserOutlined } from '@ant-design/icons';
import Syllabus from '../../components/dashboard/pages/Syllabus';
import { Collapse } from 'antd';
import SyllabusSchedule from '../../components/dashboard/pages/syllabus/SyllabusSchedule';

const { Title, Text, Paragraph } = Typography;

const ViewClassDetail = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [syllabus, setSyllabus] = useState(null);
  const [syllabusSchedules, setSyllabusSchedules] = useState([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Lấy studentId từ localStorage
  const student = JSON.parse(localStorage.getItem('user'));
  const studentId = student?.accountId;

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get(`${API_URL}api/Class/get-by-id?id=${id}`);
        setClassData(res.data);
        console.log("subjectID:", res.data.subjectID);
      } catch (err) {
        setClassData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClass();
  }, [id]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      if (classData && classData.subjectID) {
        const res = await axios.get(`${API_URL}${endpoints.syllabus.getSyllabusInfo(classData.subjectID)}`);
        setSyllabus(res.data);
        console.log('syllabusID:', res.data.syllabusID); 
        console.log('description:', res.data.description); 
      }
    };
    fetchSyllabus();
  }, [classData]);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (syllabus && syllabus.syllabusID) {
        const res = await axios.get(`${API_URL}api/SyllabusSchedule/schedules/${syllabus.syllabusID}`);
        setSyllabusSchedules(res.data);
        res.data.forEach(item => {
          console.log('Slot:', item.slot, 'LessonTitle:', item.lessonTitle, 'Week:', item.week);
        });
      }
    };
    fetchSchedules();
  }, [syllabus]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (studentId && id) {
        try {
          const res = await axios.get(`${API_URL}api/Enrollment/check-enrollment/${studentId}/${id}`);
          setIsEnrolled(res.data.isEnrolled);
        } catch (err) {
          setIsEnrolled(false);
        }
      }
    };
    checkEnrollment();
  }, [studentId, id]);

  if (loading || !classData) return <Spin size="large" style={{ margin: '80px auto', display: 'block' }} />;

  return (
    <>
      <HeaderBar />
      <div className="class-detail-bg">
        <div className="class-detail-main">
        <Title level={2} 
            className="class-detail-title">{classData.className}
        </Title>
          <Row gutter={[40, 24]} align="top">
            <Col xs={24} md={16}>
              <div className="class-detail-image-wrap">
                <img
                  src={classData.imageURL}
                  alt={classData.className}
                  className="class-detail-image"
                />
              </div>
              <div className="class-detail-description-block" style={{ marginTop: 32 }}>
                <Title level={4} className="class-detail-description-title">Mô tả khoá học</Title>
                <Paragraph className="class-detail-description-text">
                    {syllabus?.description || 'No description.'}
                </Paragraph>
              </div>
              {/* Lịch trình học */}
              <Collapse style={{ marginTop: 40 }}>
                <Collapse.Panel header="Lịch trình học" key="1">
                  <SyllabusSchedule schedules={syllabusSchedules} />
                </Collapse.Panel>
              </Collapse>
            </Col>
            {/* Thông tin bên phải */}
            <Col xs={24} md={8}>
              <Card className="class-detail-info-card" variant="borderless">
                {/* Giá và Purchase */}
                    <div className="class-detail-price-box">
                  <span className="class-detail-currency">VNĐ</span>
                  <span className="class-detail-price-number">
                    {classData.priceOfClass ? classData.priceOfClass.toLocaleString() : '--'}
                  </span>
                </div>
                {isEnrolled ? (
                  <Button
                    type="primary"
                    size="large"
                    className="class-detail-purchase-btn"
                    block
                    style={{ margin: '18px 0 8px 0', fontSize: 20, height: 48 }}
                    onClick={() => navigate('/student/schedule?simple=true')}
                  >
                    Xem thời khóa biểu
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    className="class-detail-purchase-btn"
                    block
                    style={{ margin: '18px 0 8px 0', fontSize: 20, height: 48 }}
                    onClick={() => navigate(`/payment/${id}`)}
                  >
                    Đăng ký ngay
                  </Button>
                )}
                <Button
                  size="large"
                  className="class-detail-preview-btn"
                  block
                  style={{ marginBottom: 18, fontWeight: 700 }}
                >
                  Xem thử
                </Button>

                {/* Rating */}
                <div className="class-detail-rating-block">
                  <Rate disabled defaultValue={4.7} allowHalf className="class-detail-rating" />
                  <div>
                    <span className="class-detail-rating-score">4.7/5</span>
                    <span className="class-detail-rating-reviews"> — 4 đánh giá</span>
                  </div>
                </div>

                {/* Thông tin meta */}
                <div className="class-detail-meta-table">
                  <div className="class-detail-meta-row">
                    <span className="class-detail-meta-label">Trình độ</span>
                    <span className="class-detail-meta-value">{classData.level || 'Beginner'}</span>
                  </div>
                  <div className="class-detail-meta-row">
                    <span className="class-detail-meta-label">Khai giảng</span>
                    <span className="class-detail-meta-value">{classData.teachingStartTime?.slice(0, 10) || '-'}</span>
                  </div>
                  <div className="class-detail-meta-row">
                    <span className="class-detail-meta-label">Sĩ số</span>
                    <span className="class-detail-meta-value">{classData.maxStudent}</span>
                  </div>
                </div>                

                <div className="class-detail-lecturer-row">
                  <Avatar size={36} icon={<UserOutlined />} style={{ background: '#ffe9b0', color: '#fbb040', marginRight: 10 }} />
                  <div>
                    <div>
                      <span className="class-detail-meta-label" style={{ marginRight: 6 }}>Giảng viên:</span>
                      <span className="class-detail-meta-value">{classData.lecturerName}</span>
                    </div>
 
                  </div>
                </div>
              </Card>
              <div className="class-detail-guarantee-box">
                  <div className="class-detail-guarantee-item">✔ Created by the Hangul Team</div>
                  <div className="class-detail-guarantee-item">✔ 6 Months Support</div>
                  <div className="class-detail-guarantee-item">✔ 100% Money Back Guarantee</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      
      <FooterBar />
    </>
  );
};

export default ViewClassDetail;
