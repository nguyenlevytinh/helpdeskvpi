import React, { useEffect, useState } from "react";
import { Card, Rate, Input, Button, message, Tag } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  ticketId: number;
  defaultRating?: number;
  defaultFeedback?: string;
  onUpdated?: () => void; // callback reload ticket sau khi gửi đánh giá
  disabled?: boolean;
}

const FeedbackSection: React.FC<Props> = ({
  ticketId,
  defaultRating = 0,
  defaultFeedback = "",
  onUpdated,
  disabled = false,  // ✔ FIXED: nhận đúng prop disable
}) => {
  const [rating, setRating] = useState<number>(defaultRating);
  const [feedback, setFeedback] = useState(defaultFeedback);
  const [loading, setLoading] = useState(false);
  const [hasFeedback, setHasFeedback] = useState(defaultRating > 0);

  useEffect(() => {
    setRating(defaultRating);
    setFeedback(defaultFeedback);
    setHasFeedback(defaultRating > 0);
  }, [defaultRating, defaultFeedback]);

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

      if (onUpdated) onUpdated();
    } catch {
      message.error("Không thể gửi đánh giá!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Đánh giá & Phản hồi</span>
          {hasFeedback && (
            <Tag style={{ backgroundColor: "#dcfce7", color: "#15803d", border: "none", fontSize: 10 }}>
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

      {/* Rate: disable nếu đã đánh giá hoặc ticket bị disable */}
      <Rate
        value={rating}
        onChange={(val) => !hasFeedback && !disabled && setRating(val)}
        disabled={hasFeedback || disabled}
      />

      {/* Chỉ hiện form khi chưa đánh giá */}
      {!hasFeedback && (
        <>
          <Input.TextArea
            rows={3}
            placeholder="Nhập phản hồi (tùy chọn)..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ marginTop: 8, fontSize: 10 }}
            disabled={disabled}   // ✔ FIXED
          />

          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={disabled}    // ✔ FIXED
            style={{ marginTop: 8, fontSize: 10 }}
          >
            Gửi đánh giá
          </Button>
        </>
      )}
    </Card>
  );
};
export default FeedbackSection;