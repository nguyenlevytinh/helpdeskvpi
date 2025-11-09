export interface TicketDetailDto {
  id: number;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  status: string;
  priority: string;
  difficulty?: string;
  createdAt: string;
  createdBy: string;
  requestedFor: string;
  assignedTo?: string;
  attachments: { id: number; base64: string }[];
}

export interface CommentDto {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  attachments: { id: number; base64: string }[];
}
