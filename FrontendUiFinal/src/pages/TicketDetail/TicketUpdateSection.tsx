import React, { useEffect, useState } from "react";
import { Card, Select, Space, Typography, AutoComplete, message, Button } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { TicketCategoryMap } from "../../constants/ticketCategory";
import "./TicketDetail.css";

const { Text } = Typography;

interface Props {
  ticketId: number;
  defaultCategory?: string;
  defaultSubCategory?: string;
  defaultDifficulty?: string;
  defaultAssignedToEmail?: string;
  onUpdated?: () => void; // callback sau khi lưu
}

const TicketUpdateSection: React.FC<Props> = ({
  ticketId,
  defaultCategory,
  defaultSubCategory,
  defaultDifficulty,
  defaultAssignedToEmail,
  onUpdated,
}) => {
  const [category, setCategory] = useState(defaultCategory);
  const [subCategory, setSubCategory] = useState(defaultSubCategory);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [assignedToEmail, setAssignedToEmail] = useState(defaultAssignedToEmail);
  const [userOptions, setUserOptions] = useState<{ value: string }[]>([]);
  const [saving, setSaving] = useState(false);

  // gợi ý email người dùng
  const handleSearchUser = async (value: string) => {
    if (!value || value.length < 2) return;
    try {
      const res = await axiosInstance.get(`/api/users/search?query=${value}`);
      setUserOptions((res.data as any).map((email: string) => ({ value: email })));
    } catch {
      message.error("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    setSubCategory(undefined);
  }, [category]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateTicket = axiosInstance.put(`/api/Ticket/Update/${ticketId}`, {
        category,
        subCategory,
        difficulty,
        assignedToEmail,
      });

      const updateStatus = axiosInstance.patch(`/api/Ticket/Status/${ticketId}`, {
        status: "Đang xử lý",
        acceptedAt: new Date().toISOString(),
      });

      // Chờ cả hai API xong
      await Promise.all([updateTicket, updateStatus]);

      message.success("Cập nhật ticket & trạng thái thành công!");
      if (onUpdated) onUpdated();
    } catch {
      message.error("Không thể cập nhật ticket!");
    } finally {
      setSaving(false);
    }
  };


  return (
    <Card className="ticket-update-card">
      <div className="ticket-update-header">Tiếp nhận &amp; Phân loại</div>
      <Space direction="vertical" style={{ width: "100%" }} size="small">
        <div className="ticket-update-row">
          <div className="ticket-update-field">
            <label>Phân nhóm:</label>
            <Select
              value={category}
              placeholder="Chọn phân nhóm"
              onChange={(val) => setCategory(val)}
              options={Object.keys(TicketCategoryMap).map((key) => ({
                value: key,
                label: key,
              }))}
              className="ticket-update-select"
            />
          </div>

          <div className="ticket-update-field">
            <label>Chi tiết loại yêu cầu:</label>
            <Select
              value={subCategory}
              placeholder="Chọn chi tiết loại"
              onChange={(val) => setSubCategory(val)}
              options={
                category
                  ? TicketCategoryMap[category]?.map((s) => ({
                      value: s,
                      label: s,
                    }))
                  : []
              }
              disabled={!category}
              className="ticket-update-select"
            />
          </div>
        </div>

        <div className="ticket-update-row">
          <div className="ticket-update-field">
            <label>Độ khó:</label>
            <Select
              value={difficulty}
              placeholder="Chọn độ khó"
              onChange={(val) => setDifficulty(val)}
              options={[
                { value: "Thấp", label: "Thấp" },
                { value: "Trung bình", label: "Trung bình" },
                { value: "Cao", label: "Cao" },
              ]}
              className="ticket-update-select"
            />
          </div>

          <div className="ticket-update-field">
            <label>Người xử lý:</label>
            <AutoComplete
              value={assignedToEmail}
              options={userOptions}
              onSearch={handleSearchUser}
              onChange={(val) => setAssignedToEmail(val)}
              placeholder="Nhập email người xử lý"
              className="ticket-update-input"
            />
          </div>
        </div>

        {/* --- Nút Lưu --- */}
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <Button
            type="primary"
            size="small"
            loading={saving}
            onClick={handleSave}
          >
            Tiếp nhận
          </Button>
        </div>
      </Space>
    </Card>
  );
};

export default TicketUpdateSection;
