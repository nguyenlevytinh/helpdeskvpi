import React from "react";
import { Card, Image, Space, Tag } from "antd";
import { TicketDetailDto } from "./TicketDetail.types";
import { TicketStatus, TicketStatusColorMap } from "../../constants/ticketStatus";

interface Props {
  ticket: TicketDetailDto;
}

const TicketInfo: React.FC<Props> = ({ ticket }) => {
  // Lấy label tiếng Việt theo status code
  const viStatus = TicketStatus[ticket.status as keyof typeof TicketStatus] || ticket.status;

  // Lấy config màu theo label tiếng Việt
  const statusCfg = TicketStatusColorMap[viStatus as keyof typeof TicketStatusColorMap] || {
    bg: "#f0f0f0",
    text: "#000",
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
          <span>
            Ticket {ticket.id} - {ticket.title}
          </span>
          <Tag
            style={{
              backgroundColor: statusCfg.bg,
              color: statusCfg.text,
              border: "none",
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
            }}
          >
            {viStatus}
          </Tag>
        </div>
      }
    >
      <div
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 8,
          padding: 12,
          background: "#fafafa",
          fontSize: 10,
        }}
      >
        {/* --- Description --- */}
        <div style={{ marginBottom: 12 }}>
          <strong>Nội dung yêu cầu:</strong>
          <div style={{ marginTop: 4, whiteSpace: "pre-line" }}>{ticket.description}</div>

          {ticket.attachments?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <Image.PreviewGroup>
                <Space wrap>
                  {ticket.attachments.map((base64, index) => (
                    <Image
                      key={index}
                      width={100}
                      src={base64}
                      style={{
                        borderRadius: 6,
                        border: "1px solid #eee",
                      }}
                    />
                  ))}
                </Space>
              </Image.PreviewGroup>
            </div>
          )}

        </div>

        {/* --- Priority & Department --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>Mức độ ưu tiên:</strong>{" "}
              {ticket.priority}
          </div>
          <div style={{ flex: 1 }}>
            <strong>Đơn vị gửi:</strong> {ticket.department || "-"}
          </div>
        </div>

        {/* --- CreatedAt & RequestedFor --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(ticket.createdAt).toLocaleString("vi-VN", {
              dateStyle: "short",
              timeStyle: "short",
              hour12: false,
            })}
          </div>
          <div style={{ flex: 1 }}>
            <strong>Người yêu cầu:</strong> {ticket.requestedFor}
          </div>
        </div>

        {/* --- Category & Subcategory --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 6,
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>Phân nhóm:</strong> {ticket.category}
          </div>
          <div style={{ flex: 1 }}>
            <strong>Chi tiết loại yêu cầu:</strong> {ticket.subCategory || "-"}
          </div>
        </div>

        {/* --- Difficulty & AssignedTo --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            <strong>Độ khó:</strong> {ticket.difficulty || "-"}
          </div>
          <div style={{ flex: 1 }}>
            <strong>Người xử lý:</strong> {ticket.assignedTo || "-"}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TicketInfo;
