import React, { useEffect } from 'react';
import { Form, Select, InputNumber, Button, Card, Row, Col, Typography, Space, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const AssessmentStep = ({ form, configuration }) => {
  const criteria = Form.useWatch('criteria', form) || [];
  const totalWeight = criteria.reduce((sum, item) => sum + (item?.weightPercent || 0), 0);
  const isWeightValid = totalWeight === 100;

  useEffect(() => {
    if (
      configuration &&
      configuration.totalTests &&
      (!form.getFieldValue('criteria') || form.getFieldValue('criteria').length === 0)
    ) {
      const initialCriteria = Array.from({ length: configuration.totalTests }, () => ({
        category: undefined,
        weightPercent: undefined,
      }));
      form.setFieldsValue({ criteria: initialCriteria });
    }
  }, [form, configuration]);

  return (
    <Card title="Thiết lập tiêu chí đánh giá">
      <Form.List name="criteria">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                <Col xs={24} sm={10} md={6}>
                  <Form.Item
                    {...restField}
                    name={[name, 'category']}
                    rules={[{ required: true, message: 'Chọn loại đánh giá' }]}
                  >
                    <Select placeholder="Loại đánh giá">
                      <Option value={0}>Midterm</Option>
                      <Option value={1}>FifteenMinutes</Option>
                      <Option value={2}>Final</Option>
                      <Option value={3}>Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Form.Item
                    {...restField}
                    name={[name, 'weightPercent']}
                    rules={[
                      { required: true, message: 'Nhập trọng số' },
                      {
                        type: 'number',
                        min: 0,
                        max: 100,
                        message: 'Trọng số từ 0 đến 100',
                      },
                    ]}
                  >
                    <InputNumber
                      min={0}
                      max={100}
                      step={1}
                      style={{ width: '100%' }}
                      placeholder="%"
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button type="link" danger onClick={() => remove(name)}>
                    Xóa
                  </Button>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Thêm tiêu chí đánh giá
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div style={{ marginTop: 16 }}>
        <Space>
          {isWeightValid ? (
            <CheckCircleOutlined style={{ color: 'green' }} />
          ) : (
            <ExclamationCircleOutlined style={{ color: 'red' }} />
          )}
          <Text strong style={{ color: isWeightValid ? 'green' : 'red' }}>
            Tổng trọng số: {totalWeight}% {isWeightValid ? '' : '(Phải bằng 100%)'}
          </Text>
        </Space>
      </div>
    </Card>
  );
};

export default AssessmentStep;
