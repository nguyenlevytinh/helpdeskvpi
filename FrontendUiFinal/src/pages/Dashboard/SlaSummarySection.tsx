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
        width: "100%", // Để block tự co giãn theo không gian cột
        textAlign: "center",
        fontSize: 11,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {data ? (
        <>
          <div style={{ marginBottom: 8 }}>
            <div>Phản hồi {Math.round(data.responseRate * 100)}%</div>
            <Progress
              percent={Math.round(data.responseRate * 100)}
              showInfo={false}
              strokeColor="#3b82f6"
              strokeWidth={8}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div>Xử lý {Math.round(data.processRate * 100)}%</div>
            <Progress
              percent={Math.round(data.processRate * 100)}
              showInfo={false}
              strokeColor="#059669"
              strokeWidth={8}
            />
          </div>
          <div>
            <div>Hài lòng {Math.round(data.satisfactionRate * 100)}%</div>
            <Progress
              percent={Math.round(data.satisfactionRate * 100)}
              showInfo={false}
              strokeColor="#a855f7"
              strokeWidth={8}
            />
          </div>
        </>
      ) : (
        <div>Đang tải...</div>
      )}
    </Card>
  );

  return (
    <Row justify="space-between" gutter={[8, 8]} style={{ height: 280 }}>
      <Col span={8}>{renderBlock("THÁNG", monthSla)}</Col>
      <Col span={8}>{renderBlock("QUÝ", quarterSla)}</Col>
      <Col span={8}>{renderBlock("NĂM", yearSla)}</Col>
    </Row>
  );
};

export default SlaSummarySection;
