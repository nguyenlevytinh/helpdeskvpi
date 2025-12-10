import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { month: string; count: number }[];
}

const buildFullMonthData = (data: { month: string; count: number }[]) => {
  // Tạo danh sách 12 tháng: 01..12
  const fullMonths = Array.from({ length: 12 }, (_, i) => ({
    month: (i + 1).toString().padStart(2, "0"),
    count: 0,
  }));

  // Map data thật (data từ BE có dạng "2025-03")
  const map = Object.fromEntries(
    data.map((d) => [d.month.slice(5), d.count]) // lấy phần MM
  );

  // Trả về 12 tháng (01..12) có dữ liệu hoặc = 0
  return fullMonths.map((m) => ({
    month: `2025-${m.month}`,
    count: map[m.month] ?? 0,
  }));
};

const TicketByMonthChart: React.FC<Props> = ({ data }) => {
  const fullData = buildFullMonthData(data);

  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={fullData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} domain={[10, 250]} width={40} />
        <Tooltip />
        <Bar dataKey="count" fill="#1677ff" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TicketByMonthChart;
