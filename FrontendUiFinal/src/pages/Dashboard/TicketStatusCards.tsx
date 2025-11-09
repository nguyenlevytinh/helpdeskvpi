import React from "react";
import { Row, Col, Card } from "antd";

interface Props {
  data: { status: string; count: number }[];
}

const colorMap: Record<string, string> = {
  Open: "#1677ff",
  Resolved: "#52c41a",
  Rejected: "#ff4d4f",
  Accepted: "#faad14",
};

const TicketStatusCards: React.FC<Props> = ({ data }) => (
  <Row gutter={12}>
    {data.map((item) => (
      <Col key={item.status} span={6}>
        <Card
          style={{
            borderLeft: `4px solid ${colorMap[item.status] || "#999"}`,
            textAlign: "center",
            fontSize: 10,
          }}
        >
          <div style={{ color: "#888" }}>{item.status}</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{item.count}</div>
        </Card>
      </Col>
    ))}
  </Row>
);

export default TicketStatusCards;
