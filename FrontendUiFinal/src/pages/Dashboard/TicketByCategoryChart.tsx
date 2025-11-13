import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { category: string; count: number; percentage: number }[];
}

const COLORS = ["#27AE60", "#F5B041", "#E74C3C", "#2980B9", "#8c8c8c"];

// Tooltip tuỳ chỉnh
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 6,
          padding: "6px 10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div><b>Danh mục:</b> {d.category}</div>
        <div><b>Số lượng:</b> {d.count}</div>
        <div><b>Tỷ lệ:</b> {d.percentage}%</div>
      </div>
    );
  }
  return null;
};

// Label hiển thị phần trăm bên trong lát bánh
const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5; // giữa lát bánh
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={500}
    >
      {`${percentage}%`}
    </text>
  );
};

const TicketByCategoryChart: React.FC<Props> = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="category"
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={90}
        labelLine={false}
        label={renderCustomizedLabel}
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>

      {/* Tooltip chi tiết */}
      <Tooltip content={<CustomTooltip />} />

      {/* Legend ở dưới */}
      <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="center"
        iconType="circle"
        iconSize={10}
      />
    </PieChart>
  </ResponsiveContainer>
);

export default TicketByCategoryChart;
