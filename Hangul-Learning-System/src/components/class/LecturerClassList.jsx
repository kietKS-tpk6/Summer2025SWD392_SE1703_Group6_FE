import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Table, Avatar, Button, Tag } from 'antd';
import { getUser } from '../../utils/auth';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const statusColor = (status) => {
  switch (status) {
    case 0: return 'default'; // Pending
    case 1: return 'blue';    // Open
    case 2: return 'green';   // Ongoing
    case 3: return 'gold';    // Completed
    case 4: return 'red';     // Deleted
    case 5: return 'volcano'; // Cancelled
    default: return 'default';
  }
};
const statusText = (status) => {
  switch (status) {
    case 0: return 'Chờ xử lý';
    case 1: return 'Mở tuyển sinh';
    case 2: return 'Đang dạy';
    case 3: return 'Hoàn thành';
    case 4: return 'Đã xóa';
    case 5: return 'Đã hủy';
    default: return 'Không xác định';
  }
};

const LecturerClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const user = getUser();
  const lecturerID = user?.accountId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}api/Class/get-all-paginated`, {
          params: {
            page,
            pageSize: PAGE_SIZE,
          },
        });
        const items = Array.isArray(res.data) ? res.data : res.data.items || [];
        // Lọc theo lecturerID và status=2 (Ongoing)
        const filtered = items.filter(
          (item) => item.status === 2 && item.lecturerID === lecturerID
        );
        setClasses(filtered);
        setTotal(res.data.totalItems || filtered.length);
      } catch (err) {
        setError('Không thể tải danh sách lớp đang dạy.');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [page, lecturerID]);

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageURL',
      key: 'imageURL',
      render: (url) => <Avatar shape="square" size={64} src={url} />,
      width: 90,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'className',
      key: 'className',
      render: (text) => <b>{text}</b>,
    },
    {
      title: 'Môn học',
      dataIndex: 'subjectName',
      key: 'subjectName',
    },
    {
      title: 'Số học viên',
      dataIndex: 'numberStudentEnroll',
      key: 'numberStudentEnroll',
      align: 'center',
    },
    // {
    //   title: 'Giá',
    //   dataIndex: 'priceOfClass',
    //   key: 'priceOfClass',
    //   render: (price) => price ? price.toLocaleString() + ' VNĐ' : '--',
    //   align: 'right',
    // },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'teachingStartTime',
      key: 'teachingStartTime',
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '--',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColor(status)}>{statusText(status)}</Tag>,
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(`/lecturer/class/${record.classID}`)}
        >
          Xem chi tiết
        </Button>
      ),
      align: 'center',
      width: 140,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Danh sách lớp đang dạy</h2>
      <Table
        columns={columns}
        dataSource={classes}
        loading={loading}
        rowKey="classID"
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: total,
          onChange: setPage,
          showSizeChanger: false,
        }}
        locale={{ emptyText: error || 'Không có lớp nào đang dạy.' }}
        bordered
      />
    </div>
  );
};

export default LecturerClassList; 