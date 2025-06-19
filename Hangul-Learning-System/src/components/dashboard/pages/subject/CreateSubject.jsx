import React, { useState, useEffect } from 'react';
import { Steps, Button, Form, Typography, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { subjectService } from '../../../../services/subjectService';
import Notification from '../../../common/Notification';

import BasicInfoStep from './steps/BasicInfoStep';
import ConfigurationStep from './steps/ConfigurationStep';
import ClassInfoStep from './steps/ClassInfoStep';
import AssessmentStep from './steps/AssessmentStep';
import TestSlotsStep from './steps/TestSlotsStep';
import ConfirmationStep from './steps/ConfirmationStep';

const { Step } = Steps;
const { Title } = Typography;

const CreateSubject = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const isEditing = !!subjectId;
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    visible: false,
    type: 'success',
    message: '',
    description: ''
  });
  const [subjectData, setSubjectData] = useState({
    basicInfo: null,
    configuration: null,
    scheduleInfo: null,
    assessmentInfo: null,
    testSlots: null
  });
  const [classSlots, setClassSlots] = useState([]);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editForm] = Form.useForm();

  const handleCloseNotification = () => {
    setNotificationConfig(prev => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (isEditing && subjectId) {
      const fetchSubjectData = async () => {
        try {
          const data = await subjectService.getSubjectById(subjectId);
          setSubjectData(prev => ({
            ...prev,
            basicInfo: {
              subjectID: data.subjectID,
              subjectName: data.subjectName,
              description: data.description,
              minAverageScoreToPass: data.minAverageScoreToPass,
              isActive: data.isActive,
              createAt: data.createAt,
            }
          }));
          form.setFieldsValue({
            name: data.subjectName,
            description: data.description,
            minAverageScoreToPass: data.minAverageScoreToPass,
          });
        } catch (error) {
          console.error('Error fetching subject data:', error);
          message.error('Không thể tải thông tin môn học để chỉnh sửa.');
        }
      };
      fetchSubjectData();
    }
  }, [isEditing, subjectId, form]);

  const generateClassSlots = (totalWeeks, slotsPerWeek) => {
    const slots = [];
    let slotNumber = 1;
    for (let week = 1; week <= totalWeeks; week++) {
      for (let slot = 1; slot <= slotsPerWeek; slot++) {
        slots.push({
          week,
          slot: slotNumber,
          title: `Tiết ${slotNumber}`,
          content: '',
          durationMinutes: 0,
          resources: '',
          hasTest: false
        });
        slotNumber++;
      }
    }
    setClassSlots(slots);
  };

  const handleEditSlot = (record) => {
    setEditingSlot(record);
    editForm.setFieldsValue(record);
  };

  const handleUpdateSlot = () => {
    editForm.validateFields().then(values => {
      setClassSlots(prev => prev.map(slot => 
        slot.slot === editingSlot.slot ? { ...slot, ...values } : slot
      ));
      setEditingSlot(null);
      message.success('Cập nhật tiết học thành công');
    });
  };

  const handleBasicInfoNext = (values) => {
    setSubjectData(prev => ({ ...prev, basicInfo: values }));
    setCurrent(current + 1);
  };

  const steps = [
    { title: 'Thông tin môn học', content: <BasicInfoStep onNext={handleBasicInfoNext} form={form} subjectId={subjectId} isEditing={isEditing} /> },
    { title: 'Cấu hình môn học', content: <ConfigurationStep onGenerateClassSlots={generateClassSlots} /> },
    { title: 'Thông tin buổi học', content: <ClassInfoStep classSlots={classSlots} editingSlot={editingSlot} setEditingSlot={setEditingSlot} handleEditSlot={handleEditSlot} handleUpdateSlot={handleUpdateSlot} /> },
    { title: 'Thông tin đánh giá', content: <AssessmentStep form={form} configuration={subjectData.configuration} /> },
    { title: 'Chọn slot kiểm tra', content: <TestSlotsStep classSlots={classSlots} form={form} /> },
    { title: 'Xác nhận thông tin', content: <ConfirmationStep form={form} /> }
  ];

  const next = async () => {
    try {
      const values = await form.validateFields();

      if (current === 0) {
        handleBasicInfoNext(values);
        return;
      }

      if (current === 1) {
        setSubjectData(prev => ({
          ...prev,
          configuration: {
            totalWeeks: values.totalWeeks,
            slotsPerWeek: values.slotsPerWeek,
            totalTests: values.totalTests
          }
        }));
        if (!values.totalWeeks || !values.slotsPerWeek) {
          message.error('Vui lòng nhập đầy đủ thông tin cấu hình');
          return;
        }
        generateClassSlots(values.totalWeeks, values.slotsPerWeek);
      }

      if (current === 3) {
        setSubjectData(prev => ({
          ...prev,
          assessmentInfo: values.criteria
        }));
        const criteria = values.criteria || [];
        const totalWeight = criteria.reduce((sum, item) => sum + (item.weightPercent || 0), 0);
        if (totalWeight !== 100) {
          message.error('Tổng trọng số phải bằng 100%');
          return;
        }
      }

      setCurrent(current + 1);
    } catch (error) {
      console.error('Validation failed:', error);
      if (error.errorFields) {
        error.errorFields.forEach(field => {
          message.error(field.errors[0]);
        });
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const combinedSubjectData = {
        subjectName: subjectData.basicInfo?.name,
        description: subjectData.basicInfo?.description,
        minAverageScoreToPass: subjectData.basicInfo?.minAverageScoreToPass,
      };

      let finalSubjectId = subjectId;

      if (isEditing && subjectId) {
        const updatePayload = {
          subjectID: subjectId,
          ...combinedSubjectData,
          isActive: subjectData.basicInfo?.isActive || true,
          createAt: subjectData.basicInfo?.createAt || new Date().toISOString()
        };
        await subjectService.updateSubject(updatePayload);
        setNotificationConfig({ visible: true, type: 'success', message: 'Thành công!', description: 'Cập nhật thông tin môn học thành công.' });
      } else {
        const createResponse = await subjectService.createSubject(combinedSubjectData);
        finalSubjectId = createResponse.subjectID;
        setNotificationConfig({ visible: true, type: 'success', message: 'Thành công!', description: 'Tạo môn học mới thành công.' });
      }

      setTimeout(() => {
        navigate('/dashboard/subject');
      }, 2000);
    } catch (error) {
      console.error('Error in final submission:', error);
      setNotificationConfig({ visible: true, type: 'error', message: 'Lỗi!', description: 'Có lỗi xảy ra trong quá trình lưu môn học. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Notification {...notificationConfig} onClose={handleCloseNotification} />
      <Title level={3}>{isEditing ? 'Chỉnh sửa môn học' : 'Tạo môn học mới'}</Title>
      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} />
        ))}
      </Steps>
      <Form form={form} layout="vertical">
        {steps[current].content}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          <Button icon={<ArrowLeftOutlined />} onClick={prev} disabled={current === 0}>Quay lại</Button>
          {current < steps.length - 1 && (
            <Button type="primary" icon={<ArrowRightOutlined />} onClick={next}>Tiếp theo</Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" loading={loading} onClick={handleSubmit}>Lưu môn học</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default CreateSubject;
