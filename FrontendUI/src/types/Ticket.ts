// Định nghĩa kiểu dữ liệu Ticket
export interface Ticket {
  id: number;
  description: string;
  subCategory: string;
  category: string;
  createdBy: number;
  assignedTo: number;
  status: string;
  createdAt: string; // DateTime được truyền dưới dạng chuỗi ISO
  acceptedAt: string; // DateTime được truyền dưới dạng chuỗi ISO
  resolvedAt: string; // DateTime được truyền dưới dạng chuỗi ISO
  priority: string;
  difficulty: string;
  userRating: number;
  userFeedback: string;
}

// Định nghĩa kiểu dữ liệu TicketCreateDto
export interface TicketCreateDto {
  description: string;
  subCategory: string;
  category: string;
  createdBy: number;
  priority: string;
}