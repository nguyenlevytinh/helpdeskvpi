import React from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { TicketStatus } from "../../constants/ticketStatus";
import { TicketPriority } from "../../constants/priorityColor";

const ticketStatusOptions = Object.entries(TicketStatus).map(([value, label]) => ({
  value,
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
    <div className="ticket-filters">
      <Space wrap>
        <Input
          placeholder="Tìm theo tiêu đề..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ width: 200, height: 31, fontSize: 10 }}
        />
        <Select
          placeholder="Trạng thái"
          options={ticketStatusOptions}
          allowClear
          value={status}
          onChange={(v) => onStatusChange(v)}
          style={{ width: 140, fontSize: 10 }}
        />
        <Select
          placeholder="Mức độ ưu tiên"
          allowClear
          value={priority}
          onChange={(v) => onPriorityChange(v)}
          style={{ width: 120, fontSize: 10 }}
          options={Object.entries(TicketPriority).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          onClick={onSearchClick}
        >
          Tìm kiếm
        </Button>
        <Button icon={<ReloadOutlined />} size="small" onClick={onReset}>
          Xóa bộ lọc
        </Button>
      </Space>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => navigate("/tickets/create")}
        size="large"
      >
        <span style={{fontWeight: "bold", fontSize: 13}}>Tạo yêu cầu mới</span>
      </Button>
    </div>
  );
};

export default TicketsFilter;
