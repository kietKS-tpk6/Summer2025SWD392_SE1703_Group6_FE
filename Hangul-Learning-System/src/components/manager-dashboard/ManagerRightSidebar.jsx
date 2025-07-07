import React, { useEffect, useState } from "react";
import { Card, List, Typography, Divider, Spin } from "antd";
import {
  CalendarOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API_URL, endpoints } from '../../config/api';

const { Text, Title } = Typography;

const ManagerRightSidebar = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}${endpoints.dashboardManager.rightSidebar}`);
        console.log(response.data);
        if (response.data && (response.data.success === undefined || response.data.success)) {
          setData(response.data.data || response.data); // tuỳ backend trả về
        } else {
          // message.error(response.data.message || 'Không thể tải dữ liệu sidebar');
          console.error(response.data.message || 'Không thể tải dữ liệu sidebar');
        }
      } catch (error) {
        // message.error('Lỗi khi tải dữ liệu sidebar');
        console.error('Lỗi khi tải dữ liệu sidebar', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <Spin size="large" />
      </div>
    );
  }
  if (!data) return null;

  return (
    <div style={{ width: 320, padding: "16px", background: "#fafafa", height: "100vh", overflowY: "auto" }}>
      <Title level={4}>Tổng quan hôm nay</Title>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Text><CalendarOutlined /> Số lớp học hôm nay:</Text>
        <Title level={3}>{data.todayClasses}</Title>
      </Card>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Text><FileTextOutlined /> Bài kiểm tra hôm nay:</Text>
        <Title level={3}>{data.todayTests}</Title>
      </Card>

      <Divider orientation="left">⏱ Lớp đủ điều kiện chốt danh sách</Divider>
      <List
        size="small"
        dataSource={data.eligibleClassForOpening}
        locale={{emptyText: 'Không có lớp nào đủ điều kiện'}}
        renderItem={(item) => (
          <List.Item key={item.ClassID}>
            <Text>
              <ExclamationCircleOutlined style={{ color: "#faad14" }} /> {item.ClassName} - {item.StudentCount} HV (bắt đầu: {item.TeachingStartTime ? new Date(item.TeachingStartTime).toLocaleDateString() : ''})
            </Text>
          </List.Item>
        )}
      />

      <Divider orientation="left">📆 Lớp gần tới hạn mở nhưng chưa đủ sĩ số</Divider>
      <List
        size="small"
        dataSource={data.classNearOpenButNotReady}
        locale={{emptyText: 'Không có lớp nào gần tới hạn'}}
        renderItem={(item) => (
          <List.Item key={item.ClassID}>
            <Text>
              <ClockCircleOutlined style={{ color: "#1890ff" }} /> {item.ClassName} ({item.StudentCount}/{item.MinStudentAcpt} HV, bắt đầu: {item.TeachingStartTime ? new Date(item.TeachingStartTime).toLocaleDateString() : ''})
            </Text>
          </List.Item>
        )}
      />

      <Divider orientation="left">📝 Gán đề kiểm tra cho các buổi kiểm tra sau</Divider>
      <List
        size="small"
        dataSource={data.testEventsNeedingTestID}
        locale={{emptyText: 'Không có buổi kiểm tra nào cần gán đề'}}
        renderItem={(item) => (
          <List.Item key={item.testEventID}>
            <Text>
              <FileSearchOutlined style={{ color: "#cf1322" }} /> {item.subjectName} (bắt đầu: {item.timeLessonStart ? new Date(item.timeLessonStart).toLocaleString() : ''})
            </Text>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ManagerRightSidebar;
