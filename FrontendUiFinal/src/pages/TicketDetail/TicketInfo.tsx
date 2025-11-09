import React from "react";
import { Card, Descriptions, Image, Space, Tag } from "antd";
import { TicketDetailDto } from "./TicketDetail.types";

interface Props {
  ticket: TicketDetailDto;
}

const TicketInfo: React.FC<Props> = ({ ticket }) => (
  <>
    <Card title={`Ticket ${ticket.id} - ${ticket.title}`}>
      <Descriptions
        column={1}
        bordered
        size="small"
        labelStyle={{ width: "30%", fontSize: 10 }}
        contentStyle={{ fontSize: 10 }}
      >
        <Descriptions.Item label="Mô tả">{ticket.description}</Descriptions.Item>
        <Descriptions.Item label="Danh mục">{ticket.category}</Descriptions.Item>
        {ticket.subCategory && (
          <Descriptions.Item label="Phân nhóm">{ticket.subCategory}</Descriptions.Item>
        )}
        <Descriptions.Item label="Người tạo">{ticket.createdBy}</Descriptions.Item>
        <Descriptions.Item label="Yêu cầu cho">{ticket.requestedFor}</Descriptions.Item>
        <Descriptions.Item label="Gán cho">
          {ticket.assignedTo || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Độ ưu tiên">
          <Tag
            color={
              ticket.priority === "High"
                ? "red"
                : ticket.priority === "Medium"
                ? "orange"
                : "blue"
            }
          >
            {ticket.priority}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Độ khó">
          {ticket.difficulty || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag
            color={
              ticket.status === "Open"
                ? "blue"
                : ticket.status === "Resolved"
                ? "green"
                : ticket.status === "Rejected"
                ? "red"
                : "default"
            }
          >
            {ticket.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {new Date(ticket.createdAt).toLocaleString("vi-VN", {
            dateStyle: "short",
            timeStyle: "short",
            hour12: false,
          })}
        </Descriptions.Item>
      </Descriptions>
    </Card>

    <Card title="Ảnh đính kèm" style={{ marginTop: 12 }}>
      {ticket.attachments?.length ? (
        <Image.PreviewGroup>
          <Space wrap>
            {ticket.attachments.map((a) => (
              <Image
                key={a.id}
                width={120}
                src={a.base64}
                style={{ border: "1px solid #f0f0f0", borderRadius: 4 }}
              />
            ))}
          </Space>
        </Image.PreviewGroup>
      ) : (
        <p style={{ fontSize: 10, color: "#888" }}>Không có ảnh đính kèm.</p>
      )}
    </Card>
  </>
);

export default TicketInfo;
