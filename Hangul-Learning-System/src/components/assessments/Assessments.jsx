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
import * as XLSX from 'xlsx';

const { Search } = Input;
const { Option } = Select;

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Drafted', label: 'Nháp' },
  { value: 'Pending', label: 'Chờ duyệt' },
  { value: 'Rejected', label: 'Từ chối' },
  { value: 'Actived', label: 'Đang hoạt động' },
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
  const [openModal, setOpenModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Thêm state cho popup gửi duyệt
  const [sendApproveModal, setSendApproveModal] = useState(false);
  const [sendApproveLoading, setSendApproveLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('user from localStorage:', user);
    setUserRole(user.role);
  }, []);

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
        // Lấy cả bài test Drafted, Pending, Actived
        const statuses = ['Drafted', 'Pending', 'Actived'];
        let allTests = [];
        for (const status of statuses) {
          const res = await axios.get(`${API_URL}api/Test/all-with-sections?status=${status}`);
          if (res.data?.data) {
            allTests = allTests.concat(res.data.data.map(test => ({ ...test, Status: status })));
          }
        }
        // Sắp xếp theo updateAt giảm dần (mới nhất lên đầu)
        allTests.sort((a, b) => {
          const dateA = a.updateAt ? new Date(a.updateAt).getTime() : 0;
          const dateB = b.updateAt ? new Date(b.updateAt).getTime() : 0;
          return dateB - dateA;
        });
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
  const handleStepperFinish = () => {
    console.log('Bấm hoàn thành!');
    if (userRole === 'Lecture') {
      console.log('Set lecturerModal true');
      setLecturerModal(true);
    } else if (userRole === 'Manager') {
      setOpenModal(true);
    }
  };

  // Hàm tạo test với status
  const createTestWithStatus = async (statusType) => {
    setModalLoading(true);
    const basicInfo = formData.basicInfo;
    const sections = formData.sections;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const accountID = user.accountId;
      // 1. Tạo bài kiểm tra
      const payload = {
        accountID,
        subjectID: basicInfo.SubjectID,
        testType: TEST_TYPE_ENUM_MAP[basicInfo.testType],
        category: CATEGORY_ENUM_REVERSE_MAP[basicInfo.Category],
        testName: basicInfo.TestName,
      };
      const res = await axios.post(`${API_URL}api/Test/create`, payload);
      const newTestID = res.data?.testId;
      if (!newTestID) throw new Error("Không lấy được testID từ response");
      // 2. Tạo section cho từng section
      const sectionQuestionIdMap = [];
      const generatedQuestionsBySection = [];
      for (const section of sections) {
        const testSectionType = TEST_SECTION_TYPE_ENUM_MAP[section.type];
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
        const emptyQRes = await axios.post(`${API_URL}api/Questions/generate-empty`, {
          testSectionID: testSectionId,
          formatType: testSectionType,
          numberOfQuestions: section.questions.length,
        });
        const generatedQuestions = (emptyQRes.data?.data || []);
        const questionIDs = generatedQuestions.map(q => q.questionID);
        sectionQuestionIdMap.push({ testSectionId, questionIDs });
        generatedQuestionsBySection.push(generatedQuestions);
      }
      // 3. Cập nhật nội dung cho từng câu hỏi
      for (let sIdx = 0; sIdx < sections.length; ++sIdx) {
        const section = sections[sIdx];
        const questionIDs = sectionQuestionIdMap[sIdx].questionIDs;
        const generatedQuestions = generatedQuestionsBySection[sIdx];
        for (let qIdx = 0; qIdx < section.questions.length; ++qIdx) {
          const question = section.questions[qIdx];
          const questionID = questionIDs[qIdx];
          let answersWithMcqID = (question.answers || []);
          if (generatedQuestions && generatedQuestions[qIdx] && generatedQuestions[qIdx].options) {
            answersWithMcqID = answersWithMcqID.map((a, aIdx) => ({
              ...a,
              mcqOptionID: generatedQuestions[qIdx].options[aIdx]?.mcqOptionID
            }));
          }
          const options = (answersWithMcqID || []).map((ans, aIdx) => ({
            mcqOptionID: ans.mcqOptionID,
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
      // Nếu chọn Actived thì gọi thêm API update status = 3
      if (statusType === 'Actived') {
        await axios.put(`${API_URL}api/Test/update-status-fix`, { testID: newTestID, testStatus: 3 });
        message.success('Đã tạo và chuyển sang Actived!');
      } else {
        message.success('Đã tạo bài kiểm tra (Drafted)!');
      }
      setShowCreate(false);
      setFormData({ basicInfo: {}, sections: [] });
      setOpenModal(false);
      setModalLoading(false);
      // Điều hướng về đúng sidebar
      if (userRole === 'Lecturer' || userRole === 'Lecture') {
        navigate('/lecturer/assessment');
      } else if (userRole === 'Manager') {
        navigate('/dashboard/assessment');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tạo bài kiểm tra!');
      setModalLoading(false);
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

  // Modal cho Lecturer
  const [lecturerModal, setLecturerModal] = useState(false);
  const [lecturerLoading, setLecturerLoading] = useState(false);
  const createLecturerTest = async (pending) => {
    setLecturerLoading(true);
    const basicInfo = formData.basicInfo;
    const sections = formData.sections;
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const accountID = user.accountId;
      // 1. Tạo bài kiểm tra
      const payload = {
        accountID,
        subjectID: basicInfo.SubjectID,
        testType: TEST_TYPE_ENUM_MAP[basicInfo.testType],
        category: CATEGORY_ENUM_REVERSE_MAP[basicInfo.Category],
        testName: basicInfo.TestName,
      };
      const res = await axios.post(`${API_URL}api/Test/create`, payload);
      const newTestID = res.data?.testId;
      if (!newTestID) throw new Error("Không lấy được testID từ response");
      // 2. Tạo section cho từng section
      const sectionQuestionIdMap = [];
      const generatedQuestionsBySection = [];
      for (const section of sections) {
        const testSectionType = TEST_SECTION_TYPE_ENUM_MAP[section.type];
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
        const emptyQRes = await axios.post(`${API_URL}api/Questions/generate-empty`, {
          testSectionID: testSectionId,
          formatType: testSectionType,
          numberOfQuestions: section.questions.length,
        });
        const generatedQuestions = (emptyQRes.data?.data || []);
        const questionIDs = generatedQuestions.map(q => q.questionID);
        sectionQuestionIdMap.push({ testSectionId, questionIDs });
        generatedQuestionsBySection.push(generatedQuestions);
      }
      // 3. Cập nhật nội dung cho từng câu hỏi
      for (let sIdx = 0; sIdx < sections.length; ++sIdx) {
        const section = sections[sIdx];
        const questionIDs = sectionQuestionIdMap[sIdx].questionIDs;
        const generatedQuestions = generatedQuestionsBySection[sIdx];
        for (let qIdx = 0; qIdx < section.questions.length; ++qIdx) {
          const question = section.questions[qIdx];
          const questionID = questionIDs[qIdx];
          let answersWithMcqID = (question.answers || []);
          if (generatedQuestions && generatedQuestions[qIdx] && generatedQuestions[qIdx].options) {
            answersWithMcqID = answersWithMcqID.map((a, aIdx) => ({
              ...a,
              mcqOptionID: generatedQuestions[qIdx].options[aIdx]?.mcqOptionID
            }));
          }
          const options = (answersWithMcqID || []).map((ans, aIdx) => ({
            mcqOptionID: ans.mcqOptionID,
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
      // Nếu pending = true thì gọi API update status = 2
      if (pending) {
        await axios.put(`${API_URL}api/Test/update-status-fix`, { testID: newTestID, testStatus: 1 });
        message.success('Đã tạo và chuyển sang Pending!');
      } else {
        message.success('Đã tạo bài kiểm tra (Drafted)!');
      }
      setShowCreate(false);
      setFormData({ basicInfo: {}, sections: [] });
      setLecturerModal(false);
      setLecturerLoading(false);
      // Điều hướng về đúng sidebar
      if (userRole === 'Lecturer' || userRole === 'Lecture') {
        navigate('/lecturer/assessment');
      } else if (userRole === 'Manager') {
        navigate('/dashboard/assessment');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tạo bài kiểm tra!');
      setLecturerLoading(false);
    }
  };

  // Hàm gửi duyệt test
  const handleSendApprove = (test) => {
    setSelectedTest(test);
    setSendApproveModal(true);
  };
  const confirmSendApprove = async () => {
    setSendApproveLoading(true);
    try {
      await axios.put(`${API_URL}api/Test/update-status-fix`, { testID: selectedTest.testID, testStatus: 2 });
      message.success('Đã gửi bài kiểm tra cho quản lí duyệt!');
      setSendApproveModal(false);
      setSendApproveLoading(false);
      setSelectedTest(null);
      // Reload lại danh sách test
      // (Có thể gọi lại fetchTests hoặc reload page tuỳ ý)
      window.location.reload();
    } catch (error) {
      message.error('Lỗi khi gửi duyệt!');
      setSendApproveLoading(false);
    }
  };

  const [userRole, setUserRole] = useState(null);

  // Add this handler for Excel import
  const handleImportExcel = async (file, sectionIdx = 0) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_URL}api/ImportExcel/mcq/import/excel`, {
        method: 'POST',
        body: formData,
      });
      const apiData = await response.json();
      // Map API data to FE format
      if (apiData && Array.isArray(apiData.data)) {
        const questions = apiData.data.map(q => {
          // Collect all optionX (A, B, C, D, ...)
          const answers = Object.keys(q)
            .filter(key => key.startsWith('option'))
            .map(key => ({
              text: q[key],
              key: key.replace('option', ''),
            }));
          // Find correct answer index
          const correctIdx = q.correctAnswer
            ? answers.findIndex(a => a.key === q.correctAnswer)
            : 0;
          return {
            content: q.content,
            answers,
            correct: correctIdx,
          };
        });
        setFormData(prev => {
          const newSections = [...(prev.sections || [])];
          if (!newSections[sectionIdx]) return prev;
          newSections[sectionIdx] = {
            ...newSections[sectionIdx],
            questions,
          };
          return { ...prev, sections: newSections };
        });
      } else {
        message.error('Dữ liệu file không hợp lệ!');
      }
    } catch (err) {
      message.error('Lỗi khi import file Excel!');
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
                <Option value="Actived">Đang hoạt động</Option>
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
                  if (status === 'Actived') return <Tag color="green">Đang hoạt động</Tag>;
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
                render: (_, record) => {
                  let userRole = null;
                  let user = {};
                  try {
                    user = JSON.parse(localStorage.getItem('user')) || {};
                    userRole = user.role;
                  } catch (e) {
                    userRole = null;
                  }
                  const isLecturer = userRole === 'Lecturer';
                  const isOwnDraft = isLecturer && record.Status === 'Drafted' && record.createdBy === user.accountId;
                  return (
                    <Space>
                      <Button onClick={() => handleView(record)}>Xem</Button>
                      {/* Chỉ cho phép sửa/gửi duyệt nếu là bài của mình và là Drafted */}
                      {isOwnDraft && (
                        <>
                          <Button onClick={() => handleEdit(record)} type="primary">Sửa</Button>
                          <Button onClick={() => handleSendApprove(record)} type="dashed" style={{ color: '#faad14', borderColor: '#faad14' }}>Gửi duyệt</Button>
                        </>
                      )}
                      {/* Nếu không phải bài của mình hoặc không phải Drafted thì không cho sửa/gửi duyệt */}
                      {(!isOwnDraft && isLecturer) ? null : (
                        <Button onClick={() => handleDelete(record)} danger icon={<DeleteOutlined />} />
                      )}
                    </Space>
                  );
                },
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
            onImportExcel={handleImportExcel}
          />
        </div>
      )}
      <Modal
        open={openModal}
        title="Bạn muốn lưu bài kiểm tra ở trạng thái nào?"
        onCancel={() => setOpenModal(false)}
        footer={[
          <Button key="back" onClick={() => setOpenModal(false)}>
            Quay lại
          </Button>,
          <Button key="drafted" loading={modalLoading} onClick={async () => { await createTestWithStatus('Drafted'); }}>
            Lưu dưới dạng bản nháp
          </Button>,
          <Button key="actived" type="primary" loading={modalLoading} onClick={async () => { await createTestWithStatus('Actived'); }}>
            Lưu và kích hoạt
          </Button>,
        ]}
      >
        Chọn trạng thái cho bài kiểm tra sau khi tạo.
      </Modal>
      <Modal
        open={lecturerModal}
        title="Bạn có xác nhận tạo bài test này không?"
        onCancel={() => setLecturerModal(false)}
        footer={[
          <Button key="back" onClick={() => setLecturerModal(false)}>
            Quay lại
          </Button>,
          <Button key="drafted" loading={lecturerLoading} onClick={async () => { await createLecturerTest(false); }}>
            Xác nhận tạo
          </Button>,
          <Button key="pending" type="primary" loading={lecturerLoading} onClick={async () => { await createLecturerTest(true); }}>
            Hoàn tất và gửi duyệt
          </Button>,
        ]}
      >
        Chọn hành động cho bài kiểm tra sau khi tạo.
      </Modal>
      <Modal
        open={sendApproveModal}
        title="Bạn có muốn đưa lên cho manager duyệt không?"
        onCancel={() => setSendApproveModal(false)}
        footer={[
          <Button key="back" onClick={() => setSendApproveModal(false)}>
            Quay lại
          </Button>,
          <Button key="ok" type="primary" loading={sendApproveLoading} onClick={confirmSendApprove}>
            Xác nhận
          </Button>,
        ]}
      >
        Bài kiểm tra sẽ được chuyển sang trạng thái chờ duyệt.
      </Modal>
    </div>
  );
};

export default Assessments;
