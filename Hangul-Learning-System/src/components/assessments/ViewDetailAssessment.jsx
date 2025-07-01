import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descriptions, Card, Collapse, List, Spin, Alert, Button } from 'antd';
import axios from 'axios';
import { API_URL } from '../../config/api';

const { Panel } = Collapse;

const CATEGORY_LABELS = {
  Quiz: 'Kiểm tra 15 phút',
  Midterm: 'Thi giữa kì',
  Final: 'Thi cuối kì',
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
        {/* {isManager && testStatus == 1 && ( */}
          <Button
            type="primary"
            onClick={handleApprove}
            loading={approving}
            disabled={loading || approving || testStatus === 3}
            style={{ marginBottom: 16 }}
          >
            Duyệt bài kiểm tra
          </Button>
        {/* )} */}
      </div>
      <h2>Chi tiết bài kiểm tra</h2>
      {loading ? (
        <Spin />
      ) : error ? (
        <Alert type="error" message={error} />
      ) : (
        <>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Tên trang">{basicInfo.context}</Descriptions.Item>
            <Descriptions.Item label="Điểm">{basicInfo.score}</Descriptions.Item>
          </Descriptions>

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
