import React, { useState, useRef, useEffect  } from 'react';
import { Form, TimePicker, Checkbox, DatePicker, Card, Typography, Input, Select } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const { Text } = Typography;

const weekDays = [
  { label: 'Thứ 2', value: 1 },
  { label: 'Thứ 3', value: 2 },
  { label: 'Thứ 4', value: 3 },
  { label: 'Thứ 5', value: 4 },
  { label: 'Thứ 6', value: 5 },
  { label: 'Thứ 7', value: 6 },
  { label: 'Chủ nhật', value: 0 },
];

const LessonCreator = React.forwardRef(({ formData = {}, onChange, maxDaysPerWeek = 3, teachingSchedulesDetail, teachingWeekly, lectures = [], onLecturerChange }, ref) => {
  const [form] = Form.useForm();
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const initialLessonTime = formData.teachingStartTime
    ? dayjs(formData.teachingStartTime).format('HH:mm')
    : null;

  useEffect(() => {
    if (initialLessonTime) {
      form.setFieldsValue({
        lessonTime: dayjs(initialLessonTime, 'HH:mm'),
      });
    }
  }, [initialLessonTime]);

  useEffect(() => {
    if (formData.accountID && lectures.length > 0) {
      const lecturer = lectures.find(lec => lec.accountID === formData.accountID);
      if (lecturer) {
        const fullName = `${lecturer.lastName} ${lecturer.firstName}`;
        setSelectedLecturer(lecturer);
        form.setFieldsValue({ lecturerName: fullName });
        handleValuesChange(null, { 
          ...form.getFieldsValue(), 
          lecturerName: fullName 
        });
      }
    }
  }, [formData.accountID, lectures]);

  const handleValuesChange = (_, allValues) => {
    if (allValues.weekDays?.length > maxDaysPerWeek) {
      allValues.weekDays = allValues.weekDays.slice(0, maxDaysPerWeek);
    }
    
    if (allValues.accountID && allValues.accountID !== formData.accountID) {
      const lecturer = lectures.find(lec => lec.accountID === allValues.accountID);
      if (lecturer) {
        setSelectedLecturer(lecturer);
      }
    }
    
    if (allValues.accountID && allValues.accountID !== formData.accountID && onLecturerChange) {
      onLecturerChange(allValues.accountID);
    }
    
    onChange && onChange(allValues);
  };

  const isTimeSlotValid = (dayOfWeek, lessonTime) => {
    if (!teachingWeekly?.length) {
      console.warn('teachingWeekly null - không có gì để kiểm tra');
      return true;
    }
  
    const accountID = form.getFieldValue('accountID');
    if (!accountID) {
      console.warn('Thiếu accountID - không xác định được giảng viên');
      return false;
    }
  
    if (!lessonTime) {
      console.warn('lessonTime chưa có - không kiểm tra được');
      return false;
    }
  
    const selectedTime = dayjs(lessonTime, 'HH:mm:ss');
  
    return !teachingWeekly.some(schedule => {
      const sameDay = parseInt(schedule.teachingDay, 10) === parseInt(dayOfWeek, 10);
      if (!sameDay || schedule.lecturerID !== accountID) return false;
  
      const start = dayjs(schedule.startTime, 'HH:mm:ss');
      const end = dayjs(schedule.endTime, 'HH:mm:ss');
  
      return selectedTime.isSame(start) || (selectedTime.isAfter(start) && selectedTime.isBefore(end));
    });
  };
  const getScheduleConflicts = (dayOfWeek, lessonTime) => {
    const conflicts = [];
  
    if (!teachingWeekly?.length || !formData.accountID || !lessonTime) return conflicts;
  
    const selectedTime = dayjs(lessonTime, 'HH:mm:ss');
  
    teachingWeekly.forEach(schedule => {
      const sameDay = parseInt(schedule.teachingDay, 10) === parseInt(dayOfWeek, 10);
      if (!sameDay || schedule.lecturerID !== formData.accountID) return;
  
      const start = dayjs(schedule.startTime, 'HH:mm:ss');
      const end = dayjs(schedule.endTime, 'HH:mm:ss');
  
      const conflict = selectedTime.isSame(start) || (selectedTime.isAfter(start) && selectedTime.isBefore(end));
  
      if (conflict) {
        conflicts.push({
          day: schedule.teachingDay,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        });
      }
    });
  
    return conflicts;
  };
  
  
  
  
   

  const isDateValid = (date) => {
    if (!date || !teachingSchedulesDetail?.length) return true;
    
    const selectedDate = dayjs(date);
    const selectedTime = selectedDate.format('HH:mm:ss');
    return !teachingSchedulesDetail.some(schedule => {
      const scheduleDate = dayjs(schedule.teachingDay);
      return (
        selectedDate.isSame(scheduleDate, 'day') && 
        selectedTime >= schedule.startTime && 
        selectedTime <= schedule.endTime
      );
    });
  };

  React.useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...formData,
        teachingStartTime: formData.teachingStartTime ? dayjs(formData.teachingStartTime) : null,
        lessonTime: initialLessonTime ? dayjs(initialLessonTime, 'HH:mm') : null,
      }}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="Giảng viên"
        name="accountID"
        rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
      >
        <Select
          placeholder="Chọn giảng viên"
          onChange={(value) => {
            const lecturer = lectures.find(lec => lec.accountID === value);
            if (lecturer) {
              const fullName = `${lecturer.lastName} ${lecturer.firstName}`;
              setSelectedLecturer(lecturer);
              form.setFieldsValue({ accountID: value, lecturerName: fullName });
              handleValuesChange(null, {
                ...form.getFieldsValue(),
                accountID: value,
                lecturerName: fullName
              });
            }
          }}
        >
          {lectures.map(lec => (
            <Select.Option key={lec.accountID} value={lec.accountID}>
              {lec.lastName + ' ' + lec.firstName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {selectedLecturer && (
        <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6f8fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong>Giảng viên:</Text>
            <Text>{selectedLecturer.lastName} {selectedLecturer.firstName}</Text>
            {selectedLecturer.email && (
              <>
                <Text type="secondary">|</Text>
                <Text type="secondary">{selectedLecturer.email}</Text>
              </>
            )}
          </div>
        </Card>
      )}

      <Form.Item
        name="lecturerName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Dự kiến ngày học chính thức"
        name="teachingStartTime"
        rules={[
          { required: true, message: 'Vui lòng chọn ngày học chính thức!' },
          { 
            validator: (_, value) => {
              if (!isDateValid(value)) {
                return Promise.reject('Ngày và giờ này trùng với lịch dạy của giảng viên!');
              }
              return Promise.resolve();
            }
          }
        ]}
        extra="Ngày này sẽ áp dụng cho tiết học đầu tiên"
      >
        <DatePicker 
          showTime
          style={{ width: '100%' }} 
          placeholder="Chọn ngày học chính thức"
          format="DD/MM/YYYY HH:mm"
          disabledDate={(current) => {
            return current && current < dayjs().startOf('day');
          }}
        />
      </Form.Item>

      <Form.Item
        label="Giờ học"
        name="lessonTime"
        rules={[
          {
            validator: (_, value) => {
              if (!value) {
                return Promise.reject('Vui lòng chọn giờ học!');
              }
              return Promise.resolve();
            },
          },
        ]}
        extra="Giữ nguyên giờ học theo giờ khai giảng để đảm bảo lịch học ổn định, trừ khi tiết đầu là buổi giới thiệu."
      >
        <TimePicker format="HH:mm" style={{ width: '100%' }} minuteStep={5} />
      </Form.Item>

      <Form.Item
        label={`Chọn các thứ trong tuần sẽ học (chọn chính xác ${maxDaysPerWeek} ngày)`}
        name="weekDays"
        dependencies={['lessonTime']}
        rules={[
          {
            validator: (_, value) => {
              const lessonTime = form.getFieldValue('lessonTime');

              if (!value || value.length === 0) {
                return Promise.reject(`Vui lòng chọn chính xác ${maxDaysPerWeek} ngày!`);
              }

              if (!lessonTime) {
                return Promise.reject('Vui lòng chọn giờ học trước!');
              }

              const formattedTime = dayjs(lessonTime).format('HH:mm:ss');
              const intDays = value.map(v => parseInt(v, 10));
              const conflictDays = [];

              for (const day of intDays) {
                if (!isTimeSlotValid(day, formattedTime)) {
                  const label = weekDays.find(w => w.value === day)?.label;
                  conflictDays.push(label);
                }
              }

              if (conflictDays.length > 0) {
                return Promise.reject(`Giảng viên đã có lịch dạy vào: ${conflictDays.join(', ')}`);
              }

              if (intDays.length !== maxDaysPerWeek) {
                return Promise.reject(`Vui lòng chọn chính xác ${maxDaysPerWeek} ngày!`);
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Checkbox.Group
          options={weekDays}
          onChange={(checkedValues) => {
            const intValues = checkedValues.map(v => parseInt(v, 10));
            const limited = intValues.slice(0, maxDaysPerWeek);
            form.setFieldsValue({ weekDays: limited });
          }}
        />
      </Form.Item>


    </Form>
  );
});

export default LessonCreator;
