import React from 'react';
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#34495e', // Dark Gray
  '#95a5a6', // Light Gray
  '#c0392b', // Dark Red
  '#27ae60', // Dark Green
  '#2980b9', // Dark Blue
  '#d35400', // Pumpkin
  '#8e44ad', // Dark Purple
  '#16a085', // Green Sea
  '#f1c40f', // Yellow
  '#7f8c8d', // Grayish Blue
];

const ReportPieChart = (data) => {
  console.log(data);
  const pieData = data?.data?.map((rep) => ({
    name: rep?.region.name,
    value: rep?.propertyCount,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={1000} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={pieData}
          cx="50%"
          cy="50%"
          // outerRadius={170}
          innerRadius={40}
          fill="#8884d8"
          label
        >
          {pieData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ReportPieChart;
