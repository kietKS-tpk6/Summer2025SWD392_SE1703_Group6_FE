import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Select, Tag, Modal, message, Row, Col, InputNumber } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAssessmentsTableColumns } from './AssessmentsTableComponent';
import AssessmentBasicForm from './create/AssessmentBasicForm';
import CreateAssessmentStepper from './create/CreateAssessmentStepper';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import ViewDetailAssessment from './ViewDetailAssessment';

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
const TEST_TYPE_ENUM_MAP = {
  Vocabulary: 1,
  Grammar: 2,
  Listening: 3,
  Reading: 4,
  Writing: 5,
  Mix: 6,
  MCQ: 7,
  Other: 8,
};
const CATEGORY_ENUM_MAP = {
  0: 'Quiz',
  2: 'Midterm',
  3: 'Final',
};

const TEST_SECTION_TYPE_ENUM_MAP = {
  MCQ: 0,
  TrueFalse: 1,
  Writing: 2,
};

const CATEGORY_ENUM_REVERSE_MAP = {
  Quiz: 0,
  Midterm: 2,
  Final: 3,
};

const Assessments = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Drafted');
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    basicInfo: {},
    sections: [],
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const navigate = useNavigate();

  // Fetch subjects từ API khi vào trang
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_URL}api/Subject/get-all?status=1`);
        setSubjects(res.data || []);
      } catch (e) {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch tests từ API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        // Chỉ lấy bài test Drafted
        const res = await axios.get(`${API_URL}api/Test/all-with-sections?status=Drafted`);
        let allTests = [];
        if (res.data?.data) {
          allTests = res.data.data.map(test => ({ ...test, Status: 'Drafted' }));
        }
        setData(allTests);
      } catch (e) {
        setData([]);
      }
    };
    fetchTests();
  }, []);

  // Filter + search
  const filteredData = data.filter(item => {
    const matchStatus = statusFilter === 'all' || item.Status === statusFilter;
    const matchSearch =
      (item.testName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.subjectName || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (item.createdByName || '').toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Handlers
  const handleView = (record) => {
    navigate(`/dashboard/assessment/${record.testID}`);
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
      content: `Bạn có chắc chắn muốn xóa bài kiểm tra "${record.testName}"?`,
      onOk: () => {
        setData(prev => prev.filter(item => item.testID !== record.testID));
        message.success('Đã xóa bài kiểm tra!');
      },
    });
  };

  // Handler for create submit
  const handleCreateSubmit = (values) => {
    setData(prev => [
      {
        ...values,
        testID: 'T' + (Math.floor(Math.random() * 10000)).toString().padStart(4, '0'),
        Status: 'Drafted',
        testType: 'Mix',
        createdBy: 'A00000',
        category: values.category,
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
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const accountID = user.accountId;
      // 1. Tạo bài kiểm tra
      const payload = {
        accountID,
        subjectID: basic.subjectID,
        testType: TEST_TYPE_ENUM_MAP[basic.testType],
        category: CATEGORY_ENUM_REVERSE_MAP[basic.category],
        testName: basic.testName,
      };
      console.log('Payload gửi lên:', payload);
      console.log('accountID:', accountID);
      console.log('subjectID:', basic.subjectID);
      console.log('testType:', basic.testType, '->', TEST_TYPE_ENUM_MAP[basic.testType]);
      console.log('category:', basic.category, '->', CATEGORY_ENUM_REVERSE_MAP[basic.category]);
      console.log('testName:', basic.testName);
      const res = await axios.post(`${API_URL}api/Test/create`, payload);
  
      const newTestID = res.data?.testId;
      if (!newTestID) throw new Error("Không lấy được testID từ response");
  
      // 2. Tạo section cho từng section
      // Lưu lại mapping testSectionId <-> danh sách questionID trả về
      const sectionQuestionIdMap = [];
      for (const section of sections) {
        console.log('section.type:', section.type);
        // Tạo TestSection
        const testSectionType = TEST_SECTION_TYPE_ENUM_MAP[section.type];
        console.log('testSectionType:', testSectionType);
        const sectionRes = await axios.post(`${API_URL}api/TestSection`, {
          testID: newTestID,
          context: section.name,
          imageURL: null,
          audioURL: null,
          testSectionType,
          score: section.score,
          requestingAccountID: accountID,
        });
        const testSectionId = sectionRes.data?.testSectionId;
        if (!testSectionId) throw new Error("Không lấy được testSectionId từ response");

        // Tạo câu hỏi trắng cho section này
        console.log('Payload generate-empty:', {
          testSectionID: testSectionId,
          formatType: testSectionType,
          numberOfQuestions: section.questions.length,
        });
        const emptyQRes = await axios.post(`${API_URL}api/Questions/generate-empty`, {
          testSectionID: testSectionId,
          formatType: testSectionType,
          numberOfQuestions: section.questions.length,
        });
        // Lưu lại danh sách questionID trả về cho section này
        const questionIDs = (emptyQRes.data?.data || []).map(q => q.questionID);
        sectionQuestionIdMap.push({ testSectionId, questionIDs });
      }

      // 3. Cập nhật nội dung cho từng câu hỏi
      for (let sIdx = 0; sIdx < sections.length; ++sIdx) {
        const section = sections[sIdx];
        const questionIDs = sectionQuestionIdMap[sIdx].questionIDs;
        for (let qIdx = 0; qIdx < section.questions.length; ++qIdx) {
          const question = section.questions[qIdx];
          const questionID = questionIDs[qIdx];
          // Mapping đáp án
          const options = (question.answers || []).map((ans, aIdx) => ({
            context: ans.text,
            imageURL: ans.imageURL || "",
            audioURL: ans.audioURL || "",
            isCorrect: question.correct === aIdx,
          }));
          await axios.put(`${API_URL}api/Questions/questions/update`, {
            questionID,
            context: question.content,
            imageURL: question.imageURL || "",
            audioURL: question.audioURL || "",
            options,
          });
        }
      }
  
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
      setFormData(f => ({ ...f, basicInfo: { ...f.basicInfo, subjectID: undefined, category: undefined } }));
      return;
    }
    setFormData(f => ({ ...f, basicInfo: { ...f.basicInfo, subjectID: subjectID, category: undefined } }));
    try {
      const res = await fetch(`${API_URL}api/AssessmentCriteria/get-by-subject/${subjectID}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const ALLOWED_CATEGORY_NUMS = [0, 2, 3];
        const cats = Array.from(
          new Set(
            data.data
              .filter(item => ALLOWED_CATEGORY_NUMS.includes(item.category))
              .map(item => CATEGORY_ENUM_MAP[item.category])
          )
        );
        setCategoryOptions(cats);
        console.log('categoryOptions:', cats);
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
                <Option value="Drafted">Nháp</Option>
                <Option value="Pending">Chờ duyệt</Option>
                <Option value="Actived">Đã duyệt</Option>
                <Option value="all">Tất cả</Option>
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
            columns={[
              {
                title: 'Người tạo',
                dataIndex: 'createdByName',
                key: 'createdByName',
              },
              {
                title: 'Môn học',
                dataIndex: 'subjectName',
                key: 'subjectName',
              },
              {
                title: 'Ngày tạo',
                dataIndex: 'createAt',
                key: 'createAt',
                render: (text) => text ? new Date(text).toLocaleString() : '',
              },
              {
                title: 'Trạng thái',
                dataIndex: 'Status',
                key: 'Status',
                render: (status) => {
                  if (status === 'Drafted') return <Tag color="default">Nháp</Tag>;
                  if (status === 'Pending') return <Tag color="orange">Chờ duyệt</Tag>;
                  if (status === 'Actived') return <Tag color="green">Đã duyệt</Tag>;
                  return status;
                },
              },
              {
                title: 'Số trang',
                dataIndex: 'testSections',
                key: 'testSections',
                render: (sections) => Array.isArray(sections) ? sections.length : 0,
              },
              {
                title: 'Hành động',
                key: 'actions',
                render: (_, record) => (
                  <Space>
                    <Button onClick={() => handleView(record)}>Xem</Button>
                    <Button onClick={() => handleEdit(record)} type="primary">Sửa</Button>
                    <Button onClick={() => handleDelete(record)} danger icon={<DeleteOutlined />} />
                  </Space>
                ),
              },
            ]}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            rowKey="testID"
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
