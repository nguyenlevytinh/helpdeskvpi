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
  [TicketPriority.Low]: { bg: "#dbb5ee", text: "#fff" }, // xanh lá nhạt / xanh lá đậm
  [TicketPriority.Medium]: { bg: "#b1a7f2", text: "#fff" }, // xanh dương nhạt / xanh dương đậm
  [TicketPriority.High]: { bg: "#8066e7", text: "#fff" }, // đỏ nhạt / đỏ đậm
  [TicketPriority.Urgent]: { bg: "#7e4ca5", text: "#fff" }, // nền đỏ đậm / chữ trắng
};
