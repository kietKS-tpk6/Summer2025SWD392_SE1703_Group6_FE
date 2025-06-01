import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Select, Descriptions } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Subjects = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Tiếng Hàn Sơ Cấp 1',
      code: 'THSC1',
      level: 'Sơ cấp',
      description: 'Khóa học tiếng Hàn cơ bản cho người mới bắt đầu',
      status: 'Đang mở',
      syllabus: 'Nội dung chi tiết của khóa học Tiếng Hàn Sơ Cấp 1...',
    },
    {
      id: 2,
      name: 'Tiếng Hàn Sơ Cấp 2',
      code: 'THSC2',
      level: 'Sơ cấp',
      description: 'Tiếp tục khóa học tiếng Hàn cơ bản',
      status: 'Đang mở',
      syllabus: 'Nội dung chi tiết của khóa học Tiếng Hàn Sơ Cấp 2...',
    },
  ]);

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
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
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
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
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
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa môn học này?',
      onOk: () => {
        setSubjects(subjects.filter((item) => item.id !== id));
        message.success('Xóa môn học thành công');
      },
    });
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingSubject) {
        setSubjects(
          subjects.map((item) =>
            item.id === editingSubject.id ? { ...item, ...values } : item
          )
        );
        message.success('Cập nhật môn học thành công');
      } else {
        const newSubject = {
          id: subjects.length + 1,
          ...values,
          status: 'Đang mở',
        };
        setSubjects([...subjects, newSubject]);
        message.success('Thêm môn học thành công');
      }
      setIsModalVisible(false);
    });
  };

  const handleView = (record) => {
    navigate('/dashboard/syllabus', { state: { subject: record } });
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm môn học mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="id"
        pagination={{ pageSize: 10 }}
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
            name="code"
            label="Mã môn học"
            rules={[{ required: true, message: 'Vui lòng nhập mã môn học' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn học' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="Cấp độ"
            rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}
          >
            <Select>
              <Option value="Sơ cấp">Sơ cấp</Option>
              <Option value="Trung cấp">Trung cấp</Option>
              <Option value="Cao cấp">Cao cấp</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="syllabus"
            label="Syllabus"
            rules={[{ required: true, message: 'Vui lòng nhập syllabus' }]}
          >
            <Input.TextArea rows={6} />
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
    </div>
  );
};

export default Subjects; 