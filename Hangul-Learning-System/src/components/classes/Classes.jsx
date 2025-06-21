import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag, Select, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { getClassesTableColumns } from './ClassesTableComponent';
import CreateClassModal from './create/CreateClassModal';
import DeleteConfirm from '../common/DeleteConfirm';
import Notification from '../common/Notification';

const { Search } = Input;
const { Option } = Select;

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 0, label: 'Chưa công khai' },
  { value: 1, label: 'Đang tuyển sinh' },
  { value: 2, label: 'Đang dạy' },
  { value: 3, label: 'Hoàn thành' },
  { value: 4, label: 'Không hoạt động' },
];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null });
  const [notify, setNotify] = useState({
    visible: false,
    type: 'success',
    message: '',
    description: ''
  });

  const showNotify = (notifyProps, duration = 3) => {
    const notifKey = Math.random().toString(36).substr(2, 9);
    setNotify(n => ({ ...n, visible: false }));
    setTimeout(() => {
      setNotify({ ...notifyProps, visible: true, duration, notifKey });
    }, 0);
  };

  const fetchData = async (status = statusFilter, page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      let url = '';
      if (status === 'all') {
        url = `${API_URL}api/Class/get-all-paginated?page=${page}&pageSize=${pageSize}`;
      } else {
        url = `${API_URL}api/Class/get-by-status?status=${status}&page=${page}&pageSize=${pageSize}`;
      }
      const res = await axios.get(url);
      setData(res.data.items);
      setPagination({
        current: page,
        pageSize,
        total: res.data.totalItems || 0,
      });
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData(statusFilter, pagination.current, pagination.pageSize);
  }, [statusFilter, pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    fetchData(statusFilter, pagination.current, pagination.pageSize);
  };

  
  const handleView = (record) => { /* ... */ };
  const handleEdit = (record) => { /* ... */ };
  const handleDelete = (record) => {
    setDeleteModal({ open: true, record });
  };
  const handleDeleteConfirm = async () => {
    const record = deleteModal.record;
    try {
      await axios.delete(`${API_URL}api/Class/delete/${record.classID}`);
      showNotify({
        type: 'success',
        message: 'Xoá lớp học thành công!',
        description: ''
      });
      fetchData();
    } catch (error) {
      showNotify({
        type: 'error',
        message: 'Xoá lớp học thất bại!',
        description: error?.message || ''
      });
    } finally {
      setDeleteModal({ open: false, record: null });
    }
  };
  const handleOpenRecruit = async (record) => {
    await axios.post(`${API_URL}api/Class/update`, { ...record, status: 1 });
    fetchData();
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Quản lí lớp học</h1>
        <Space>
          <Select
            value={statusFilter}
            onChange={value => {
              setStatusFilter(value);
              setPagination(prev => ({ ...prev, current: 1 }));
            }}
            style={{ width: 180 }}
          >
            {statusOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>{opt.label}</Option>
            ))}
          </Select>
          <Search
            placeholder="Tìm kiếm lớp học"
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
          <Button type="primary" onClick={() => setOpenCreateModal(true)}>
            Tạo lớp mới
          </Button>
        </Space>
      </div>
      <Table
        columns={getClassesTableColumns(statusFilter, {
          onView: handleView,
          onEdit: handleEdit,
          onDelete: handleDelete,
          onOpenRecruit: handleOpenRecruit,
        })}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
        }}
        rowKey="classID"
        scroll={{ x: 1200 }}
      />
      <CreateClassModal
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={() => {
          fetchData();
        }}
        showNotify={showNotify}
      />
      <DeleteConfirm
        open={deleteModal.open}
        title="Xác nhận xoá"
        content={deleteModal.record ? `Bạn có chắc chắn muốn xoá lớp "${deleteModal.record.className}"?` : ''}
        onOk={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ open: false, record: null })}
      />
      <Notification
        visible={notify.visible}
        type={notify.type}
        message={notify.message}
        description={notify.description}
        onClose={() => setNotify(n => ({ ...n, visible: false }))}
        duration={notify.duration}
        notifKey={notify.notifKey}
      />
    </div>
  );
};

export default Classes; 