import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Upload,
  Space,
  Row,
  Col,
  Checkbox,
  Popconfirm,
  Tooltip,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";
import { useNotify } from "../../context/NotificationContext";

const { TextArea } = Input;

const CreateTicketPage: React.FC = () => {
  const { notify } = useNotify();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isProxy, setIsProxy] = useState(false);
  const navigate = useNavigate();

  const handleUploadChange = ({ fileList }: any) => {
    if (fileList.length > 5) {
      notify("warning", "Tối đa 5 ảnh!");
      return;
    }
    setFileList(fileList);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const base64List: string[] = await Promise.all(
        fileList.map(
          (f) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(f.originFileObj);
            })
        )
      );

      const payload = {
        Title: values.Title,
        Priority: values.Priority,
        Description: values.Description,
        RequestedForEmail: isProxy ? values.RequestedForEmail || null : null,
        AttachmentsBase64: base64List,
      };

      // Gọi API 1 lần duy nhất
      await axiosInstance.post("/api/Ticket/Create", payload);

      notify("success", "Tạo ticket thành công!");

      // Chờ notify hiện rồi navigate
      setTimeout(() => navigate("/tickets"), 400);
    } catch (err) {
      notify("error", "Không thể tạo ticket! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/tickets");

  return (
    <Card>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ fontSize: 10 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          
          {/* Tiêu đề + Priority */}
          <Row gutter={[6, 0]}>
            <Col span={12}>
              <Form.Item
                label="Tiêu đề"
                name="Title"
                rules={[{ required: true, message: "Nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề ticket..." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    Mức độ ưu tiên&nbsp;&nbsp;
                    <Tooltip title="Chọn mức độ ưu tiên dựa trên mức độ ảnh hưởng">
                      <span
                        style={{
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "#141415ff",
                          border: "1px solid #141415ff",
                          borderRadius: "50%",
                          padding: "0 5px",
                        }}
                      >
                        !
                      </span>
                    </Tooltip>
                  </span>
                }
                name="Priority"
                rules={[{ required: true, message: "Chọn mức độ ưu tiên" }]}
              >
                <Select placeholder="Chọn mức độ ưu tiên">
                  <Select.Option value="Thấp">Thấp</Select.Option>
                  <Select.Option value="Trung bình">Trung bình</Select.Option>
                  <Select.Option value="Cao">Cao</Select.Option>
                  <Select.Option value="Khẩn cấp">Khẩn cấp</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Checkbox tạo hộ */}
          <Row gutter={[6, 0]}>
            <Col span={3}>
              <Checkbox checked={isProxy} onChange={(e) => setIsProxy(e.target.checked)}>
                Tạo hộ
              </Checkbox>
            </Col>

            <Col span={20}>
              <Form.Item
                label="Email người được tạo hộ"
                name="RequestedForEmail"
                rules={
                  isProxy
                    ? [{ required: true, message: "Nhập email người được tạo hộ" }]
                    : []
                }
              >
                <Input placeholder="VD: colleague.vpi@vanphu.vn" disabled={!isProxy} />
              </Form.Item>
            </Col>
          </Row>

          {/* Mô tả */}
          <Form.Item
            label="Mô tả chi tiết"
            name="Description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Nhập chi tiết vấn đề..." />
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item label="Ảnh đính kèm (tối đa 5)">
            <Upload.Dragger
              listType="picture"
              beforeUpload={() => false}
              onChange={handleUploadChange}
              fileList={fileList}
              accept="image/*"
              multiple
              style={{ padding: 20 }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Kéo thả ảnh hoặc nhấn để chọn</p>
              <p className="ant-upload-hint">Tối đa 5 ảnh</p>
            </Upload.Dragger>

            {/* Paste ảnh */}
            <div
              onPaste={(e) => {
                const items = e.clipboardData?.items;
                if (items) {
                  const images = Array.from(items)
                    .filter((item) => item.type.startsWith("image"))
                    .map((item) => item.getAsFile());

                  const newFiles = images.map((file) => ({
                    uid: file?.name || "unknown",
                    name: file?.name || "unknown",
                    status: "done",
                    originFileObj: file,
                  }));

                  if (fileList.length + newFiles.length > 5) {
                    notify("warning", "Tối đa 5 ảnh!");
                    return;
                  }

                  setFileList((prev) => [...prev, ...newFiles]);
                }
              }}
              style={{ marginTop: 10, fontSize: 12, color: "#888" }}
            >
              Nhấn <b>Ctrl+V</b> để dán ảnh từ clipboard
            </div>
          </Form.Item>

          {/* Buttons */}
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Popconfirm
                title="Bạn có chắc chắn muốn hủy?"
                onConfirm={handleCancel}
                okText="Có"
                cancelText="Không"
              >
                <Button disabled={loading}>Hủy</Button>
              </Popconfirm>

              <Button type="primary" htmlType="submit" loading={loading}>
                Tạo Ticket
              </Button>
            </Space>
          </Form.Item>

        </Space>
      </Form>
    </Card>
  );
};

export default CreateTicketPage;
