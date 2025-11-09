import React, { useState } from "react";
import { Card, List, Image, Space, Input, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { CommentDto } from "./TicketDetail.types";

interface Props {
  ticketId: number;
  comments: CommentDto[];
  refresh: () => void;
}

const CommentSection: React.FC<Props> = ({ ticketId, comments, refresh }) => {
  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);

  const handleAdd = async () => {
    if (!commentText.trim()) return message.warning("Vui lòng nhập nội dung!");
    setSending(true);
    try {
      await axiosInstance.post("/api/Comment/Add", {
        TicketId: ticketId,
        Content: commentText.trim(),
        AttachmentsBase64: [],
      });
      setCommentText("");
      message.success("Đã thêm bình luận!");
      refresh();
    } catch {
      message.error("Không thể thêm bình luận!");
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      title={`Bình luận (${comments.length})`}
      extra={
        <Button size="small" onClick={refresh}>
          Làm mới
        </Button>
      }
      style={{ height: "100%" }}
    >
      <div className="comment-list">
        <List
          dataSource={comments}
          renderItem={(item) => (
            <List.Item className="comment-item">
              <List.Item.Meta
                title={
                  <Space>
                    <strong style={{ fontSize: 10 }}>{item.createdBy}</strong>
                    <span style={{ fontSize: 9, color: "#888" }}>
                      {new Date(item.createdAt).toLocaleString("vi-VN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </Space>
                }
                description={<div style={{ fontSize: 10 }}>{item.content}</div>}
              />
              {item.attachments?.length > 0 && (
                <Image.PreviewGroup>
                  <Space wrap>
                    {item.attachments.map((a) => (
                      <Image key={a.id} width={80} src={a.base64} />
                    ))}
                  </Space>
                </Image.PreviewGroup>
              )}
            </List.Item>
          )}
        />
      </div>

      <div className="comment-form">
        <Input.TextArea
          rows={3}
          placeholder="Nhập bình luận..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{ fontSize: 10 }}
        />
        <Button
          type="primary"
          onClick={handleAdd}
          loading={sending}
          style={{ marginTop: 8, fontSize: 10 }}
        >
          Gửi bình luận
        </Button>
      </div>
    </Card>
  );
};

export default CommentSection;
