import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { month: string; count: number }[];
}

const TicketByMonthChart: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
      <YAxis tick={{ fontSize: 10 }} />
      <Tooltip />
      <Bar dataKey="count" fill="#1677ff" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default TicketByMonthChart;
