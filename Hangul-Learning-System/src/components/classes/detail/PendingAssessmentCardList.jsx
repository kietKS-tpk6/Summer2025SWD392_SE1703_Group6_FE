import React from 'react';
import { Card } from 'antd';
import dayjs from 'dayjs';

const TestTypeEnum = {
  0: 'None',
  1: 'Vocabulary',
  2: 'Grammar',
  3: 'Listening',
  4: 'Reading',
  5: 'Writing',
  6: 'Mix',
  7: 'Other',
};

// Dữ liệu mẫu các buổi kiểm tra chưa có đề
const pendingAssessments = [
  {
    id: 1,
    className: 'Tiếng Hàn tổng hợp 11',
    classCode: 'CL0028',
    date: '2024-07-01',
    startTime: '19:30',
    endTime: '20:15',
    type: 'Giữa kỳ',
    testType: 3, // Listening
    hasQuestions: false,
  },
  {
    id: 2,
    className: 'Tiếng Hàn sơ cấp 2',
    classCode: 'CL0030',
    date: '2024-07-03',
    startTime: '18:00',
    endTime: '18:45',
    type: 'Cuối kỳ',
    testType: 5, // Writing
    hasQuestions: false,
  },
];

const PendingAssessmentCardList = () => {
  const total = pendingAssessments.length;
  const attached = pendingAssessments.filter(a => a.hasQuestions).length;
  const notAttached = total - attached;

  return (
    <div>
      {/* <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 12, fontWeight: 700, color: '#222' }}>
        Tổng số buổi kiểm tra: {total}
      </div> */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          marginBottom: 6
        }}>
          <div style={{ flex: 1, textAlign: 'center', color: '#52c41a', fontWeight: 700, fontSize: 15 }}>
            Đã gắn đề
          </div>
          <div style={{ flex: 1, textAlign: 'center', color: '#ff4d4f', fontWeight: 700, fontSize: 15 }}>
            Chưa gắn đề
          </div>
          <div style={{ flex: 1, textAlign: 'center', color: 'gold', fontWeight: 700, fontSize: 15 }}>
            Tổng số
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 420,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 8,
          padding: '8px 0',
        }}>
          <div style={{ flex: 1, textAlign: 'center', color: '#52c41a', fontWeight: 700, fontSize: 26 }}>
            {attached}
          </div>
          <div style={{ flex: 1, textAlign: 'center', color: '#ff4d4f', fontWeight: 700, fontSize: 26 }}>
            {notAttached}
          </div>
          <div style={{ flex: 1, textAlign: 'center', color: 'gold', fontWeight: 700, fontSize: 26 }}>
            {total}
          </div>
        </div>
      </div>
      {total === 0 ? (
        <div style={{ textAlign: 'center' }}>Không có buổi kiểm tra nào.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {pendingAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 8 }}
              bodyStyle={{ padding: 16, background: '#fafbfc' }}
            >
              {!assessment.hasQuestions && (
                <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 8 }}>
                  Chưa có đề kiểm tra
                </div>
              )}
              <div style={{ color: '#555', marginBottom: 8 }}>
                <span role="img" aria-label="clock">🕒</span>
                {' '}
                {assessment.startTime} - {assessment.endTime}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                Ngày: <span>{dayjs(assessment.date).format('DD/MM')}</span>
              </div>
              <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                Loại: <b>{assessment.type}</b>
              </div>
              <div style={{ fontSize: 13, color: '#333' }}>
                Kĩ năng: <b>{TestTypeEnum[assessment.testType] || 'Không xác định'}</b>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingAssessmentCardList; 