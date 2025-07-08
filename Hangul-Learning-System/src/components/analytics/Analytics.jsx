import React, { useState } from 'react';
import { Row, Col } from 'antd';
import PaymentTable from './PaymentTable';
import IncomeBySubjectPieChart from '../charts/IncomeBySubjectPieChart';
import RevenueByMonthLineChart from '../charts/RevenueByMonthLineChart';
import AnalyticsSection from './AnalyticsSection';
import ClassCompletionStatsTable from './ClassCompletionStatsTable';
import ClassCompletionRateByMonthChart from '../charts/ClassCompletionRateByMonthChart';
import AttendanceRateByClassBarChart from '../charts/AttendanceRateByClassBarChart';
import TopAverageScoreClassesChart from '../charts/TopAverageScoreClassesChart';
const Analytics = () => {
  const [expanded, setExpanded] = useState({
    income: true,
    class: false,
    student: false,
    lecturer: false,
  });

  const handleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Phân tích và đánh giá</h1>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={24}>
          <AnalyticsSection
            title="Phân tích thu nhập"
            expanded={expanded.income}
            onToggle={() => handleExpand('income')}
          >
            <PaymentTable />
            <div style={{ margin: '32px 0 0 0' }}>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                  <IncomeBySubjectPieChart />
                </Col>
                <Col xs={24} md={12}>
                  <RevenueByMonthLineChart />
                </Col>
              </Row>
            </div>
          </AnalyticsSection>
        </Col>
        <Col xs={24} md={24}>
          <AnalyticsSection
            title="Hiệu quả lớp học"
            expanded={expanded.class}
            onToggle={() => handleExpand('class')}
          >
            <ClassCompletionStatsTable/>
            <div style={{ margin: '32px 0 0 0' }}>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                  <ClassCompletionRateByMonthChart />
                </Col>
                <Col xs={24} md={12}>
                  <AttendanceRateByClassBarChart />
                </Col>
              </Row>
            </div>
            <div style={{ margin: '32px 0 0 0' }}>
              <TopAverageScoreClassesChart/>
            </div>
          </AnalyticsSection>
        </Col>
        <Col xs={24} md={24}>
          <AnalyticsSection
            title="Đánh giá học viên"
            expanded={expanded.student}
            onToggle={() => handleExpand('student')}
          >
            <div style={{ color: '#bbb', fontStyle: 'italic' }}>
              (Nội dung sẽ được bổ sung sau)
            </div>
          </AnalyticsSection>
        </Col>
        <Col xs={24} md={24}>
          <AnalyticsSection
            title="Thống kê giảng viên"
            expanded={expanded.lecturer}
            onToggle={() => handleExpand('lecturer')}
          >
            <div style={{ color: '#bbb', fontStyle: 'italic' }}>
              (Nội dung sẽ được bổ sung sau)
            </div>
          </AnalyticsSection>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics; 