import React from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TicketStatus } from "../../constants/ticketStatus";
import { TicketPriority } from "../../constants/priorityColor";

const ticketStatusOptions = Object.entries(TicketStatus).map(([_, label]) => ({
  value: label,     
  label,
}));

interface Props {
  search: string;
  status?: string;
  priority?: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val?: string) => void;
  onPriorityChange: (val?: string) => void;
  onSearchClick: () => void;
  onReset: () => void;
}

const TicketsFilter: React.FC<Props> = ({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSearchClick,
  onReset,
}) => {
  const navigate = useNavigate();

  return (
    <div className="ticket-filters-wrapper">
      <div className="ticket-filters-header">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/tickets/create")}
          size="large"
          style={{color: "#7a7c7e"}}
        >
          <span style={{ fontWeight: "bold", fontSize: 13, color: "#7a7c7e" }}>Tạo yêu cầu mới</span>
        </Button>
      </div>

      <div className="ticket-filters">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', width: '100%' }}>
          <Input
            placeholder="Tìm theo tiêu đề..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchClick();
              }
            }}
            style={{ flex: 1, height: 31, fontSize: 10, borderRadius: 6 }}
          />

          <Select
            placeholder="Trạng thái"
            options={ticketStatusOptions}
            allowClear
            value={status}
            onChange={onStatusChange}
            style={{ width: 200, fontSize: 10, borderRadius: 14 }}
          />

          <Select
            placeholder="Mức độ ưu tiên"
            allowClear
            value={priority}
            onChange={onPriorityChange}
            style={{ width: 200, fontSize: 10, borderRadius: 14 }}
            options={Object.entries(TicketPriority).map(([_, label]) => ({
              value: label,
              label,
            }))}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="small"
            onClick={onSearchClick}
            style={{width:100, borderRadius: 6, backgroundColor: "#fff", color: "#686e77"}}
          >
            Tìm kiếm
          </Button>

          <Button icon={<ReloadOutlined />} size="small" onClick={onReset}>
            Xóa bộ lọc
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketsFilter;
