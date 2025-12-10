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

const COLORS = ["#ffa559", "#e67e2d", "#8066e7", "#34308f", "#8c8c8c"];

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
        <div><b>Tỷ lệ:</b> {d.percentage.toFixed(1)}%</div>
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
      {`${percentage.toFixed(1)}%`}
    </text>
  );
};

const TicketByCategoryChart: React.FC<Props> = ({ data }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ flex: 1  }}>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={75}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default TicketByCategoryChart;
