import React from 'react';
import { Descriptions, Card, Table, Divider, List } from 'antd';

const AssessmentCategoryLabel = {
  0: 'Quiz',
  1: 'Presentation',
  2: 'Midterm',
  3: 'Final',
  4: 'Attendance',
  5: 'Assignment',
  6: 'Class Participation'
};
const TestTypeEnum = {
  0: 'None',
  1: 'Vocabulary',
  2: 'Grammar',
  3: 'Listening',
  4: 'Reading',
  5: 'Writing',
  6: 'Mix',
  7: 'Other'
};

const ConfirmationStep = ({ form, classSlots = [], assessmentInfo = [] }) => {
  const testSlots = form.getFieldValue('testSlots') || [];
  const criteria = form.getFieldValue('criteria') || assessmentInfo || [];

  // Columns for class slots
  const classColumns = [
    { title: 'Tuần', dataIndex: 'week', key: 'week', width: '10%' },
    { title: 'Tiết', dataIndex: 'slot', key: 'slot', width: '10%' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Thời lượng (phút)', dataIndex: 'durationMinutes', key: 'durationMinutes', width: '15%' },
    { title: 'Tài nguyên', dataIndex: 'resources', key: 'resources', ellipsis: true },
  ];

  // Columns for test slots
  const testColumns = [
    { title: 'Tuần', dataIndex: 'week', key: 'week', width: '10%' },
    { title: 'Tiết', dataIndex: 'slot', key: 'slot', width: '10%' },
    { title: 'Bài kiểm tra', dataIndex: 'criteriaId', key: 'criteriaId', render: (val) => AssessmentCategoryLabel[val] || '' },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration', width: '15%' },
    { title: 'Kỹ năng', dataIndex: 'testType', key: 'testType', render: (val) => TestTypeEnum[val] || '' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
  ];

  // Merge testSlots with classSlots for week/slot info
  const testSlotRows = (testSlots || []).map((slot, idx) => ({
    ...slot,
    week: classSlots[idx]?.week,
    slot: classSlots[idx]?.slot,
    key: idx
  }));

  return (
    <div>
      <Card>
        <Descriptions title="Thông tin môn học" bordered column={2}>
          <Descriptions.Item label="Tên môn học">{form.getFieldValue('name')}</Descriptions.Item>
          <Descriptions.Item label="Mô tả">{form.getFieldValue('description')}</Descriptions.Item>
          <Descriptions.Item label="Điểm đạt">{form.getFieldValue('minAverageScoreToPass')}</Descriptions.Item>
          <Descriptions.Item label="Tổng số tuần">{form.getFieldValue('totalWeeks')}</Descriptions.Item>
          <Descriptions.Item label="Số slot mỗi tuần">{form.getFieldValue('slotsPerWeek')}</Descriptions.Item>
          <Descriptions.Item label="Tổng số bài kiểm tra">{form.getFieldValue('totalTests')}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Divider orientation="left" style={{ marginTop: 24 }}>Danh sách tiết học</Divider>
      <Table
        dataSource={classSlots}
        columns={classColumns}
        pagination={false}
        size="small"
        rowKey={(row) => row.slot}
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">Thông tin đánh giá</Divider>
      <List
        bordered
        dataSource={criteria}
        renderItem={(item, idx) => (
          <List.Item>
            <b>{AssessmentCategoryLabel[item.category]}</b>: Trọng số {item.weightPercent}% | Số bài kiểm tra: {item.requiredTestCount} | Điểm đạt: {item.minPassingScore} | Ghi chú: {item.note}
          </List.Item>
        )}
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">Danh sách slot kiểm tra</Divider>
      <Table
        dataSource={testSlotRows}
        columns={testColumns}
        pagination={false}
        size="small"
        rowKey={(row) => row.key}
      />
    </div>
  );
};

export default ConfirmationStep; 