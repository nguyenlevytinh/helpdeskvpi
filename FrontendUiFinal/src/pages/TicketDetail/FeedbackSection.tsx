import React, { useState } from "react";
import { Card, Rate, Input, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  ticketId: number;
}

const FeedbackSection: React.FC<Props> = ({ ticketId }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return message.warning("Vui lòng chọn số sao!");
    setLoading(true);
    try {
      await axiosInstance.post(`/api/Ticket/Feedback/${ticketId}`, {
        UserRating: rating,
        UserFeedback: feedback,
      });
      message.success("Cảm ơn bạn đã gửi đánh giá!");
      setFeedback("");
      setRating(0);
    } catch {
      message.error("Không thể gửi đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Đánh giá & phản hồi" style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, marginBottom: 8 }}>Đánh giá mức độ hài lòng:</div>
      <Rate value={rating} onChange={setRating} />
      <Input.TextArea
        rows={3}
        placeholder="Nhập phản hồi (tùy chọn)..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{ marginTop: 8, fontSize: 10 }}
      />
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={loading}
        style={{ marginTop: 8, fontSize: 10 }}
      >
        Gửi đánh giá
      </Button>
    </Card>
  );
};

export default FeedbackSection;
