import React, { useEffect, useState } from "react";
import { Table, Tag, message } from "antd";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { TicketStatusColorMap } from "../../constants/ticketStatus";

interface Props {
  filters: any;
}

interface TicketDto {
  id: number;
  title: string;
  status: string;
  createdAt: string;
}

const TicketTable: React.FC<Props> = ({ filters }) => {
  const [data, setData] = useState<TicketDto[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/Dashboard/TicketList", {
        params: filters,
      });
      const items: TicketDto[] =
        (res.data as any).items || (res.data as any) || [];

      // Sắp xếp ngày mới nhất trước
      const sorted = [...items].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setData(sorted);
    } catch (err) {
      message.error("Không thể tải danh sách ticket!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center" as const,
      width: 60,
      render: (id: number) => (
        <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 0" }}>TK{id}</span>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      align: "center" as const,
      render: (text: string) => (
        <span style={{ fontSize: 9, padding: "2px 0" }}>
          {text || <i style={{ color: "#9ca3af" }}>Không có</i>}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center" as const,
      render: (status: string) => {
        const colors =
          TicketStatusColorMap[status as keyof typeof TicketStatusColorMap] || {
            bg: "#F3F4F6",
            text: "#111827",
          };
        return (
          <Tag
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: "none",
              borderRadius: "10px",
              padding: "0px 6px",
              fontWeight: 500,
              fontSize: "9px",
              width: 80, // Cố định width thay vì minWidth
              textAlign: "center",
              display: "inline-block",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center" as const,
      render: (text: string) => {
        const d = new Date(text);
        return (
          <span style={{ fontSize: 9, padding: "2px 0" }}>
            {d.toLocaleString("vi-VN", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        );
      },
    },
  ];

  return (
    <Table
      className="dashboard-ticket-table"
      size="small"
      bordered
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 5 }}
      style={{
        fontSize: 10,
        // Nếu muốn ép padding bằng CSS variable (tùy chọn):
        // "--ant-table-cell-padding-block": "4px",
        // "--ant-table-cell-padding-inline": "8px",
      } as React.CSSProperties}
      onRow={(record) => ({
        onClick: () => navigate(`/tickets/${record.id}`),
        style: { cursor: "pointer" },
      })}
    />
  );
};

export default TicketTable;
