import React, { useState } from 'react';
import { Table, Tag, Typography, Select, DatePicker, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const testData = [
  {
    key: '1',
    testId: 'T0001',
    testName: 'Kiểm tra giữa kỳ',
    className: 'Lớp 10A1',
    subject: 'Toán',
    date: '2024-06-10',
    time: '08:00',
    status: 'Đã hoàn thành',
  },
  {
    key: '2',
    testId: 'T0002',
    testName: 'Kiểm tra cuối kỳ',
    className: 'Lớp 10A2',
    subject: 'Văn',
    date: '2024-06-20',
    time: '13:30',
    status: 'Sắp diễn ra',
  },
  {
    key: '3',
    testId: 'T0003',
    testName: 'Kiểm tra Listening',
    className: 'Lớp 10A1',
    subject: 'Tiếng Anh',
    date: '2024-05-30',
    time: '09:00',
    status: 'Đã hoàn thành',
  },
  {
    key: '4',
    testId: 'T0004',
    testName: 'Bài kiểm tra 15 phút - Đại số',
    className: 'Lớp 10A1',
    subject: 'Toán',
    date: dayjs().format('YYYY-MM-DD'),
    time: '14:00',
    status: 'Đang diễn ra',
  },
  {
    key: '5',
    testId: 'T0005',
    testName: 'Kiểm tra từ vựng Unit 5',
    className: 'Lớp 10A2',
    subject: 'Tiếng Anh',
    date: '2024-01-20',
    time: '14:00',
    status: 'Đang diễn ra',
  },
  {
    key: '6',
    testId: 'T0006',
    testName: 'Bài kiểm tra Văn học - Truyện Kiều',
    className: 'Lớp 10A3',
    subject: 'Văn',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '08:00',
    status: 'Sắp diễn ra',
  },
  {
    key: '7',
    testId: 'T0007',
    testName: 'Kiểm tra Lịch sử - Cách mạng tháng 8',
    className: 'Lớp 10A1',
    subject: 'Lịch sử',
    date: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    status: 'Sắp diễn ra',
  },
  {
    key: '8',
    testId: 'T0008',
    testName: 'Bài kiểm tra tiếng Anh tổng hợp',
    className: 'Lớp 10A2',
    subject: 'Tiếng Anh',
    date: '2024-01-22',
    time: '09:00',
    status: 'Sắp diễn ra',
  },
];

const StudentTestSchedule = () => {
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState(undefined);
  const [dateFilter, setDateFilter] = useState(undefined);

  const handleViewTest = (testId) => {
    navigate(`/student/view-test/${testId}`);
  };

  const columns = [
    {
      title: 'Tên bài kiểm tra',
      dataIndex: 'testName',
      key: 'testName',
      render: (text, record) => (
        <Button 
          type="link" 
          onClick={() => handleViewTest(record.testId)}
          style={{ padding: 0, height: 'auto', fontWeight: 500 }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: 'Lớp học',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Ngày kiểm tra',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Giờ',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === 'Sắp diễn ra') color = 'blue';
        else if (status === 'Đang diễn ra') color = 'orange';
        else if (status === 'Đã hoàn thành') color = 'green';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          size="small" 
          icon={<EyeOutlined />}
          onClick={() => handleViewTest(record.testId)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const uniqueClasses = [...new Set(testData.map(item => item.className))];

  const filteredData = testData.filter(item => {
    const matchClass = classFilter ? item.className === classFilter : true;
    const matchDate = dateFilter ? dayjs(item.date).isSame(dateFilter, 'day') : true;
    return matchClass && matchDate;
  });

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 32, margin: 24 }}>
      <Title level={2} style={{ fontWeight: 700, marginBottom: 24 }}>Lịch kiểm tra</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col>
          <Select
            allowClear
            placeholder="Chọn lớp học"
            style={{ minWidth: 160 }}
            value={classFilter}
            onChange={setClassFilter}
          >
            {uniqueClasses.map(className => (
              <Option key={className} value={className}>{className}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <DatePicker
            allowClear
            placeholder="Chọn ngày kiểm tra"
            value={dateFilter}
            onChange={setDateFilter}
            format="YYYY-MM-DD"
          />
        </Col>
      </Row>
      <Table columns={columns} dataSource={filteredData} pagination={false} />
    </div>
  );
};

export default StudentTestSchedule; 