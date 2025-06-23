import React from 'react';
import BasicInfoSection from './BasicInfoSection';
import StudentListSection from './StudentListSection';
import MonthlyTimetableSection from './MonthlyTimetableSection';
import { useLocation } from 'react-router-dom';

const ClassDetail = (props) => {
  const location = useLocation();
  const classId = props.classId || location.state?.classId;
  console.log('ClassDetail classId:', classId);
  return (
    <div style={{ padding: 24 }}>
      <h1>Chi tiết lớp học</h1>
      <div style={{ marginBottom: 24 }}>
        <BasicInfoSection classId={classId} />
      </div>
      <div style={{ marginBottom: 24 }}>
        <StudentListSection classId={classId} />
      </div>
      <div>
        <MonthlyTimetableSection classId={classId} />
      </div>
    </div>
  );
};

export default ClassDetail;
