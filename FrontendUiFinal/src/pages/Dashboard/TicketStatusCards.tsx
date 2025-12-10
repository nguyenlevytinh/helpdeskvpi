import React from "react";
import { Row, Col, Card } from "antd";
import {
  ClockCircleOutlined,
  SyncOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { TicketStatusColorMap, TicketStatus } from "../../constants/ticketStatus";

interface Props {
  data: { status: string; count: number }[];
}

const orderedStatuses = [
  TicketStatus.Open,        // "Chờ tiếp nhận"
  TicketStatus.InProgress,  // "Đang xử lý"
  TicketStatus.Resolved,    // "Đã xử lý"
  TicketStatus.Completed,   // "Hoàn thành"
  TicketStatus.Rejected,    // "Từ chối"
];

// Icon map tương ứng từng trạng thái
const statusIconMap: Record<string, React.ReactNode> = {
  [TicketStatus.Open]: <ClockCircleOutlined style={{ fontSize: 22 }} />,
  [TicketStatus.InProgress]: <SyncOutlined style={{ fontSize: 22}} />,
  [TicketStatus.Resolved]: <ToolOutlined style={{ fontSize: 22 }} />,
  [TicketStatus.Completed]: <CheckCircleOutlined style={{ fontSize: 22 }} />,
  [TicketStatus.Rejected]: <CloseCircleOutlined style={{ fontSize: 22 }} />,
};

const TicketStatusCards: React.FC<Props> = ({ data }) => {
  const countMap = Object.fromEntries(data.map((d) => [d.status, d.count]));

  return (
    <Row gutter={[12, 12]} wrap>
      {orderedStatuses.map((status) => {
        const colors = TicketStatusColorMap[status];
        const count = countMap[status] ?? 0;
        const icon = statusIconMap[status];

        return (
          <Col
            key={status}
            flex="1 1 20%" // chia đều 5 phần
            style={{ minWidth: 160 }}
          >
            <Card
              hoverable
              style={{
                borderLeft: `6px solid ${colors.bg}`,
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
              bodyStyle={{ 
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: colors.bg,
                  fontWeight: 500,
                  fontSize: "12px",
                }}
              >
                {icon}
                {status}
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111",
                }}
              >
                {count}
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default TicketStatusCards;
