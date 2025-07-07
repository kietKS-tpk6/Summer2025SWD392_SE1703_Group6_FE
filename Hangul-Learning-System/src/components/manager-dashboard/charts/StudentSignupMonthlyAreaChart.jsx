import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export const studentSignupMonthly = [
  { month: "01/2025", count: 42 },
  { month: "02/2025", count: 56 },
  { month: "03/2025", count: 75 },
  { month: "04/2025", count: 65 },
  { month: "05/2025", count: 88 },
  { month: "06/2025", count: 93 },
  { month: "07/2025", count: 104 },
];

const StudentSignupMonthlyAreaChart = ({ data = studentSignupMonthly }) => {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 24, right: 32, left: 8, bottom: 24 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1890ff" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 14 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 14 }} />
          <Tooltip formatter={(value) => `${value} học viên`} />
          <Area type="monotone" dataKey="count" stroke="#1890ff" fill="url(#colorCount)" strokeWidth={3} dot={{ r: 4 }}>
            <LabelList dataKey="count" position="top" style={{ fontWeight: 600, fontSize: 14 }} />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện số học viên đăng ký theo từng tháng.
      </div>
    </div>
  );
};

export default StudentSignupMonthlyAreaChart; 