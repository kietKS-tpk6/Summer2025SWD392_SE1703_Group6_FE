import React, { useState } from 'react';
import { Card, Button, Modal, Select, Input, DatePicker, TimePicker, Form } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import { API_URL } from '../../../config/api';

// Enum mapping from AssessmentBasicForm
const TEST_CONTENT_OPTIONS = [
  { value: 'Vocabulary', label: 'Từ vựng' },
  { value: 'Grammar', label: 'Ngữ pháp' },
  { value: 'Listening', label: 'Nghe hiểu' },
  { value: 'Reading', label: 'Đọc hiểu' },
  { value: 'Writing', label: 'Viết' },
  { value: 'Mix', label: 'Tổng hợp' },
  { value: 'MCQ', label: 'Trắc nghiệm' },
  { value: 'Other', label: 'Khác' },
];
const TEST_TYPE_LABELS = {
  0: 'Không xác định',
  1: 'Từ vựng',
  2: 'Ngữ pháp',
  3: 'Nghe hiểu',
  4: 'Đọc hiểu',
  5: 'Viết',
  6: 'Tổng hợp',
  7: 'Trắc nghiệm',
  8: 'Khác'
};
const CATEGORY_LABELS = {
  0: 'Đề kiểm tra đánh giá',
  2: 'Đề thi giữa kì',
  3: 'Đề thi cuối kì',
};
const CATEGORY_ENUM_MAP = {
  0: 'Quiz',
  2: 'Midterm',
  3: 'Final',
};

