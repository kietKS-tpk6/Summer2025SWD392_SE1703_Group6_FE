import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export const incomeBySubjectPieData = [
  { name: "Sơ cấp 1", value: 3800000 },
  { name: "Trung cấp 1", value: 2750000 },
  { name: "Sơ cấp 2", value: 2400000 },
  { name: "Ôn thi TOPIK", value: 5200000 },
];

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d"];
const formatCurrency = (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const IncomeBySubjectPieChart = ({ data = incomeBySubjectPieData }) => {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            <LabelList dataKey="value" position="outside" formatter={formatCurrency} style={{ fontWeight: 600, fontSize: 14 }} />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={formatCurrency} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện phân bổ thu nhập theo môn học.
      </div>
    </div>
  );
};

export default IncomeBySubjectPieChart; 