import React from 'react';
import { Descriptions, Card } from 'antd';

const ConfirmationStep = ({ form }) => {
  return (
    <Card>
      <Descriptions title="Thông tin môn học" bordered>
        <Descriptions.Item label="Tên môn học" span={3}>
          {form.getFieldValue('name')}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={3}>
          {form.getFieldValue('description')}
        </Descriptions.Item>
        <Descriptions.Item label="Điểm đạt">
          {form.getFieldValue('minAverageScoreToPass')}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số tuần">
          {form.getFieldValue('totalWeeks')}
        </Descriptions.Item>
        <Descriptions.Item label="Số slot mỗi tuần">
          {form.getFieldValue('slotsPerWeek')}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số bài kiểm tra">
          {form.getFieldValue('totalTests')}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ConfirmationStep; 