import React from 'react';
import { Form, InputNumber, Button, Card, Space, Table, Tag, Select, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const CategoryEnum = {
  0: 'Midterm',
  1: 'FifteenMinutes',
  2: 'Final',
  3: 'Other'
};

const TestTypeEnum = {
  0: 'MCQ',
  1: 'Writing',
  2: 'Speaking',
  3: 'Listening',
  4: 'Reading',
  5: 'Mix',
  6: 'Other'
};

const TestSlotsStep = ({ classSlots, form }) => {
  const criteria = Form.useWatch('criteria', form) || [];

  const columns = [
    {
      title: 'Tuần',
      dataIndex: 'week',
      key: 'week',
      width: '10%',
    },
    {
      title: 'Tiết',
      dataIndex: 'slot',
      key: 'slot',
      width: '10%',
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      width: '15%',
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resources',
      key: 'resources',
      ellipsis: true,
    },
    {
      title: 'Bài kiểm tra',
      key: 'testCriteria',
      width: '25%',
      render: (_, record) => (
        <Form.Item
          name={['testSlots', record.slot - 1, 'criteriaId']}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Chọn bài kiểm tra"
            allowClear
            style={{ width: '100%' }}
          >
            {criteria.map((criterion, index) => (
              <Option key={index} value={index}>
                {CategoryEnum[criterion.category]} - {TestTypeEnum[criterion.testType]} ({criterion.weightPercent}%)
              </Option>
            ))}
          </Select>
        </Form.Item>
      )
    }
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h3>Danh sách buổi học</h3>
        <Table
          dataSource={classSlots}
          columns={columns}
          pagination={false}
          size="small"
          rowKey="slot"
        />
      </div>
    </Card>
  );
};

export default TestSlotsStep; 