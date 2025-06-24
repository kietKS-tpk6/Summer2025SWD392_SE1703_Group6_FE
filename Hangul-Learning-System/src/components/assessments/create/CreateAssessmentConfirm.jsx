import React from 'react';
import { Descriptions, Card, Collapse, List } from 'antd';

const { Panel } = Collapse;

const CATEGORY_LABELS = {
  Quiz: 'Kiểm tra 15 phút',
  Midterm: 'Thi giữa kì',
  Final: 'Thi cuối kì',
};

const CreateAssessmentConfirm = ({ basicInfo, sections }) => {
  return (
    <div>
      <h3>Thông tin cơ bản</h3>
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Tên bài kiểm tra">{basicInfo?.TestName}</Descriptions.Item>
        <Descriptions.Item label="Môn học">{basicInfo?.SubjectName || basicInfo?.SubjectID}</Descriptions.Item>
        <Descriptions.Item label="Loại">{basicInfo?.testType}</Descriptions.Item>
        <Descriptions.Item label="Phân loại">{CATEGORY_LABELS[basicInfo?.Category] || basicInfo?.Category}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: 24 }}>Danh sách section & câu hỏi</h3>
      <Collapse accordion>
        {sections?.map((section, idx) => (
          <Panel header={`Section ${idx + 1}: ${section.name || ''}`} key={idx}>
            <p><b>Loại:</b> {section.type}</p>
            <p><b>Điểm:</b> {section.score}</p>
            <List
              header={<b>Danh sách câu hỏi</b>}
              dataSource={section.questions?.slice().reverse()}
              renderItem={(q, qIdx) => (
                <List.Item>
                  <Card
                    title={`Câu ${qIdx + 1}`}
                    style={{ width: '100%' }}
                    size="small"
                  >
                    <div><b>Nội dung:</b> {q.content}</div>
                    {section.type === 'MCQ' && (
                      <>
                        <div>
                          <b>Đáp án:</b>
                          <ul>
                            {q.answers?.map((a, aIdx) => (
                              <li key={a.key}>
                                {String.fromCharCode(65 + aIdx)}. {a.text}
                                {q.correct === aIdx && <b style={{ color: 'green' }}> (Đúng)</b>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default CreateAssessmentConfirm;
