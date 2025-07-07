import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

export const revenueByMonth = [
  { month: "01/2025", revenue: 12000000 },
  { month: "02/2025", revenue: 18000000 },
  { month: "03/2025", revenue: 24000000 },
  { month: "04/2025", revenue: 20000000 },
  { month: "05/2025", revenue: 31000000 },
  { month: "06/2025", revenue: 37000000 },
  { month: "07/2025", revenue: 42000000 },
];

const formatCurrency = (value) => value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

const RevenueByMonthLineChart = ({ data = revenueByMonth }) => {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 24, right: 32, left: 8, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 14 }} />
          <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 14 }} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Line type="monotone" dataKey="revenue" stroke="#1890ff" strokeWidth={3} dot={{ r: 4 }}>
            <LabelList dataKey="revenue" position="top" formatter={formatCurrency} style={{ fontWeight: 600, fontSize: 14 }} />
          </Line>
        </LineChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', marginTop: 8, color: '#666', fontSize: 15, fontStyle: 'italic' }}>
        Biểu đồ thể hiện doanh thu 6 tháng gần nhất.
      </div>
    </div>
  );
};

export default RevenueByMonthLineChart; 