// src/pages/Admin/components/ChartDonut.js
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

/**
 * Props:
 * - data: Array<{ month: string; count: number }>
 */
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28AFF', '#FF6384'];

const ChartDonut = ({ data }) => {
  // transform to { name, value }
  const pieData = data.map((item, idx) => ({
    name: item.month,
    value: item.count
  }));

  return (
    <div className="card mb-4">
      <div className="card-header">Booking Theo Tháng (6 tháng gần nhất)</div>
      <div className="card-body" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Legend verticalAlign="top" height={36} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDonut;
