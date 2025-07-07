import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export const classCountBySubject = [
  { subject: "TOPIK I", count: 8 },
  { subject: "TOPIK II", count: 5 },
  { subject: "Tiếng Hàn sơ cấp 1", count: 10 },
  { subject: "Tiếng Hàn trung cấp 2", count: 7 },
  { subject: "Tiếng Hàn tổng hợp", count: 12 }
];

const ClassCountBySubjectBarChart = ({ data = classCountBySubject }) => {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 24, right: 32, left: 8, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 14 }} />
          <YAxis type="category" dataKey="subject" width={160} tick={{ fontSize: 14 }} />
          <Tooltip formatter={(value) => `${value} lớp`} />
          <Bar dataKey="count" fill="#1890ff" barSize={28} radius={[8, 8, 8, 8]}>
            <LabelList dataKey="count" position="right" style={{ fontWeight: 600, fontSize: 15 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện tổng số lớp theo từng môn học.
      </div>
    </div>
  );
};

export default ClassCountBySubjectBarChart; 