import React, { useState } from "react";
import { Button, Modal, Input, Space, message } from "antd";
import axiosInstance from "../../api/axiosInstance";
import { Can } from "../../context/Can";

interface Props {
  ticketId: number;
  status: string;
  agentNote?: string;
  onUpdated?: () => void;
}

const TicketNavigationSection: React.FC<Props> = ({ ticketId, status, agentNote, onUpdated }) => {
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Điều kiện active theo trạng thái
  const canComplete = status === "Đang xử lý" && agentNote && agentNote.trim().length > 0;
  const canReject = status === "Chờ tiếp nhận";
  const canTransfer = status === "Đang xử lý";

  // ------------ API CALLS ------------
  const handleComplete = async () => {
    if (!canComplete) return;   // safety
    setLoading(true);
    try {
      await axiosInstance.patch(`/api/Ticket/Status/${ticketId}`, {
        status: "Đã xử lý",
        resolvedAt: new Date().toISOString(),
      });
      message.success("Đã cập nhật trạng thái: Đã xử lý");
      onUpdated?.();
    } catch {
      message.error("Không thể cập nhật trạng thái!");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.warning("Vui lòng nhập lý do từ chối");
      return;
    }
    if (!canReject) return;

    setLoading(true);
    try {
      await axiosInstance.patch(`/api/Ticket/Status/${ticketId}`, {
        status: "Từ chối",
        acceptedAt: new Date().toISOString(),
        refusalReason: rejectReason,
      });
      message.success("Đã từ chối ticket");
      setRejectModalVisible(false);
      setRejectReason("");
      onUpdated?.();
    } catch {
      message.error("Không thể từ chối ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <Space>

        {/* Đã xử lý xong */}
        <Button
          type="primary"
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            opacity: !canComplete ? 0.5 : 1,        
            cursor: !canComplete ? "not-allowed" : "pointer",
          }}
          disabled={!canComplete || loading}
          onClick={handleComplete}
        >
          Đã xử lý xong
        </Button>

        {/* Chuyển xử lý */}
        <Button
          type="primary"
          style={{
            backgroundColor: "#f97316",
            color: "#fff",
            opacity: !canTransfer ? 0.5 : 1,
            cursor: !canTransfer ? "not-allowed" : "pointer",
          }}
          disabled={!canTransfer || loading}
          onClick={() => message.info("Chức năng Chuyển xử lý đang phát triển")}
        >
          Chuyển xử lý
        </Button>

        {/* Từ chối */}
        <Can perform="rejectTicket">
          <Button
            danger
            style={{
              backgroundColor: "#dc2626",
              color: "#fff",
              opacity: !canReject ? 0.5 : 1,
              cursor: !canReject ? "not-allowed" : "pointer",
            }}
            disabled={!canReject || loading}
            onClick={() => setRejectModalVisible(true)}
          >
            Từ chối
          </Button>
        </Can>
      </Space>

      {/* Modal nhập lý do từ chối */}
      <Modal
        title="Từ chối ticket"
        open={rejectModalVisible}
        okText="Xác nhận"
        cancelText="Hủy"
        confirmLoading={loading}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason("");
        }}
      >
        <p>Vui lòng nhập lý do từ chối:</p>
        <Input.TextArea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          rows={4}
          placeholder="Nhập lý do từ chối..."
        />
      </Modal>
    </div>
  );
};

export default TicketNavigationSection;
