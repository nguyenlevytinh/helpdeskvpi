import React from "react";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import { TicketStatusColorMap } from "../../constants/ticketStatus";
import { TicketPriorityColorMap } from "../../constants/priorityColor";

export interface TicketListDto {
  id: number;
  title: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
}

interface Props {
  data: TicketListDto[];
  loading: boolean;
  pageIndex: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number, size: number) => void;
}

const TicketsTable: React.FC<Props> = ({
  data,
  loading,
  pageIndex,
  pageSize,
  total,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<TicketListDto> = [
    {
      title: "Mã ticket",
      dataIndex: "id",
      width: 80,
      align: "center",
      render: (id) => (
        <span style={{ fontWeight: 500, color: "#1f2937" }}>TK{id}</span>
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      align: "center",
      width: 300,
      ellipsis: true,
      render: (text) => text || <i style={{ color: "#9ca3af" }}>Không có</i>,
    },
    {
      title: "Loại yêu cầu",
      dataIndex: "category",
      align: "center",
      render: (text) => text || <i style={{ color: "#9ca3af" }}>–</i>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
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
              borderRadius: "12px",
              padding: "2px 10px",
              fontWeight: 500,
              fontSize: "10px",
              textAlign: "center",
              minWidth: 90,
              display: "inline-block",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Mức độ ưu tiên",
      dataIndex: "priority",
      align: "center",
      render: (priority: string) => {
        const colors =
          TicketPriorityColorMap[
            priority as keyof typeof TicketPriorityColorMap
          ] || { bg: "#F3F4F6", text: "#111827" };

        return (
          <Tag
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              border: "none",
              borderRadius: "12px",
              padding: "2px 10px",
              fontWeight: 500,
              fontSize: "10px",
              textAlign: "center",
              minWidth: 80,
              display: "inline-block",
            }}
          >
            {priority || "–"}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      align: "center",
      render: (text) =>
        new Date(text).toLocaleString("vi-VN", {
          hour12: false,
          dateStyle: "short",
          timeStyle: "short",
        }),
    },
  ];

  return (
    <Table<TicketListDto>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{
        y: 300, // Chiều cao vùng scroll (đã giảm cho vừa top bar)
      }}
      pagination={{
        current: pageIndex,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        size: "small",
        position: ["bottomCenter"], // Cố định footer
      }}
      onRow={(record) => ({
        onClick: () => navigate(`/tickets/${record.id}`),
      })}
      size="small"
      bordered
      className="ticket-table"
      style={{ maxHeight: "500px" }} // toàn khung bảng cố định
    />
  );
};

export default TicketsTable;
