import React from 'react';
import { Form, InputNumber, Input, Card, Divider, Table, Button, Space } from 'antd';

const { TextArea } = Input;

const ClassInfoStep = ({ classSlots, editingSlot, setEditingSlot, handleEditSlot, handleUpdateSlot, editForm }) => {
  // Tính rowSpan cho cột "Tuần"
  const mergedData = () => {
    const weekRowSpanMap = {};
    classSlots.forEach((item, index) => {
      const week = item.week;
      if (weekRowSpanMap[week] !== undefined) {
        weekRowSpanMap[week]++;
      } else {
        weekRowSpanMap[week] = 1;
      }
    });

    const renderedSlots = [];
    const seenWeeks = new Set();
    let cursor = 0;

    for (let i = 0; i < classSlots.length; i++) {
      const item = { ...classSlots[i] };
      const currentWeek = item.week;

      if (!seenWeeks.has(currentWeek)) {
        item.rowSpan = weekRowSpanMap[currentWeek];
        seenWeeks.add(currentWeek);
      } else {
        item.rowSpan = 0;
      }

      renderedSlots.push(item);
    }

    return renderedSlots;
  };

  const columns = [
    {
      title: 'Tuần',
      dataIndex: 'week',
      key: 'week',
      width: '10%',
      render: (text, row) => ({
        children: text,
        props: { rowSpan: row.rowSpan },
      }),
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
      render: (text, record) =>
        editingSlot?.slot === record.slot ? (
          <Form form={editForm} component={false}>
            <Form.Item
              name="title"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Thời lượng (phút)',
      dataIndex: 'durationMinutes',
      key: 'durationMinutes',
      width: '15%',
      render: (text, record) =>
        editingSlot?.slot === record.slot ? (
          <Form form={editForm} component={false}>
            <Form.Item
              name="durationMinutes"
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Tài nguyên',
      dataIndex: 'resources',
      key: 'resources',
      ellipsis: true,
      render: (text, record) =>
        editingSlot?.slot === record.slot ? (
          <Form form={editForm} component={false}>
            <Form.Item name="resources" style={{ margin: 0 }}>
              <Input />
            </Form.Item>
          </Form>
        ) : (
          text
        ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space>
          {editingSlot?.slot === record.slot ? (
            <>
              <Button type="primary" onClick={handleUpdateSlot}>
                Lưu
              </Button>
              <Button onClick={() => setEditingSlot(null)}>Hủy</Button>
            </>
          ) : (
            <Button type="primary" onClick={() => handleEditSlot(record)}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Divider>Danh sách tiết học</Divider>
      <Table
        dataSource={mergedData()}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="slot"
      />
    </Card>
  );
};

export default ClassInfoStep;
