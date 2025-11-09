import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  filters: any;
}

const TicketTable: React.FC<Props> = ({ filters }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/Dashboard/TicketList", {
        params: filters,
      });
      setData((res.data as any).items || (res.data as any));
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
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Mô tả", dataIndex: "description" },
    { title: "Danh mục", dataIndex: "category" },
    { title: "Trạng thái", dataIndex: "status" },
    { title: "Ngày tạo", dataIndex: "createdAt" },
  ];

  return (
    <Table
      size="small"
      bordered
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default TicketTable;
