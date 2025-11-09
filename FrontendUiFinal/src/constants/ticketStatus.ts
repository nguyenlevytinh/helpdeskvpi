// Các trạng thái ticket
export const TicketStatus = {
  Open: "Chờ tiếp nhận",
  InProgress: "Đang xử lý",
  Resolved: "Đã xử lý",
  Completed: "Hoàn thành",
  Rejected: "Từ chối",
} as const;

// Màu nền + màu chữ cho từng trạng thái
export const TicketStatusColorMap: Record<
  (typeof TicketStatus)[keyof typeof TicketStatus],
  { bg: string; text: string }
> = {
  [TicketStatus.Open]: { bg: "#E5E7EB", text: "#FFFFFF" }, // xám nhạt / chữ trắng
  [TicketStatus.InProgress]: { bg: "#DBEAFE", text: "#1D4ED8" }, // xanh nhạt / xanh đậm
  [TicketStatus.Resolved]: { bg: "#EDE9FE", text: "#5B21B6" }, // tím nhạt / tím đậm
  [TicketStatus.Rejected]: { bg: "#FEE2E2", text: "#B91C1C" }, // đỏ nhạt / đỏ đậm
  [TicketStatus.Completed]: { bg: "#DCFCE7", text: "#15803D" }, // xanh lá nhạt / xanh đậm
};
