import React, { useEffect, useState } from "react";
import { Spin, message } from "antd";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import TicketInfo from "./TicketInfo";
import TicketUpdateSection from "./TicketUpdateSection";
import CommentSection from "./CommentSection";
import FeedbackSection from "./FeedbackSection";
import AgentNoteSection from "./AgentNoteSection";
import TicketNavigationSection from "./TicketNavigationSection";
import { TicketDetailDto, CommentDto } from "./TicketDetail.types";
import "./TicketDetail.css";
import { Can } from "../../context/Can";

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

  if (loading || !ticket) {
    return (
      <div className="ticket-detail-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      <div className="ticket-detail-left">
        {/* Điều hướng ticket - chỉ Support + Admin */}
        <Can perform="navigation">
          <div style={{ marginTop: 0 }}>
            <TicketNavigationSection ticketId={ticket.id} status={ticket.status} agentNote={ticket.agentNote}  onUpdated={fetchTicket} />
          </div>
        </Can>

        {/* Thông tin chung - ai cũng xem */}
        <Can perform="info">
          <TicketInfo ticket={ticket} />
        </Can>

        {/* Tiếp nhận & phân loại - Support + Admin */}
        <Can perform="assignSection">
          <div style={{ marginTop: 0 }}>
            <TicketUpdateSection
              ticketId={ticket.id}
              defaultCategory={ticket.category}
              defaultSubCategory={ticket.subCategory}
              defaultDifficulty={ticket.difficulty}
              defaultAssignedToEmail={ticket.assignedTo}
              onUpdated={fetchTicket}
            />
          </div>
        </Can>

        {/* Agent Note - chỉ Support + Admin */}
        <Can perform="agentNote">
          <div style={{ marginTop: 0 }}>
            <AgentNoteSection
              ticketId={ticket.id}
              defaultNote={ticket.agentNote}
              onUpdated={fetchTicket}
            />
          </div>
        </Can>

        {/* Feedback - chỉ User được phép */}
        <Can perform="feedback">
          <FeedbackSection ticketId={ticket.id} 
            disabled={ticket.status !== "Đã xử lý"}
          />
        </Can>
      </div>

      {/* Comment - Admin + Support + User */}
      <div className="ticket-detail-right">
        <Can perform="comment">
          <CommentSection
            ticketId={ticket.id}
            comments={comments}
            refresh={fetchComments}
          />
        </Can>
      </div>
    </div>
  );
};

export default TicketDetailPage;
