import React from 'react';
import { Form, InputNumber, Card } from 'antd';

const ConfigurationStep = ({ onGenerateClassSlots }) => {
  return (
    <Card>
      <Form.Item
        name="totalWeeks"
        label="Tổng số tuần"
        rules={[{ required: true, message: 'Vui lòng nhập tổng số tuần' }]}
      >
        <InputNumber
          min={1}
          placeholder="VD: 10"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="slotsPerWeek"
        label="Số slot mỗi tuần (Tối đa 5 slot/tuần)"
        rules={[
          { required: true, message: 'Vui lòng nhập số slot mỗi tuần' },
          {
            validator: (_, value) => {
              if (value > 5) {
                return Promise.reject(new Error('Tối đa chỉ được 5 slot mỗi tuần'));
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <InputNumber
          min={1}
          max={5}
          placeholder="VD: 3"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        name="defaultDuration"
        label="Thời lượng mặc định mỗi tiết (phút)"
        rules={[{ required: true, message: 'Vui lòng nhập thời lượng mặc định cho mỗi tiết' }]}
      >
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
    </Card>
  );
};

export default ConfigurationStep;
