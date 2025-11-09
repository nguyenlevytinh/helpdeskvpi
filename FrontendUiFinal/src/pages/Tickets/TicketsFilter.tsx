import React from "react";
import { Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface Props {
  search: string;
  status?: string;
  difficulty?: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val?: string) => void;
  onDifficultyChange: (val?: string) => void;
  onSearchClick: () => void;
  onReset: () => void;
}

const TicketsFilter: React.FC<Props> = ({
  search,
  status,
  difficulty,
  onSearchChange,
  onStatusChange,
  onDifficultyChange,
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
          style={{ width: 200, fontSize: 10 }}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          value={status}
          onChange={(v) => onStatusChange(v)}
          style={{ width: 140, fontSize: 10 }}
          options={[
            { value: "Open", label: "Chờ tiếp nhận" },
            { value: "InProgress", label: "Đang xử lý" },
            { value: "Resolved", label: "Đã xử lý" },
            { value: "Rejected", label: "Từ chối" },
            { value: "Completed", label: "Hoàn thành" },
          ]}
        />
        <Select
          placeholder="Độ khó"
          allowClear
          value={difficulty}
          onChange={(v) => onDifficultyChange(v)}
          style={{ width: 120, fontSize: 10 }}
          options={[
            { value: "Low", label: "Thấp" },
            { value: "Medium", label: "Trung bình" },
            { value: "High", label: "Cao" },
          ]}
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
        size="small"
        style={{ fontSize: 10 }}
      >
        Tạo yêu cầu mới
      </Button>
    </div>
  );
};

export default TicketsFilter;
