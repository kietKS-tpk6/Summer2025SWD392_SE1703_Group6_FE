import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const classStatusDistribution = [
  { name: "Pending", value: 5 },
  { name: "Open", value: 12 },
  { name: "Ongoing", value: 18 },
  { name: "Completed", value: 10 },
  { name: "Cancelled", value: 4 },
];

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#13c2c2", "#f5222d"];

const ClassStatusDistributionPieChart = ({ data = classStatusDistribution }) => {
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} lớp`} />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện phân bổ trạng thái các lớp học.
      </div>
    </div>
  );
};

export default ClassStatusDistributionPieChart; 