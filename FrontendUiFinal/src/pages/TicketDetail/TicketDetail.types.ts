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
  department?: string;
  assignedTo?: string;
  attachments: string[];
  agentNote?: string;
  userRating?: number;
}

export interface CommentDto {
  id: number;
  content: string;
  createdBy: string;
  createdAt: string;
  createdByFullName: string;
  attachments: { id: number; base64: string }[];
}
