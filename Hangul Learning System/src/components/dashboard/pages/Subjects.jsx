import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Select, Descriptions, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL, endpoints } from '../../../config/api';

const { Option } = Select;
const { confirm } = Modal;

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showActive, setShowActive] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [showActive]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.manageSubject.getAll}`, {
        params: {
          isActive: showActive
        }
      });
      console.log('API Response:', response.data); // Debug log

      // Check if response.data is an array
      const subjectsData = Array.isArray(response.data) ? response.data : [];

      const formattedSubjects = subjectsData.map(subject => ({
        id: subject.subjectID,
        name: subject.subjectName,
        code: subject.subjectID,
        description: subject.description,
        isActive: subject.isActive,
        status: subject.isActive ? 'Đang mở' : 'Đã đóng',
        minAverageScoreToPass: subject.minAverageScoreToPass,
        createAt: new Date(subject.createAt).toLocaleString('vi-VN', {
          hour12: false,
          timeZone: 'Asia/Ho_Chi_Minh',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }));
      setSubjects(formattedSubjects);
    } catch (error) {
      message.error('Không thể tải danh sách môn học');
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value) {
      await fetchSubjects();
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}${endpoints.manageSubject.getById}${value}`);

      if (response.data) {
        const subjectData = response.data;
        setSubjects([{
          id: subjectData.subjectID,
          name: subjectData.subjectName,
          code: subjectData.subjectID,
          description: subjectData.description,
          status: subjectData.isActive ? 'Đang mở' : 'Đã đóng',
          minAverageScoreToPass: subjectData.minAverageScoreToPass,
          createAt: new Date(subjectData.createAt).toLocaleDateString('vi-VN')
        }]);
      }
    } catch (error) {
      console.error('Error searching subject:', error);
      message.error('Không tìm thấy môn học');
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);

  const columns = [
    {
      title: 'Mã môn học',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Điểm đạt',
      dataIndex: 'minAverageScoreToPass',
      key: 'minAverageScoreToPass',
      width: '5%',
      render: (score) => score.toFixed(1),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createAt',
      key: 'createAt',
      width: '8%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={!record.isActive}  // disable nút Sửa nếu không active
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={!record.isActive}  // disable nút Xóa nếu không active
          >
            Xóa
          </Button>
        </Space>
      ),
    },    
  ];

  const handleAdd = () => {
    setEditingSubject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSubject(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    console.log('Delete button clicked for ID:', id);
    setSubjectToDelete(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    try {
      setLoading(true);
      console.log('Deleting subject with ID:', subjectToDelete);
      const deleteUrl = `${API_URL}${endpoints.manageSubject.delete}${subjectToDelete}`;
      console.log('Delete URL:', deleteUrl);

      const response = await axios.delete(deleteUrl);
      console.log('Delete response:', response);

      message.success('Xóa môn học thành công');
      await fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      console.error('Error response:', error.response);
      message.error('Không thể xóa môn học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
      setSubjectToDelete(null);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingSubject) {
        // Update existing subject
        const response = await axios.put(`${API_URL}${endpoints.manageSubject.update}`, {
          subjectID: editingSubject.id,
          subjectName: values.name,
          description: values.description,
          isActive: true,
          minAverageScoreToPass: values.minAverageScoreToPass || 0
        });

        if (response.data) {
          // Refresh the subjects list after successful update
          await fetchSubjects();
          message.success('Cập nhật môn học thành công');
        }
      } else {
        // Create new subject
        const response = await axios.post(`${API_URL}${endpoints.manageSubject.create}`, {
          subjectName: values.name,
          description: values.description,
          minAverageScoreToPass: values.minAverageScoreToPass || 0
        });

        if (response.data) {
          // Refresh the subjects list after successful creation
          await fetchSubjects();
          message.success('Thêm môn học thành công');
        }
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error saving subject:', error);
      message.error('Không thể lưu môn học. Vui lòng thử lại.');
    }
  };

  const handleView = (record) => {
    navigate('/dashboard/syllabus', { state: { subject: record } });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Trạng thái:</span>
          <Switch
            checkedChildren="Đang mở"
            unCheckedChildren="Đã đóng"
            checked={showActive}
            onChange={setShowActive}
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Input.Search
            placeholder="Nhập mã môn học để tìm kiếm"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: '300px' }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm môn học mới
          </Button>
        </div>

      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
      />

      <Modal
        title={editingSubject ? 'Sửa môn học' : 'Thêm môn học mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="minAverageScoreToPass"
            label="Điểm đạt"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm đạt' },
              {
                validator: (_, value) =>
                  value >= 5
                    ? Promise.resolve()
                    : Promise.reject(new Error('Điểm đạt phải từ 5 trở lên')),
              },
            ]}
          >
            <Input type="number" min={5} max={10} step={0.1} />
          </Form.Item>

        </Form>
      </Modal>

      <Modal
        title="Chi tiết môn học"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingSubject && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã môn học">{viewingSubject.code}</Descriptions.Item>
              <Descriptions.Item label="Tên môn học">{viewingSubject.name}</Descriptions.Item>
              <Descriptions.Item label="Cấp độ">{viewingSubject.level}</Descriptions.Item>
              <Descriptions.Item label="Mô tả">{viewingSubject.description}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{viewingSubject.status}</Descriptions.Item>
            </Descriptions>
            <div style={{ marginTop: '20px' }}>
              <h3>Syllabus</h3>
              <div style={{
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                whiteSpace: 'pre-wrap'
              }}>
                {viewingSubject.syllabus}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSubjectToDelete(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa môn học này?</p>
      </Modal>
    </div>
  );
};

export default Subjects; 