import React, { useEffect, useState } from "react";
import { Card, Rate, Input, Button, message, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  ticketId: number;
  defaultRating?: number;
  defaultFeedback?: string;
  onUpdated?: () => void; // callback reload ticket sau khi gửi đánh giá
}

const FeedbackSection: React.FC<Props> = ({
  ticketId,
  defaultRating = 0,
  defaultFeedback = "",
  onUpdated,
}) => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [feedback, setFeedback] = useState(defaultFeedback);
  const [loading, setLoading] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(defaultRating > 0);

  // Đồng bộ lại khi ticket detail thay đổi (khi reload ticket)
  useEffect(() => {
    setRating(defaultRating);
    setFeedback(defaultFeedback);
    setHasFeedback(defaultRating > 0);
  }, [defaultRating, defaultFeedback]);

  // Gửi đánh giá
  const handleSubmit = async () => {
    if (!rating) return message.warning("Vui lòng chọn số sao!");
    setLoading(true);
    try {
      await axiosInstance.post(`/api/Ticket/Feedback/${ticketId}`, {
        userRating: rating,
        userFeedback: feedback,
      });
      message.success("Cảm ơn bạn đã gửi đánh giá!");
      setHasFeedback(true);
      if (onUpdated) onUpdated(); // reload lại ticket
    } catch {
      message.error("Không thể gửi đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>Đánh giá &amp; Phản hồi</span>
          {hasFeedback && (
            <Tag
              style={{
                backgroundColor: "#dcfce7", // xanh nhạt
                color: "#15803d", // xanh đậm
                border: "none",
                fontSize: 10,
                padding: "2px 8px",
              }}
            >
              Đã đánh giá
            </Tag>
          )}
        </div>
      }
      style={{ marginTop: 12 }}
    >
      <div style={{ fontSize: 10, marginBottom: 8 }}>
        Đánh giá mức độ hài lòng:
      </div>

      {/* Hiển thị sao (disable nếu đã đánh giá) */}
      <Rate
        value={rating}
        onChange={(val) => !hasFeedback && setRating(val)}
        disabled={hasFeedback}
      />

      {/* Nếu chưa đánh giá → hiện form */}
      {!hasFeedback && (
        <>
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
            style={{ marginTop: 8, fontSize: 10, textAlign: "right" }}
          >
            Gửi đánh giá
          </Button>
        </>
      )}
    </Card>
  );
};

export default FeedbackSection;
