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

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const res = await axios.get(`${API_URL}api/Questions/by-test/${testID}`);
        setSections(res.data || []);
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
    // TODO: Gọi API chuyển trạng thái sang Actived ở đây
    setTimeout(() => {
      setApproving(false);
      // message.success('Đã duyệt bài kiểm tra!');
    }, 1000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div></div>
        <Button
          type="primary"
          onClick={handleApprove}
          loading={approving}
          disabled={loading || approving || (sections[0]?.status === 'Actived')}
          style={{ marginBottom: 16 }}
        >
          Duyệt bài kiểm tra
        </Button>
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
                        <div><b>Nội dung:</b> {q.context}</div>
                        {Array.isArray(q.options) && q.options.length > 0 && (
                          <div>
                            <b>Đáp án:</b>
                            <ul>
                              {q.options.map((a, aIdx) => (
                                <li key={aIdx}>
                                  {String.fromCharCode(65 + aIdx)}. {a.context}
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
