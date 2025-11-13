// Các mức độ ưu tiên
export const TicketPriority = {
  Low: "Thấp",
  Medium: "Trung bình",
  High: "Cao",
  Urgent: "Khẩn cấp",
} as const;

// Màu nền + màu chữ cho từng mức độ ưu tiên
export const TicketPriorityColorMap: Record<
  (typeof TicketPriority)[keyof typeof TicketPriority],
  { bg: string; text: string }
> = {
  [TicketPriority.Low]: { bg: "#DCFCE7", text: "#15803D" }, // xanh lá nhạt / xanh lá đậm
  [TicketPriority.Medium]: { bg: "#DBEAFE", text: "#1D4ED8" }, // xanh dương nhạt / xanh dương đậm
  [TicketPriority.High]: { bg: "#FEE2E2", text: "#B91C1C" }, // đỏ nhạt / đỏ đậm
  [TicketPriority.Urgent]: { bg: "#B91C1C", text: "#FFFFFF" }, // nền đỏ đậm / chữ trắng
};
