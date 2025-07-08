import React from 'react';
import { Modal, Table, Tag } from 'antd';

export const mockStudentListForClass = [
  {
    studentId: "ST001",
    studentName: "Nguyễn Văn A",
    attendanceRate: 95,
    averageScore: 8.2,
    status: "Hoàn thành",
    absentSessions: 1,
  },
  {
    studentId: "ST002",
    studentName: "Trần Thị B",
    attendanceRate: 78,
    averageScore: 6.5,
    status: "Hoàn thành",
    absentSessions: 3,
  },
  {
    studentId: "ST003",
    studentName: "Lê Văn C",
    attendanceRate: 60,
    averageScore: 4.8,
    status: "Chưa hoàn thành",
    absentSessions: 7,
  },
  {
    studentId: "ST004",
    studentName: "Phạm Minh D",
    attendanceRate: 100,
    averageScore: 9.0,
    status: "Hoàn thành",
    absentSessions: 0,
  },
  {
    studentId: "ST005",
    studentName: "Đỗ Thị E",
    attendanceRate: 70,
    averageScore: 5.5,
    status: "Chưa hoàn thành",
    absentSessions: 5,
  },
];

const statusColor = {
  'Hoàn thành': 'green',
  'Chưa hoàn thành': 'red',
};

const columns = [
  {
    title: 'Tên học viên',
    dataIndex: 'studentName',
    key: 'studentName',
    width: 180,
  },
  {
    title: 'Tỉ lệ điểm danh',
    dataIndex: 'attendanceRate',
    key: 'attendanceRate',
    align: 'center',
    width: 120,
    render: (val) => <Tag color={val >= 90 ? 'green' : val >= 70 ? 'gold' : 'red'}>{val}%</Tag>,
  },
  {
    title: 'Điểm TB',
    dataIndex: 'averageScore',
    key: 'averageScore',
    align: 'center',
    width: 90,
    render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 120,
    render: (val) => <Tag color={statusColor[val] || 'default'}>{val}</Tag>,
  },
  {
    title: 'Số buổi vắng',
    dataIndex: 'absentSessions',
    key: 'absentSessions',
    align: 'center',
    width: 110,
  },
];

const StudentListModal = ({ open, onClose, data = mockStudentListForClass }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Danh sách học viên"
      footer={null}
      width={700}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="studentId"
        pagination={{ pageSize: 6 }}
        bordered
        size="middle"
      />
    </Modal>
  );
};

export default StudentListModal; 