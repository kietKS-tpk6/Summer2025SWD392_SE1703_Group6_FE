import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export const classCompletionRateByMonth = [
  { month: "2025-02", completed: 10, cancelled: 2, total: 12, rate: 83 },
  { month: "2025-03", completed: 15, cancelled: 0, total: 15, rate: 100 },
  { month: "2025-04", completed: 12, cancelled: 3, total: 15, rate: 80 },
  { month: "2025-05", completed: 9, cancelled: 1, total: 10, rate: 90 },
  { month: "2025-06", completed: 7, cancelled: 3, total: 10, rate: 70 },
  { month: "2025-07", completed: 4, cancelled: 6, total: 10, rate: 40 },
];

const ClassCompletionRateByMonthChart = ({ data = classCompletionRateByMonth }) => {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={data}
          margin={{ top: 24, right: 32, left: 8, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 14 }} />
          <YAxis yAxisId="left" tick={{ fontSize: 14 }} allowDecimals={false} label={{ value: 'Số lớp', angle: -90, position: 'insideLeft', offset: 10 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 14 }} domain={[0, 100]} label={{ value: 'Tỉ lệ (%)', angle: 90, position: 'insideRight', offset: 10 }} />
          <Tooltip formatter={(value, name) => name === 'rate' ? `${value}%` : value} />
          <Legend verticalAlign="top" height={36} />
          <Bar yAxisId="left" dataKey="completed" name="Hoàn thành" fill="#52c41a" barSize={22} radius={[6, 6, 0, 0]}>
            <LabelList dataKey="completed" position="top" style={{ fontWeight: 600, fontSize: 13 }} />
          </Bar>
          <Bar yAxisId="left" dataKey="cancelled" name="Huỷ" fill="#f5222d" barSize={22} radius={[6, 6, 0, 0]}>
            <LabelList dataKey="cancelled" position="top" style={{ fontWeight: 600, fontSize: 13 }} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="rate" name="Tỉ lệ hoàn thành" stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }}>
            <LabelList dataKey="rate" position="top" formatter={v => `${v}%`} style={{ fontWeight: 600, fontSize: 13 }} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện tỷ lệ hoàn thành lớp của 6 tháng gần nhất.
      </div>
    </div>
  );
};

export default ClassCompletionRateByMonthChart; 