import React, { useState, useEffect } from 'react';
import { Steps, Button, Form, message, Typography } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { subjectService } from '../../../../services/subjectService';

// Import step components
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

  useEffect(() => {
    if (isEditing && subjectId) {
      const fetchSubjectData = async () => {
        try {
          const data = await subjectService.getSubjectById(subjectId);
          // Set basicInfo in subjectData state for CreateSubject
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
          // Also set form fields for the main form in CreateSubject
          form.setFieldsValue({
            name: data.subjectName,
            description: data.description,
            minAverageScoreToPass: data.minAverageScoreToPass,
          });
        } catch (error) {
          console.error('Error fetching subject data for CreateSubject:', error);
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
    setSubjectData(prev => ({
      ...prev,
      basicInfo: values
    }));
    setCurrent(current + 1);
  };

  const steps = [
    {
      title: 'Thông tin môn học',
      content: <BasicInfoStep onNext={handleBasicInfoNext} form={form} subjectId={subjectId} isEditing={isEditing} />
    },
    {
      title: 'Cấu hình môn học',
      content: <ConfigurationStep onGenerateClassSlots={generateClassSlots} />
    },
    {
      title: 'Thông tin buổi học',
      content: (
        <ClassInfoStep
          classSlots={classSlots}
          editingSlot={editingSlot}
          setEditingSlot={setEditingSlot}
          handleEditSlot={handleEditSlot}
          handleUpdateSlot={handleUpdateSlot}
        />
      )
    },
    {
      title: 'Thông tin đánh giá',
      content: <AssessmentStep form={form} configuration={subjectData.configuration} />
    },
    {
      title: 'Chọn slot kiểm tra',
      content: <TestSlotsStep classSlots={classSlots} form={form} />
    },
    {
      title: 'Xác nhận thông tin',
      content: <ConfirmationStep form={form} />
    }
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
        // Add other data from subjectData and classSlots here as needed by your backend APIs
        // For example, if your create/update subject API needs all details at once
      };

      let finalSubjectId = subjectId;

      if (isEditing && subjectId) {
        const updateBasicInfoPayload = {
          subjectID: subjectId,
          subjectName: combinedSubjectData.subjectName,
          description: combinedSubjectData.description,
          minAverageScoreToPass: combinedSubjectData.minAverageScoreToPass,
          isActive: subjectData.basicInfo?.isActive || true,
          createAt: subjectData.basicInfo?.createAt || new Date().toISOString()
        };
        await subjectService.updateSubject(updateBasicInfoPayload);
        message.success('Cập nhật thông tin môn học thành công.');
        // TODO: Call other update APIs for syllabus, assessment, schedules, etc.

      } else {
        const createBasicInfoPayload = {
          subjectName: combinedSubjectData.subjectName,
          description: combinedSubjectData.description,
          minAverageScoreToPass: combinedSubjectData.minAverageScoreToPass,
        };
        const createResponse = await subjectService.createSubject(createBasicInfoPayload);
        finalSubjectId = createResponse.subjectID;
        message.success('Tạo môn học thành công.');
        // TODO: Call other create APIs for syllabus, assessment, schedules, etc. using finalSubjectId
      }

      // Placeholder for further API calls (e.g., Syllabus, Assessment, Schedule)
      // These will depend on your backend structure

      message.success('Hoàn thành quá trình lưu môn học!');
      navigate('/dashboard/subject');
    } catch (error) {
      console.error('Error in final submission:', error);
      message.error('Có lỗi xảy ra trong quá trình lưu môn học. Vui lòng thử lại.');
      if (error.errorFields) {
        error.errorFields.forEach(field => {
          message.error(field.errors[0]);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dashboard/subject')}
          style={{ marginBottom: '16px' }}
        >
          Quay lại
        </Button>
        <Title level={2}>{isEditing ? 'Chỉnh sửa môn học' : 'Tạo môn học mới'}</Title>
      </div>

      <Steps current={current} style={{ marginBottom: 24 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={subjectData}
      >
        <div className="steps-content">{steps[current].content}</div>
        <div className="steps-action" style={{ marginTop: 24 }}>
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={prev}>
              <ArrowLeftOutlined /> Quay lại
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Tiếp theo <ArrowRightOutlined />
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Hoàn thành
            </Button>
          )}
          <Button style={{ margin: '0 8px' }} onClick={() => navigate('/dashboard/subject')}>
            Hủy
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateSubject; 