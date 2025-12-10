import React, { useState, useEffect } from "react";
import { Row, Col, Card, message, Spin } from "antd";
import DashboardFilters, { DashboardFilterValues } from "./DashboardFilters";
import TicketStatusCards from "./TicketStatusCards";
import TicketByMonthChart from "./TicketByMonthChart";
import TicketByCategoryChart from "./TicketByCategoryChart";
import TicketTable from "./TicketTable";
import axiosInstance from "../../api/axiosInstance";
import "./Dashboard.css";
import SlaSummarySection from "./SlaSummarySection";

const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilterValues>({
    Department: undefined,
    Category: undefined,
    Email: undefined,
    StartDate: undefined,
    EndDate: undefined,
  });
  const [statusData, setStatusData] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sRes, mRes, cRes] = await Promise.all([
        axiosInstance.get("/api/Dashboard/TicketCountByStatus", { params: filters }),
        axiosInstance.get("/api/Dashboard/TicketByMonth", { params: filters }),
        axiosInstance.get("/api/Dashboard/TicketByCategory", { params: filters }),
      ]);
      setStatusData((sRes.data as any));
      setMonthData((mRes.data as any));
      setCategoryData((cRes.data as any));
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu dashboard!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      <DashboardFilters onSearch={setFilters} onRefresh={fetchData} />

      {loading ? (
        <div className="dashboard-loading">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <TicketStatusCards data={statusData} />
          <Row gutter={12} style={{ marginTop: 0 }}>
            <Col span={14}>
              <Card title="Tickets theo tháng">
                <TicketByMonthChart data={monthData} />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Tỷ lệ theo danh mục">
                <TicketByCategoryChart data={categoryData} />
              </Card>
            </Col>
          </Row>

          <Row gutter={12} style={{ marginTop: 12 }}>
            <Col span={14}>
              <Card title="Yêu cầu gần đây">
                <TicketTable filters={filters} />
              </Card>
            </Col>
            <Col span={10}>
              <Card title="Tiêu chuẩn dịch vụ SLA">
                <div style={{ marginTop: 16 }}>
                  <SlaSummarySection />
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
