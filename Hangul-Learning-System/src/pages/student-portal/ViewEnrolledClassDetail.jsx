import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Row, Col, Avatar, Button } from 'antd';
import { BookOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import Syllabus from './Syllabus';
import TestSchedule from './TestSchedule';
import ViewLessonsOfClass from '../../components/lessons/ViewLessonsOfClass';
import StudentListSection from '../../components/classes/detail/StudentListSection';

const ViewEnrolledClassDetail = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy role từ localStorage
    let userRole = null;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        userRole = user && user.role;
    } catch (e) {
        userRole = null;
    }

    useEffect(() => {
        const fetchClass = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_URL}api/Class/get-by-id?id=${classId}`);
                setClassData(res.data);
            } catch (err) {
                setError('Không thể tải thông tin lớp học.');
            } finally {
                setLoading(false);
            }
        };
        fetchClass();
    }, [classId]);

    if (loading) return <Spin style={{ display: 'block', margin: '80px auto' }} />;
    if (error) return <Alert type="error" message={error} style={{ margin: 40 }} />;
    if (!classData) return null;

    return (
        <div style={{ margin: '0 auto', padding: 32 }}>
            <Button onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
                ← Quay lại
            </Button>
            <Row gutter={32}>
                {/* Bên trái: Thông tin class (1) phía trên, Lịch kiểm tra (2) phía dưới */}
                <Col xs={24} md={16}>
                    <Card bordered style={{ borderRadius: 18, marginBottom: 32 }}>
                        <Row gutter={32}>
                            <Col xs={24} md={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <img
                                        src={classData.imageURL}
                                        alt={classData.className}
                                        style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 12, marginBottom: 16 }}
                                    />
                                </div>
                            </Col>
                            <Col xs={24} md={16}>
                                <Typography.Title level={3} style={{ marginBottom: 20 }}>{classData.className}</Typography.Title>
                                <div style={{ marginBottom: 20 }}>
                                    <BookOutlined /> <b>Môn học:</b> {classData.subjectName}
                                </div>
                                <div style={{ marginBottom: 12 }}>
                                    <Avatar size={32} icon={<UserOutlined />} style={{ background: '#ffe9b0', color: '#fbb040', marginRight: 8 }} />
                                    <b>Giáo viên:</b> {classData.lecturerName}
                                </div>
                                <div style={{ marginBottom: 8 }}>
                                    <b>Ngày bắt đầu:</b> {classData.teachingStartTime ? new Date(classData.teachingStartTime).toLocaleDateString('vi-VN') : '--'}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ marginTop: 32 }}>
                        {userRole === 'Lecture' ? (
                            <StudentListSection classId={classId} />
                        ) : (
                            <Syllabus classId={classId} />
                        )}
                    </div>
                    <div style={{ marginTop: 32 }}>
                    {userRole === 'Lecture' ? (
                        <TestSchedule classId={classId} />
                    ) : (
                        <null/>
                    )}
                    </div>
                </Col>
                {/* Bên phải: Nếu là giảng viên thì hiển thị danh sách bài học, nếu không thì hiển thị lịch kiểm tra */}
                <Col xs={24} md={8}>
                    {userRole === 'Lecture' ? (
                        <ViewLessonsOfClass classId={classId} />
                    ) : (
                        <TestSchedule classId={classId} />
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default ViewEnrolledClassDetail; 