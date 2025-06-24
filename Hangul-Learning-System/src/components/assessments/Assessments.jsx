import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Select, Tag, Modal, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { getAssessmentsTableColumns } from './AssessmentsTableComponent';
import AssessmentBasicForm from './create/AssessmentBasicForm';
import CreateAssessmentStepper from './create/CreateAssessmentStepper';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { Search } = Input;
const { Option } = Select;

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Drafted', label: 'Nháp' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Rejected', label: 'Từ chối' },
  { value: 'Actived', label: 'Đã duyệt' },
  { value: 'Deleted', label: 'Đã xóa' },
];

const CATEGORY_LABELS = {
  Quiz: 'Kiểm tra 15 phút',
  Midterm: 'Thi giữa kì',
  Final: 'Thi cuối kì',
};
const ALLOWED_CATEGORIES = ['Quiz', 'Midterm', 'Final'];
const CATEGORY_ENUM_MAP = { 0: 'Quiz', 2: 'Midterm', 3: 'Final' };

// Dữ liệu mẫu (cùng format với AssessmentsTableComponent)
const sampleAssessments = [
  {
    TestID: 'T0001',
    TestName: 'Kiểm tra cuối kỳ',
    SubjectID: 'SJ0001',
    CreateBy: 'A00000',
    CreateAt: '2025-06-20T00:53:26.283Z',
    UpdateAt: null,
    Status: 'Drafted',
    TestType: 'Mix',
    Category: 'Final',
  },
  {
    TestID: 'T0002',
    TestName: 'Bài kiểm tra giữa kỳ',
    SubjectID: 'SJ0002',
    CreateBy: 'A00001',
    CreateAt: '2025-06-10T10:00:00.000Z',
    UpdateAt: '2025-06-15T12:00:00.000Z',
    Status: 'Actived',
    TestType: 'MCQ',
    Category: 'Midterm',
  },
  {
    TestID: 'T0003',
    TestName: 'Bài kiểm tra viết',
    SubjectID: 'SJ0003',
    CreateBy: 'A00002',
    CreateAt: '2025-05-01T08:30:00.000Z',
    UpdateAt: null,
    Status: 'Pending',
    TestType: 'Writing',
    Category: 'Other',
  },
];

const Assessments = () => {
  const [data, setData] = useState(sampleAssessments);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    basicInfo: {},
    sections: [],
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Fetch subjects từ API khi vào trang
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_URL}api/Subject/get-all?status=1`);
        setSubjects(res.data || []);
      } catch (e) {
        // fallback nếu lỗi
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Filter + search
  const filteredData = data.filter(item => {
    const matchStatus = statusFilter === 'all' || item.Status === statusFilter;
    const matchSearch =
      item.TestName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.TestID.toLowerCase().includes(searchText.toLowerCase()) ||
      item.SubjectID.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Handlers
  const handleView = (record) => {
    Modal.info({
      title: 'Xem chi tiết bài kiểm tra',
      content: <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(record, null, 2)}</pre>,
      width: 500,
    });
  };
  const handleEdit = (record) => {
    Modal.info({
      title: 'Chức năng sửa (demo)',
      content: 'Chức năng này sẽ được phát triển sau.',
    });
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa bài kiểm tra "${record.TestName}"?`,
      onOk: () => {
        setData(prev => prev.filter(item => item.TestID !== record.TestID));
        message.success('Đã xóa bài kiểm tra!');
      },
    });
  };

  // Handler for create submit
  const handleCreateSubmit = (values) => {
    setData(prev => [
      {
        ...values,
        TestID: 'T' + (Math.floor(Math.random() * 10000)).toString().padStart(4, '0'),
        Status: 'Drafted',
        TestType: 'Mix',
        CreateBy: 'A00000',
        Category: values.Category,
      },
      ...prev,
    ]);
    setShowCreate(false);
    setFormData({ basicInfo: {}, sections: [] });
    message.success('Đã tạo bài kiểm tra!');
  };

  // Handler khi hoàn thành stepper
  const handleStepperFinish = async () => {
    const basic = formData.basicInfo;
    const sections = formData.sections;
  
    try {
      // Gọi API tạo bài kiểm tra
      const res = await axios.post(`${API_URL}api/Test/create`, {
        accountID: "A00000", // có thể lấy từ auth context
        subjectID: basic.SubjectID,
        testType: basic.testType === 'MCQ' ? 7 : basic.testType === 'Writing' ? 5 : 6,
        category: basic.Category === 'Quiz' ? 0 : basic.Category === 'Midterm' ? 2 : 3,
      });
  
      const newTestID = res.data?.testId;
      if (!newTestID) throw new Error("Không lấy được TestID từ response");
  
      // Gọi tiếp API tạo section + câu hỏi ở đây
      // (chờ bạn gửi API tiếp theo)
  
      message.success('Tạo bài kiểm tra thành công!');
      setShowCreate(false);
      setFormData({ basicInfo: {}, sections: [] });
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tạo bài kiểm tra!');
    }
  };

  // Handler khi chọn môn học
  const handleSubjectChange = async (subjectID) => {
    if (!subjectID) {
      setCategoryOptions([]);
      setFormData(f => ({ ...f, basicInfo: { ...f.basicInfo, SubjectID: undefined, Category: undefined } }));
      return;
    }
    setFormData(f => ({ ...f, basicInfo: { ...f.basicInfo, SubjectID: subjectID, Category: undefined } }));
    try {
      const res = await fetch(`${API_URL}api/AssessmentCriteria/get-by-subject/${subjectID}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const cats = Array.from(
          new Set(
            data.data
              .map(item => CATEGORY_ENUM_MAP[parseInt(item.category)])
              .filter(cat => ALLOWED_CATEGORIES.includes(cat))
          )
        );
        setCategoryOptions(cats);
      } else {
        setCategoryOptions([]);
      }
    } catch (e) {
      setCategoryOptions([]);
    }
  };

  return (
    <div>
      {!showCreate ? (
        <>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <h1>Quản lí bài kiểm tra</h1>
            <Space>
              <Select
                value={statusFilter}
                onChange={value => setStatusFilter(value)}
                style={{ width: 160 }}
              >
                {statusOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                ))}
              </Select>
              <Search
                placeholder="Tìm kiếm bài kiểm tra"
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>
                Tạo bài kiểm tra
              </Button>
            </Space>
          </div>
          <Table
            columns={getAssessmentsTableColumns({ onView: handleView, onEdit: handleEdit, onDelete: handleDelete })}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            rowKey="TestID"
            scroll={{ x: 1000 }}
          />
        </>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, margin: '0 auto', maxWidth: 900, boxShadow: '0 2px 8px #f0f1f2' }}>
          <h2 style={{ marginBottom: 24 }}>Tạo bài kiểm tra mới</h2>
          <CreateAssessmentStepper
            formData={formData}
            setFormData={setFormData}
            onFinish={handleStepperFinish}
            showNotify={({ type, message: msg, description }) => message[type](msg)}
            subjects={subjects}
            categoryOptions={categoryOptions}
            onSubjectChange={handleSubjectChange}
          />
        </div>
      )}
    </div>
  );
};

export default Assessments;
