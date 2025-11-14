import React, { useState } from "react";
import { Card, List, Image, Space, Input, Button, message, Tabs } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { CommentDto } from "./TicketDetail.types";

interface Props {
  ticketId: number;
  comments: CommentDto[];
  refresh: () => void;
}

const { TabPane } = Tabs;

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
    <Card style={{ height: "100%", padding: 0 }}>
      <Tabs
        defaultActiveKey="1"
        centered
        style={{ width: "100%" }}
        tabBarStyle={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {/* TAB 1: THẢO LUẬN */}
        <TabPane tab="Thảo luận" key="1">
          <div style={{ height: "370px", display: "flex", flexDirection: "column" }}>
            
            {/* LIST COMMENT SCROLL */}
            <div style={{ height: "300px", overflowY: "auto", paddingRight: 5 }}>
              <List
                dataSource={comments}
                locale={{ emptyText: "Chưa có nội dung thảo luận." }}
                renderItem={(item) => (
                  <List.Item className="comment-item">
                    <List.Item.Meta
                      title={
                        <Space>
                          <strong style={{ fontSize: 10 }}>
                            {item.createdByFullName || item.createdBy}
                          </strong>

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

            {/* FORM COMMENT — CỐ ĐỊNH DƯỚI */}
            <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Input.TextArea
                rows={3}
                placeholder="Nhập nội dung thảo luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                style={{ fontSize: 10, height: "20px", flex: 1 }} // Flex 1 để chiếm không gian còn lại
              />
              <Button
                type="primary"
                onClick={handleAdd}
                loading={sending}
                style={{ height: "100%", fontSize: 10 , width: "40px"}}
              >
                Gửi
              </Button>
            </div>

          </div>
        </TabPane>

        {/* TAB 2: LỊCH SỬ */}
        <TabPane tab="Lịch sử" key="2">
          <div
            style={{
              height: 440,
              overflowY: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              fontSize: 13,
            }}
          >
            (Hiển thị lịch sử thay đổi sau)
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default CommentSection;
