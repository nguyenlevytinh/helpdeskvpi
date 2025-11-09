import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { category: string; count: number; percentage: number }[];
}

const COLORS = ["#1677ff", "#faad14", "#52c41a", "#ff4d4f", "#8c8c8c"];

const TicketByCategoryChart: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label={(d) => `${d.category}`}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default TicketByCategoryChart;
