import React, { useState, useRef, useEffect  } from 'react';
import { Steps, Button, message } from 'antd';
import BasicInfoForm from './BasicInfoForm';
import ClassConfigForm from './ClassConfigForm';
import LessonCreator from './LessonCreator';
import TeachingScheduleModal from './TeachingScheduleModal';
import ConfirmCreateClass from './ConfirmCreateClass';
import { API_URL } from '../../../config/api';
import axios from 'axios';

const CreateClassStepper = ({
  lectures,
  subjects,
  formData,
  setFormData,
  onFinish,
}) => {
  const [current, setCurrent] = useState(0);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const basicInfoFormRef = useRef(); 
  const classConfigFormRef = useRef();
  const lessonCreatorRef = useRef();
  const [maxDaysPerWeek, setMaxDaysPerWeek] = useState(3); // mặc định 3
  const [teachingSchedulesDetail, setTeachingSchedulesDetail] = useState([]);
  const [teachingWeekly, setTeachingWeekly] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTeachingScheduleDetail = async (accountID) => {
    try {
      const response = await axios.get(`${API_URL}api/Account/teaching-schedule-detail/${accountID}`);
      if (response.data.success) {
        setTeachingSchedulesDetail(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teaching schedule detail:', error);
      message.error('Không thể lấy lịch dạy của giảng viên');
    }
  };

  const fetchTeachingWeekly = async () => {
    try {
      const response = await axios.get(`${API_URL}api/Account/teaching-schedule`);
      if (response.data.success) {
        setTeachingWeekly(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching teaching weekly schedule:', error);
      message.error('Không thể lấy lịch dạy hàng tuần của giảng viên');
    }
  };

  useEffect(() => {
    fetchTeachingWeekly();
  }, []);

  const handleBasicInfoChange = (values) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: values
    }));
    if (values.accountID) {
      fetchTeachingScheduleDetail(values.accountID);
    }
  };

  useEffect(() => {
    const fetchMaxDays = async () => {
      if (formData.basicInfo?.subjectID) {
        try {
          const res = await axios.get(`${API_URL}api/SyllabusSchedule/max-slot/${formData.basicInfo.subjectID}`);
          if (res.data) {
            setMaxDaysPerWeek(res.data.data);
          }
          console.log(res.data.data);
        } catch (error) {
          console.error('Lỗi lấy maxDaysPerWeek:', error);
          setMaxDaysPerWeek(2); 
        }
      }
    };
  
    fetchMaxDays();
  }, [formData.basicInfo?.subjectID]);

  const steps = [
    {
      title: 'Nhập thông tin cơ bản',
      content: (
        <BasicInfoForm
          ref={basicInfoFormRef}
          lectures={lectures}
          subjects={subjects}
          formData={formData.basicInfo}
          onChange={handleBasicInfoChange}
        />
      ),
    },
    {
      title: 'Cấu hình lớp',
      content: (
        <ClassConfigForm
          ref={classConfigFormRef}
          formData={formData.classConfig}
          teachingSchedulesDetail={teachingSchedulesDetail}
          onChange={(values) =>
            setFormData((prev) => ({ ...prev, classConfig: values }))
          }
        />
      ),
    },
    {
      title: 'Xếp lịch học',
      content: (
        <LessonCreator
          ref={lessonCreatorRef}
          formData={{
            ...formData.lessons,
            officialStartDate: formData.classConfig?.officialStartDate,
            accountID: formData.basicInfo?.accountID
          }}
          teachingSchedulesDetail={teachingSchedulesDetail}
          teachingWeekly={teachingWeekly}
          onChange={(data) => setFormData(prev => ({ ...prev, lessons: data }))}
          maxDaysPerWeek={maxDaysPerWeek}
        />
      )
    },
    {
      title: 'Xác nhận thông tin',
      content: <ConfirmCreateClass formData={formData} />
    }
  ];

  const next = async () => {
    if (current === 0) {
      try {
        await basicInfoFormRef.current?.validate();
        setCurrent(1);
      } catch (_) {}
    } else if (current === 1) {
      try {
        await classConfigFormRef.current?.validate();
        setCurrent(2);
      } catch (_) {}
    } else if (current === 2) {
      try {
        await lessonCreatorRef.current?.validate();
        setCurrent(3);
      } catch (_) {}
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => setCurrent(current - 1);

  return (
    <>
      <Steps current={current}>
        {steps.map(item => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div style={{ margin: '24px 0' }}>{steps[current].content}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        {current === 0 && (
          <Button onClick={() => setOpenScheduleModal(true)}>
            Xem lịch dạy giảng viên
          </Button>
        )}
    
        {current > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Quay lại
          </Button>
        )}
            {current === 2 && (
          <Button onClick={() => setOpenScheduleModal(true)}>
            Xem lịch dạy giảng viên
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button
            type="primary"
            onClick={next}
          >
            Tiếp theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => {
              message.success('Hoàn thành!');
              onFinish?.();
            }}
          >
            Hoàn thành
          </Button>
        )}
      </div>
      <TeachingScheduleModal open={openScheduleModal} onClose={() => setOpenScheduleModal(false)} />
    </>
  );
};

export default CreateClassStepper;