const PendingAssessmentCardList = ({ classId, assessments: initialAssessments, subjectId }) => {
  const [assessments, setAssessments] = useState(initialAssessments || []);

  const total = assessments ? assessments.length : 0;
  const attached = assessments ? assessments.filter(a => a.testID).length : 0;
  const notAttached = total - attached;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTestEvent, setModalTestEvent] = useState(null); // testEvent object của card đang thao tác
  const [selectedTestID, setSelectedTestID] = useState(null);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [attemptLimit, setAttemptLimit] = useState();
  const [password, setPassword] = useState('');
  const [form] = Form.useForm();
  const [modalAvailableTests, setModalAvailableTests] = useState([]);

  const durationMinutes = modalTestEvent ? modalTestEvent.durationMinutes : 0;
  let endAt = null;
  if (startDate && startTime && durationMinutes) {
    const start = dayjs(startDate).hour(dayjs(startTime).hour()).minute(dayjs(startTime).minute());
    endAt = start.add(durationMinutes, 'minute');
  }

  // Sửa hàm mở modal để gọi API động lấy danh sách bài test
  const handleOpenModal = async (assessment) => {
    setModalTestEvent(assessment);
    setModalOpen(true);
    setSelectedTestID(null);
    setDescription('');
    setAttemptLimit();
    setPassword('');
    // Nếu có lessonStartTime thì set luôn giá trị cho form
    if (assessment && assessment.lessonStartTime) {
      const lessonStart = dayjs(assessment.lessonStartTime);
      setStartDate(lessonStart);
      setStartTime(lessonStart);
      form.setFieldsValue({
        startDate: lessonStart,
        startTime: lessonStart
      });
    } else {
      setStartDate(null);
      setStartTime(null);
      form.resetFields(["startDate", "startTime"]);
    }
    form.resetFields(["testID", "description", "attemptLimit", "password"]);
    // Gọi API động lấy danh sách bài test phù hợp
    if (assessment) {
      try {
        const res = await axios.get(`${API_URL}api/Test/advanced-search`, {
          params: {
            category: assessment.assessmentCategory,
            subjectId: subjectId, // lấy từ props
            testType: assessment.testType,
            status: 3,
          }
        });
        setModalAvailableTests(Array.isArray(res.data) ? res.data : (res.data?.data || []));
      } catch {
        setModalAvailableTests([]);
      }
    } else {
      setModalAvailableTests([]);
    }
  };

  // Hàm reload lại assessments sau khi thêm đề kiểm tra
  const reloadAssessments = async () => {
    try {
      const res = await axios.get(`${API_URL}api/TestEvent/get-by-class-id/${classId}`);
      setAssessments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setAssessments([]);
    }
  };

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
      {(!assessments || total === 0) ? (
        <div style={{ textAlign: 'center' }}>Không có buổi kiểm tra nào.</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {assessments.map((assessment, idx) => {
            const testName = assessment.description || 'Chưa có đề kiểm tra';
            const hasQuestions = !!assessment.testID;
            let date = '';
            if (assessment.startAt) date = dayjs(assessment.startAt).format('DD/MM/YYYY');
            else if (assessment.endAt) date = dayjs(assessment.endAt).format('DD/MM/YYYY');
            let time = '';
            if (assessment.startAt && assessment.endAt) {
              time = `${dayjs(assessment.startAt).format('HH:mm')} - ${dayjs(assessment.endAt).format('HH:mm')}`;
            }
            let categoryLabel = '';
            if (assessment.assessmentCategory !== undefined && assessment.assessmentCategory !== null) {
              categoryLabel = CATEGORY_LABELS[assessment.assessmentCategory] || 'Không xác định';
            }
            let testTypeLabel = '';
            if (assessment.testType !== undefined && assessment.testType !== null) {
              testTypeLabel = TEST_TYPE_LABELS[assessment.testType] || 'Không xác định';
            }
            return (
              <Card
                key={assessment.testID || idx}
                style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 8 }}
                bodyStyle={{ padding: 16, background: '#fafbfc' }}
              >
                {!hasQuestions && (
                  <>
                    <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 8 }}>
                      Chưa có đề kiểm tra
                    </div>
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginBottom: 8 }}
                      onClick={() => handleOpenModal(assessment)}
                    >
                      Thêm đề kiểm tra
                    </Button>
                  </>
                )}
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {testName}
                </div>
                <div style={{ color: '#555', marginBottom: 8 }}>
                  <span role="img" aria-label="clock">🕒</span>
                  {' '}
                  {time}
                </div>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                  Ngày: <span>{date}</span>
                </div>
                <div style={{ fontSize: 13, color: '#333', marginBottom: 4 }}>
                  Loại: <b>{categoryLabel}</b>
                </div>
                <div style={{ fontSize: 13, color: '#333' }}>
                  Kĩ năng: <b>{testTypeLabel}</b>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      <Modal
        open={modalOpen}
        title="Thêm đề kiểm tra"
        onCancel={() => setModalOpen(false)}
        onOk={async () => {
          try {
            const values = await form.validateFields();
            // Lấy lessonStartTime từ assessment
            const lessonStart = modalTestEvent?.lessonStartTime ? dayjs(modalTestEvent.lessonStartTime) : null;
            let startAt = lessonStart;
            // Nếu lessonStartTime có, lấy ngày và giờ từ đó, nếu không thì fallback về form
            if (!startAt) {
              // fallback: lấy từ form
              startAt = dayjs(values.startDate).hour(dayjs(values.startTime).hour()).minute(dayjs(values.startTime).minute());
            }
            // endAt = startAt + durationMinutes
            const endAt = startAt && modalTestEvent?.durationMinutes ? startAt.add(modalTestEvent.durationMinutes, 'minute') : null;
            const body = {
              testEventIdToUpdate: modalTestEvent?.testEventID,
              testID: values.testID,
              description: values.description,
              startAt: startAt ? startAt.toISOString() : null,
              endAt: endAt ? endAt.toISOString() : null,
              attemptLimit: values.attemptLimit,
              password: values.password,
            };
            await axios.put(`${API_URL}api/TestEvent/configure`, body);
            // Gọi API update status testEvent thành Actived (1)
            if (modalTestEvent?.testEventID) {
              await axios.put(`${API_URL}api/TestEvent/update-status`, {
                testEventIDToUpdate: modalTestEvent.testEventID,
                status: 1
              });
            }
            setModalOpen(false);
            await reloadAssessments();
            // TODO: Có thể thêm thông báo thành công nếu muốn
          } catch (err) {
            // handle error nếu cần
          }
        }}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Chọn bài test"
            name="testID"
            rules={[{ required: true, message: 'Vui lòng chọn bài test' }]}
          >
            <Select
              placeholder="Chọn bài test"
              onChange={tid => setSelectedTestID(tid)}
            >
              {modalAvailableTests.map(test => (
                <Select.Option key={test.testID} value={test.testID}>{test.testName}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} onChange={e => setDescription(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thời gian bắt đầu"
            required
            style={{ marginBottom: 0 }}
          >
            <Form.Item
              name="startDate"
              rules={[{ required: true, message: 'Chọn ngày' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker
                style={{ width: '100%' }}
                onChange={date => setStartDate(date)}
                format="DD/MM/YYYY"
              />
            </Form.Item>
            <Form.Item
              name="startTime"
              rules={[{ required: true, message: 'Chọn giờ' }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
            >
              <TimePicker
                style={{ width: '100%' }}
                onChange={time => setStartTime(time)}
                format="HH:mm"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item label="Số lần học sinh làm bài" name="attemptLimit" rules={[{ required: true, message: 'Nhập số lượng học sinh' }]}> 
            <Input type="number" min={1} onChange={e => setAttemptLimit(e.target.value)} />
          </Form.Item>
          <Form.Item label="Password cho bài test" name="password" rules={[{ required: true, message: 'Nhập password' }]}> 
            <Input onChange={e => setPassword(e.target.value)} />
          </Form.Item>
          {endAt && (
            <Form.Item label="Thời gian kết thúc">
              <Input value={endAt.format('DD/MM/YYYY HH:mm')} disabled />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default PendingAssessmentCardList; 