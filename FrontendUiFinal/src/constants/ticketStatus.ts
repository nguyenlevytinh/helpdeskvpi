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
  [TicketStatus.Open]: { bg: "#e67e2d", text: "#fff" }, 
  [TicketStatus.InProgress]: { bg: "#ffa559", text: "#fff" },
  [TicketStatus.Resolved]: { bg: "#73cefd", text: "#fff" },
  [TicketStatus.Rejected]: { bg: "#ff9a95", text: "#fff" }, 
  [TicketStatus.Completed]: { bg: "#63dc99", text: "#fff" }, 
};
