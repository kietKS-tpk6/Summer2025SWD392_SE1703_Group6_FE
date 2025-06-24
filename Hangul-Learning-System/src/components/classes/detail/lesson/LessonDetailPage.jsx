import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Tag, Button, Typography, Image, Spin, Row, Col, Divider } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '../../../../config/api';
import { useLocation } from 'react-router-dom';
import { BookOutlined, LinkOutlined, VideoCameraOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const { Title, Paragraph, Link: AntLink } = Typography;

const LessonDetailPage = (props) => {
  const location = useLocation();
  const lessonId = props.lessonId || location.state?.lessonId;
  const [lesson, setLesson] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;
    let isMounted = true;
    setLoading(true);
    axios.get(`${API_URL}api/Lesson/get-detail/${lessonId}`)
      .then(res => {
        if (isMounted) {
          setLesson(res.data.data);
          if (res.data.data && res.data.data.classID) {
            axios.get(`${API_URL}api/Class/get-by-id?id=${res.data.data.classID}`)
              .then(res2 => {
                if (isMounted) setClassInfo(res2.data);
              })
              .finally(() => setLoading(false));
          } else {
            setLoading(false);
          }
        }
      })
      .catch(() => setLoading(false));
    return () => { isMounted = false; };
  }, [lessonId]);

  if (!lessonId) return <div style={{ textAlign: 'center', marginTop: 60, color: 'red' }}>Không tìm thấy lessonId!</div>;
  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}><Spin size="large" /></div>;
  if (!lesson) return <div style={{ textAlign: 'center', marginTop: 60 }}>Không tìm thấy tiết học.</div>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, minHeight: '100vh', boxSizing: 'border-box', background: '#fafcff' }}>
      <Card
        style={{ borderRadius: 16, boxShadow: '0 2px 12px #eee' }}
        bodyStyle={{ padding: 32 }}
        title={
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                <BookOutlined style={{ color: '#1677ff' }} />
                {lesson.lessonTitle || 'Chi tiết tiết học'}
                <Tag color="blue" style={{ marginLeft: 8, fontSize: 16 }}>{lesson.className}</Tag>
              </Title>
            </Col>
            <Col>
              {lesson.linkMeetURL && (
                <Button
                  type="primary"
                  href={lesson.linkMeetURL}
                  target="_blank"
                  size="large"
                  icon={<VideoCameraOutlined />}
                  style={{ fontWeight: 600, boxShadow: '0 2px 8px #1677ff22' }}
                >
                  Vào lớp học
                </Button>
              )}
            </Col>
          </Row>
        }
      >
        <Row gutter={32}>
          <Col xs={24} md={8}>
            {classInfo && classInfo.imageURL && (
              <Image src={classInfo.imageURL} alt="Ảnh lớp" width="100%" style={{ borderRadius: 12, marginBottom: 16 }} />
            )}
            {classInfo && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5} style={{ marginBottom: 8 }}>Thông tin lớp</Title>
                <div><b>Tên lớp:</b> {classInfo.className}</div>
                <div><b>Sĩ số:</b> {lesson.numberStudentEnroll}</div>
              </div>
            )}
            {lesson.resources && (
              <div style={{ marginBottom: 16 }}>
                <Tag color="gold" icon={<LinkOutlined />} style={{ fontSize: 15, padding: '6px 12px', fontWeight: 500 }}>
                  <AntLink href={lesson.resources} target="_blank" style={{ color: '#b48800' }}>
                    Tài nguyên bài học
                  </AntLink>
                </Tag>
              </div>
            )}
          </Col>
          <Col xs={24} md={16}>
            <Descriptions column={1} size="middle" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Thời gian">
                {dayjs(lesson.dateTime).format('HH:mm')} - {dayjs(lesson.endTime).format('HH:mm')} | {dayjs(lesson.dateTime).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Giảng viên">{lesson.lecturerName}</Descriptions.Item>
              <Descriptions.Item label="Môn học">{lesson.subjectName}</Descriptions.Item>
              <Descriptions.Item label="Số học viên">{lesson.numberStudentEnroll}</Descriptions.Item>
              <Descriptions.Item label="Kiểm tra">
                {lesson.hasTest ? (
                  <Tag color="red" icon={<CheckCircleTwoTone twoToneColor="#faad14" />}>Có kiểm tra</Tag>
                ) : (
                  <Tag>Không</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Title level={5}>Nội dung bài học</Title>
            <Paragraph style={{ marginBottom: 16 }}>{lesson.content || <i>Chưa có nội dung</i>}</Paragraph>
            {lesson.hasTest && (
              <div style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  ghost
                  href={`/test/${lesson.classLessonID}`}
                  target="_blank"
                  size="large"
                  icon={<CheckCircleTwoTone twoToneColor="#faad14" />}
                  style={{ fontWeight: 600 }}
                >
                  Xem kiểm tra
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default LessonDetailPage; 