import React, { useEffect, useState } from "react";
import { Card, Progress, Row, Col, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface SlaSummary {
  responseRate: number;
  processRate: number;
  satisfactionRate: number;
}

const SlaSummarySection: React.FC = () => {
  const [monthSla, setMonthSla] = useState<SlaSummary | null>(null);
  const [quarterSla, setQuarterSla] = useState<SlaSummary | null>(null);
  const [yearSla, setYearSla] = useState<SlaSummary | null>(null);

  const fetchSla = async (period: "month" | "quarter" | "year") => {
    try {
      const res = await axiosInstance.get(`/api/Dashboard/SLA?period=${period}`);
      return res.data as SlaSummary;
    } catch {
      message.error(`Không thể tải SLA (${period})`);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const [m, q, y] = await Promise.all([
        fetchSla("month"),
        fetchSla("quarter"),
        fetchSla("year"),
      ]);
      setMonthSla(m);
      setQuarterSla(q);
      setYearSla(y);
    })();
  }, []);

  const renderBlock = (title: string, data: SlaSummary | null) => (
    <Card
      bordered
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: 11,
        borderRadius: 8,
        background: "linear-gradient(to bottom, #221f1f, #505761)",
        color: "#fff",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8, color: "#fff" }}>{title}</div>
      {data ? (
        <>
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, fontSize: 9 }}>
              <span style={{ color: "#fff" }}>Phản hồi</span>
              <span style={{ color: "#fff" }}>{Math.round(data.responseRate * 100)}%</span>
            </div>
            <Progress
              percent={Math.round(data.responseRate * 100)}
              showInfo={false}
              strokeColor="#73cefd"
              trailColor="#fff"
              strokeWidth={5}
            />
          </div>
          <div style={{ marginBottom: 15 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, fontSize: 9 }}>
              <span style={{ color: "#fff" }}>Xử lý</span>
              <span style={{ color: "#fff" }}>{Math.round(data.processRate * 100)}%</span>
            </div>
            <Progress
              percent={Math.round(data.processRate * 100)}
              showInfo={false}
              strokeColor="#ffa559"
              trailColor="#fff"
              strokeWidth={5}
            />
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9 }}>
              <span style={{ color: "#fff" }}>Hài lòng</span>
              <span style={{ color: "#fff" }}>{Math.round(data.satisfactionRate * 100)}%</span>
            </div>
            <Progress
              percent={Math.round(data.satisfactionRate * 100)}
              showInfo={false}
              strokeColor="#63dc99"
              trailColor="#fff"
              strokeWidth={5}
            />
          </div>
        </>
      ) : (
        <div style={{ color: "#fff" }}>Đang tải...</div>
      )}
    </Card>
  );

  return (
    <Row justify="space-between" gutter={[8, 8]} style={{ height: 220 }}>
      <Col span={8}>{renderBlock("THÁNG", monthSla)}</Col>
      <Col span={8}>{renderBlock("QUÝ", quarterSla)}</Col>
      <Col span={8}>{renderBlock("NĂM", yearSla)}</Col>
    </Row>
  );
};

export default SlaSummarySection;
