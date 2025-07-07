import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Card, Collapse, List, Spin, Alert, Button, Tag, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { UserOutlined, FileTextOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const STATUS_LABELS = {
  0: 'Nháp',
  1: 'Chờ duyệt',
  2: 'Từ chối',
  3: 'Đang hoạt động',
  4: 'Đã xóa',
};

const CATEGORY_LABELS = {
  0: 'Kiểm tra 15 phút',
  2: 'Thi giữa kì',
  3: 'Thi cuối kì',
};

const TEST_TYPE_LABELS = {
  1: 'Vocabulary',
  2: 'Grammar',
  3: 'Listening',
  4: 'Reading',
  5: 'Writing',
  6: 'Mix',
  7: 'MCQ',
  8: 'Other',
};

const ViewDetailAssessment = ({ testID: propTestID }) => {
  // testID có thể lấy từ prop hoặc từ URL
  const params = useParams();
  const testID = propTestID || params.testID;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();
  const [approving, setApproving] = useState(false);
  const [testStatus, setTestStatus] = useState();
  const [creatorFullname, setCreatorFullname] = useState('');
  const [createBy, setCreateBy] = useState('');
  const [testInfo, setTestInfo] = useState({});
  let userRole = null;
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    userRole = user && user.role;
  } catch (e) {
    userRole = null;
  }
  const isManager = userRole === 'Manager';
  const isLecturer = userRole === 'Lecture';
  const isStudent = userRole === 'Student';

  // Lấy user info từ localStorage
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('user')) || {};
  } catch {}
  const isOwnDraft = isManager && testInfo.status === 0 && testInfo.account?.accountID === currentUser.accountId;
  const isLecture = userRole === 'Lecture';
  const isOwnDraftLecture = isLecture && testInfo.status === 0 && createBy === currentUser.accountId;

  console.log('Current user:', currentUser);
  console.log('Test info:', testInfo);
  console.log('Params:', params);
  console.log('createBy:', createBy, 'accountId:', currentUser.accountId, 'status:', testInfo.status);
  console.log('isOwnDraftLecture:', isOwnDraftLecture);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await axios.get(`${API_URL}api/Questions/by-test/${testID}`);
        setSections(res.data || []);
        console.log(res.data);
        // Lấy status từ section đầu tiên (giả sử backend trả về status ở đây)
        if (res.data && res.data[0] && res.data[0].testStatus !== undefined) {
          setTestStatus(res.data[0].testStatus);
        } else if (res.data && res.data[0] && res.data[0].status !== undefined) {
          setTestStatus(res.data[0].status);
        }
        // Gọi thêm API để lấy fullname người tạo
        try {
          const testRes = await axios.get(`${API_URL}api/Test/${testID}`);
          const fullname = testRes.data?.account?.fullname || '';
          const createBy = testRes.data?.createBy || '';
          setCreatorFullname(fullname);
          setCreateBy(createBy);
          setTestInfo(testRes.data || {});
        } catch {}
      } catch (e) {
        setError('Không thể tải chi tiết bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };
    if (testID) fetchDetail();
  }, [testID]);

  // Lấy thông tin cơ bản từ section đầu tiên nếu có
  const basicInfo = sections.length > 0 ? sections[0] : {};

  // Hàm duyệt bài kiểm tra (API sẽ gắn sau)
  const handleApprove = async () => {
    setApproving(true);
    try {
      // Không cần truyền accountID nữa
      await axios.put(`${API_URL}api/Test/update-status-fix`, { testID, testStatus: 3 });
      setTestStatus(3);
      // Reload lại chi tiết
      const res = await axios.get(`${API_URL}api/Questions/by-test/${testID}`);
      setSections(res.data || []);
    } catch (e) {
      // message.error('Lỗi khi duyệt bài kiểm tra!');
    } finally {
      setApproving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div></div>
        {isOwnDraft && (
          <Button
            type="primary"
            onClick={handleApprove}
            loading={approving}
            disabled={loading || approving || testStatus === 3}
            style={{ marginBottom: 16 }}
          >
            Duyệt bài kiểm tra
          </Button>
        )}
        {isOwnDraftLecture && (
          <Button
            type="primary"
            onClick={async () => {
              setApproving(true);
              try {
                await axios.put(`${API_URL}api/Test/update-status-fix`, { testID, testStatus: 1 });
                setTestStatus(1);
                const res = await axios.get(`${API_URL}api/Questions/by-test/${testID}`);
                setSections(res.data || []);
              } catch {}
              setApproving(false);
            }}
            loading={approving}
            disabled={loading || approving || testInfo.status !== 0}
            style={{ marginBottom: 16, marginLeft: 8 }}
          >
            Gửi duyệt cho quản lí
          </Button>
        )}
      </div>
      <h2 style={{ marginBottom: 16, color: '#1677ff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
        <FileTextOutlined /> {testInfo.testName || 'Chi tiết bài kiểm tra'}
      </h2>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          <Card bordered style={{ marginBottom: 24, background: '#f8fafd' }}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Descriptions column={1} size="small" labelStyle={{ fontWeight: 600 }}>
                  <Descriptions.Item label={<span><InfoCircleOutlined /> Loại</span>}>
                    {TEST_TYPE_LABELS[testInfo.testType] ?? testInfo.testType}
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><InfoCircleOutlined /> Phân loại</span>}>
                    {CATEGORY_LABELS[testInfo.category] ?? testInfo.category}
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><CheckCircleOutlined /> Trạng thái</span>}>
                    <Tag color={testInfo.status === 3 ? 'green' : testInfo.status === 1 ? 'orange' : testInfo.status === 0 ? 'default' : 'red'}>
                      {STATUS_LABELS[testInfo.status] ?? testInfo.status}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={<span><UserOutlined /> Người tạo</span>}>
                    {creatorFullname}
                  </Descriptions.Item>            
                  <Descriptions.Item label={<span><InfoCircleOutlined /> Điểm</span>}>
                    {basicInfo.score}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              
            </Row>
          </Card>

          <h3 style={{ marginTop: 24 }}>Danh sách section & câu hỏi</h3>
          <Collapse accordion>
            {sections.map((section, idx) => (
              <Panel header={`Trang ${idx + 1}: ${section.context || ''}`} key={idx}>
                <p><b>Điểm:</b> {section.score}</p>
                <List
                  header={<b>Danh sách câu hỏi</b>}
                  dataSource={section.questions || []}
                  renderItem={(q, qIdx) => (
                    <List.Item>
                      <Card
                        title={`Câu ${qIdx + 1}`}
                        style={{ width: '100%' }}
                        size="small"
                      >
                        <div><b>Nội dung:</b> {q.context}
                          {q.imageURL && (
                            <img src={q.imageURL} alt="img" style={{ maxWidth: 120, marginLeft: 8, verticalAlign: 'middle' }} />
                          )}
                          {q.audioURL && (
                            <audio src={q.audioURL} controls style={{ marginLeft: 8, verticalAlign: 'middle' }} />
                          )}
                        </div>
                        {Array.isArray(q.options) && q.options.length > 0 && (
                          <div>
                            <b>Đáp án:</b>
                            <ul>
                              {q.options.map((a, aIdx) => (
                                <li key={aIdx}>
                                  {String.fromCharCode(65 + aIdx)}. {a.context}
                                  {a.imageURL && (
                                    <img src={a.imageURL} alt="img" style={{ maxWidth: 80, marginLeft: 8, verticalAlign: 'middle' }} />
                                  )}
                                  {a.audioURL && (
                                    <audio src={a.audioURL} controls style={{ marginLeft: 8, verticalAlign: 'middle' }} />
                                  )}
                                  {a.isCorrect && <b style={{ color: 'green' }}> (Đúng)</b>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    </List.Item>
                  )}
                />
              </Panel>
            ))}
          </Collapse>
        </>
      )}
      <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
        Quay lại
      </Button>
    </div>
  );
};

export default ViewDetailAssessment;
