import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import TicketInfo from "./TicketInfo";
import CommentSection from "./CommentSection";
import FeedbackSection from "./FeedbackSection";
import { TicketDetailDto, CommentDto } from "./TicketDetail.types";
import "./TicketDetail.css";

const TicketDetailPage: React.FC = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState<TicketDetailDto | null>(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/Ticket/${id}`);
      setTicket(res.data as any);
    } catch {
      message.error("Không thể tải chi tiết ticket!");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/api/Comment/List/${id}`);
      setComments(res.data as any);
    } catch {
      message.error("Không thể tải danh sách bình luận!");
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-left">
        <TicketInfo ticket={ticket} />
        {ticket.status === "Resolved" && (
          <FeedbackSection ticketId={ticket.id} />
        )}
      </div>
      <div className="ticket-detail-right">
        <CommentSection
          ticketId={ticket.id}
          comments={comments}
          refresh={fetchComments}
        />
      </div>
    </div>
  );
};

export default TicketDetailPage;
