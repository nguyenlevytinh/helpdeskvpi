import React, { useState } from "react";
import { Card, Input, Button, message } from "antd";
import axiosInstance from "../../api/axiosInstance";

const { TextArea } = Input;

interface Props {
  ticketId: number;
  defaultNote?: string;
  onUpdated?: () => void;
}

const AgentNoteSection: React.FC<Props> = ({ ticketId, defaultNote, onUpdated }) => {
  const [note, setNote] = useState(defaultNote || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) {
      message.warning("Vui lòng nhập nội dung ghi chú trước khi lưu");
      return;
    }

    setSaving(true);
    try {
      await axiosInstance.patch(`/api/Ticket/AgentNote/${ticketId}`, {
        agentNote: note,
      });
      message.success("Đã cập nhật ghi chú xử lý!");
      if (onUpdated) onUpdated();
    } catch {
      message.error("Không thể cập nhật ghi chú!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        padding: 0,
        background: "#fafafa",
        fontSize: 10,
        marginTop: 0,
      }}
    >
      {/* Tiêu đề */}
      <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 12 }}>
        Xác định lỗi / Phương thức xử lý
      </div>

      {/* Textarea nhập ghi chú */}
      <TextArea
        rows={5}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nhập nội dung ghi chú xử lý..."
        style={{
          background: "#fff",
          borderRadius: 6,
          fontSize: 11,
          borderColor: "#d9d9d9",
        }}
      />

      {/* Nút Lưu */}
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <Button type="primary" size="large" loading={saving} onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </Card>
  );
};

export default AgentNoteSection;
