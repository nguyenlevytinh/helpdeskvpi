import React, { useEffect, useState } from "react";
import { message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import TicketsFilter from "./TicketsFilter";
import TicketsTable, { TicketListDto } from "./TicketsTable";
import "./Tickets.css";

const TicketsPage: React.FC = () => {
  const [data, setData] = useState<TicketListDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [difficulty, setDifficulty] = useState<string | undefined>();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params: any = {
        Title: search || undefined,
        Status: status || undefined,
        Difficulty: difficulty || undefined,
        PageIndex: pageIndex,
        PageSize: pageSize,
      };
      const res = await axiosInstance.get<{ data: TicketListDto[]; totalCount: number }>(
        "/api/Ticket/List",
        { params }
      );
      setData(res.data.data);
      setTotal(res.data.totalCount);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách ticket!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [pageIndex, pageSize]);

  const handleSearch = () => {
    setPageIndex(1);
    fetchTickets();
  };

  const handleReset = () => {
    setSearch("");
    setStatus(undefined);
    setDifficulty(undefined);
    setPageIndex(1);
    setTimeout(() => {
    fetchTickets();
  }, 0);
  };

  return (
    <div className="ticket-page">
      <TicketsFilter
        search={search}
        status={status}
        difficulty={difficulty}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDifficultyChange={setDifficulty}
        onSearchClick={handleSearch}
        onReset={handleReset}
      />

      <TicketsTable
        data={data}
        loading={loading}
        pageIndex={pageIndex}
        pageSize={pageSize}
        total={total}
        onPageChange={(p, s) => {
          setPageIndex(p);
          setPageSize(s);
        }}
      />
    </div>
  );
};

export default TicketsPage;
