import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, DatePicker, TimePicker, Spin, message } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';

const AddAssessmentToTestEventComponent = ({
  open,
  onCancel,
  onOk,
  form,
  initialValues = {},
  endAt,
  loading,
  onTestChange,
  onDescriptionChange,
  onStartDateChange,
  onStartTimeChange,
  onAttemptLimitChange,
  onPasswordChange,
  lessonStartTime,
  lessonEndTime,
  assessment,
  subjectId,
  API_URL,
  onEndTimeChange,
}) => {
  // State cho danh sách bài test
  const [availableTests, setAvailableTests] = useState([]);
  const [testLoading, setTestLoading] = useState(false);

  // State cho giờ bắt đầu/kết thúc
  const [selectedStartTime, setSelectedStartTime] = useState(null);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Fetch danh sách bài test khi modal open và assessment thay đổi
  useEffect(() => {
    const fetchTests = async () => {
      if (!open || !assessment) {
        setAvailableTests([]);
        return;
      }
      setTestLoading(true);
      try {
        const res = await axios.get(`${API_URL}api/Test/advanced-search`, {
          params: {
            category: assessment.assessmentCategory,
            subjectId: subjectId,
            testType: assessment.testType,
            status: 3,
          }
        });
        setAvailableTests(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      } catch {
        setAvailableTests([]);
      } finally {
        setTestLoading(false);
      }
    };
    fetchTests();
  }, [open, assessment, subjectId, API_URL]);

  // Lấy ngày lesson (chỉ cho chọn đúng ngày này)
  const lessonDate = lessonStartTime ? dayjs(lessonStartTime).startOf('day') : null;

  // Khi chọn giờ bắt đầu
  const handleStartTimeChange = (time) => {
    setSelectedStartTime(time);
    if (onStartTimeChange) onStartTimeChange(time);
    // Nếu giờ kết thúc hiện tại không hợp lệ, tự động cập nhật lại
    if (time && selectedEndTime) {
      const start = dayjs(time);
      const end = dayjs(selectedEndTime);
      if (end.diff(start, 'minute') < 15) {
        // Tính giờ kết thúc mới
        let newEnd = start.add(15, 'minute');
        // Nếu vượt quá lessonEndTime thì set null
        if (lessonEndTime && newEnd.isAfter(dayjs(lessonEndTime))) {
          setSelectedEndTime(null);
          if (onEndTimeChange) onEndTimeChange(null);
          form.setFieldsValue({ endTime: null });
        } else {
          setSelectedEndTime(newEnd);
          if (onEndTimeChange) onEndTimeChange(newEnd);
          form.setFieldsValue({ endTime: newEnd });
        }
      }
    }
  };

  // Khi chọn giờ kết thúc
  const handleEndTimeChange = (time) => {
    setSelectedEndTime(time);
    if (onEndTimeChange) onEndTimeChange(time);
  };

  // TimePicker: chỉ cho chọn giờ/phút hợp lệ
  const disabledStartTime = () => {
    if (!lessonStartTime || !lessonEndTime) return {};
    const start = dayjs(lessonStartTime);
    const end = dayjs(lessonEndTime).subtract(15, 'minute');
    return {
      disabledHours: () => {
        const arr = [];
        for (let i = 0; i < 24; i++) {
          if (i < start.hour() || i > end.hour()) arr.push(i);
        }
        return arr;
      },
      disabledMinutes: (selectedHour) => {
        let arr = [];
        if (selectedHour === start.hour()) {
          for (let i = 0; i < start.minute(); i++) arr.push(i);
        }
        if (selectedHour === end.hour()) {
          for (let i = end.minute() + 1; i < 60; i++) arr.push(i);
        }
        return arr;
      },
    };
  };
  const disabledEndTime = () => {
    if (!lessonStartTime || !lessonEndTime || !selectedStartTime) return {};
    const minEnd = dayjs(selectedStartTime).add(15, 'minute');
    const start = dayjs(lessonStartTime).add(15, 'minute');
    const end = dayjs(lessonEndTime);
    return {
      disabledHours: () => {
        const arr = [];
        for (let i = 0; i < 24; i++) {
          // Không cho chọn trước minEnd hoặc ngoài khoảng lessonEndTime
          if (i < minEnd.hour() || i > end.hour()) arr.push(i);
        }
        return arr;
      },
      disabledMinutes: (selectedHour) => {
        let arr = [];
        if (selectedHour === minEnd.hour()) {
          for (let i = 0; i < minEnd.minute(); i++) arr.push(i);
        }
        if (selectedHour === end.hour()) {
          for (let i = end.minute() + 1; i < 60; i++) arr.push(i);
        }
        return arr;
      },
    };
  };

  return (
    <Modal
      open={open}
      title="Thêm đề kiểm tra"
      onCancel={onCancel}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          // Validate giờ kết thúc phải sau giờ bắt đầu ít nhất 15 phút
          if (values.startTime && values.endTime) {
            const start = dayjs(values.startTime);
            const end = dayjs(values.endTime);
            if (end.diff(start, 'minute') < 15) {
              message.error('Giờ kết thúc phải sau giờ bắt đầu ít nhất 15 phút!');
              return;
            }
          }
          if (onOk) await onOk();
        } catch (err) {
          // Form validate lỗi, không làm gì
        }
      }}
      okText="Xác nhận"
      cancelText="Hủy"
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          label="Chọn bài test"
          name="testID"
          rules={[{ required: true, message: 'Vui lòng chọn bài test' }]}
        >
          {testLoading ? (
            <Spin size="small" style={{ display: 'block', margin: '8px auto' }} />
          ) : (
            <Select
              placeholder="Chọn bài test"
              notFoundContent="Hiện tại không có bài kiểm tra phù hợp"
              onChange={onTestChange}
            >
              {availableTests.map(test => (
                <Select.Option key={test.testID} value={test.testID}>{test.testName}</Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} onChange={onDescriptionChange} />
        </Form.Item>
        <Form.Item label="Ngày kiểm tra" required>
          <DatePicker
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            value={lessonDate}
            disabled
          />
        </Form.Item>
        <Form.Item label="Giờ bắt đầu" name="startTime" rules={[{ required: true, message: 'Chọn giờ bắt đầu' }]}> 
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            onChange={handleStartTimeChange}
            disabledTime={disabledStartTime}
            minuteStep={5}
          />
        </Form.Item>
        <Form.Item label="Giờ kết thúc" name="endTime" rules={[{ required: true, message: 'Chọn giờ kết thúc' }]}> 
          <TimePicker
            style={{ width: '100%' }}
            format="HH:mm"
            onChange={handleEndTimeChange}
            disabledTime={disabledEndTime}
            minuteStep={5}
          />
        </Form.Item>
        <Form.Item label="Số lần học sinh làm bài" name="attemptLimit" rules={[{ required: true, message: 'Nhập số lượng học sinh' }]}> 
          <Input type="number" min={1} onChange={onAttemptLimitChange} />
        </Form.Item>
        <Form.Item label="Password cho bài test" name="password"> 
          <Input onChange={onPasswordChange} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAssessmentToTestEventComponent;
