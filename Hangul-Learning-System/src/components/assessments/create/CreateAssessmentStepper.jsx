import React, { useState, useRef } from 'react';
import { Steps, Button, message } from 'antd';
import AssessmentBasicForm from './AssessmentBasicForm';
import CreateAssessmentSection from './CreateAssessmentSection';
// import SectionQuestionsForm from './SectionQuestionsForm';
// import ConfirmCreateAssessment from './ConfirmCreateAssessment';

// TODO: tạo SectionQuestionsForm đúng logic mới
const SectionQuestionsForm = () => <div>SectionQuestionsForm (TODO)</div>;

const CreateAssessmentStepper = ({ formData, setFormData, onFinish, showNotify, subjects, categoryOptions, onSubjectChange }) => {
  const [current, setCurrent] = useState(0);
  const basicInfoFormRef = useRef();

  const steps = [
    {
      title: 'Thông tin cơ bản',
      content: (
        <AssessmentBasicForm
          ref={basicInfoFormRef}
          subjects={subjects}
          formData={formData.basicInfo}
          onChange={values => setFormData(prev => ({ ...prev, basicInfo: values }))}
          categoryOptions={categoryOptions}
          onSubjectChange={onSubjectChange}
        />
      ),
    },
    {
      title: 'Tạo section & nhập câu hỏi',
      content: (
        <CreateAssessmentSection
          testType={formData.basicInfo?.testType}
          sections={formData.sections}
          onChange={sections => setFormData(prev => ({ ...prev, sections }))}
        />
      ),
    },
    {
      title: 'Xác nhận',
      content: (
        <div>ConfirmCreateAssessment (TODO)</div>
        // <ConfirmCreateAssessment ... />
      ),
    },
  ];

  const next = async () => {
    if (current === 0) {
      try {
        await basicInfoFormRef.current?.validate();
        setCurrent(1);
      } catch (_) {
        message.error('Vui lòng nhập đầy đủ thông tin cơ bản!');
      }
    } else if (current === 1) {
      // Kiểm tra tổng điểm các section phải = 10
      const totalScore = (formData.sections || []).reduce((sum, sec) => sum + (Number(sec?.score) || 0), 0);
      if (totalScore !== 10) {
        message.error('Tổng điểm các section phải đúng bằng 10!');
        return;
      }
      setCurrent(2);
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => setCurrent(current - 1);

  return (
    <>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map(item => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ margin: '24px 0' }}>{steps[current].content}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
        {current > 0 && (
          <Button onClick={prev}>
            Quay lại
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            {current === 0 ? 'Tiếp tục' : 'Tiếp theo'}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={onFinish}>
            Hoàn thành
          </Button>
        )}
      </div>
    </>
  );
};

export default CreateAssessmentStepper;
