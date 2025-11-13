import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Space,
  Row,
  Col,
  Checkbox,
  Popconfirm,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./CreateTicket.css";

const { TextArea } = Input;

const CreateTicketPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [isProxy, setIsProxy] = useState(false);
  const navigate = useNavigate();

  const handleUploadChange = ({ fileList }: any) => {
    if (fileList.length > 5) {
      message.warning("Tối đa 5 ảnh!");
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
              reader.onerror = (e) => reject(e);
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

      await axiosInstance.post("/api/Ticket/Create", payload);

      // Thông báo thành công
      message.success("Tạo ticket thành công!");
      navigate("/tickets");
    } catch (err) {
      console.error(err);

      // Thông báo thất bại
      message.error("Không thể tạo ticket! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tickets");
  };

  return (
    <Card title="Tạo Ticket mới" className="create-ticket-card">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ fontSize: 10 }}
      >
        <Space size={0} direction="vertical" style={{ width: "100%" }}>
          {/* --- Hàng 1: Tiêu đề --- */}
          <Row gutter={[6, 0]}>
            <Col span={24}>
              <Form.Item
                label="Tiêu đề"
                name="Title"
                rules={[{ required: true, message: "Nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề ticket..." />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Hàng 2: Checkbox “Tạo hộ” + Email --- */}
          <Row gutter={[6, 0]} align="middle">
            <Col span={3}>
              <Checkbox
                checked={isProxy}
                onChange={(e) => setIsProxy(e.target.checked)}
                style={{ fontSize: 10, marginLeft: 10, whiteSpace: "nowrap" }}
              >
                Tạo hộ
              </Checkbox>
            </Col>
            <Col span={20}>
              <Form.Item
                label="Email người được tạo hộ"
                name="RequestedForEmail"
                rules={
                  isProxy
                    ? [
                        {
                          required: true,
                          message: "Nhập email người được tạo hộ",
                        },
                      ]
                    : []
                }
              >
                <Input
                  placeholder="VD: colleague.vpi@vanphu.vn"
                  disabled={!isProxy}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* --- Hàng 3: Mô tả --- */}
          <Form.Item
            label="Mô tả chi tiết"
            name="Description"
            rules={[{ required: true, message: "Nhập mô tả" }]}
          >
            <TextArea rows={4} placeholder="Nhập chi tiết vấn đề..." />
          </Form.Item>

          {/* --- Hàng 4: Upload ảnh --- */}
          <Form.Item label="Ảnh đính kèm (tối đa 5)">
            <Upload
              listType="picture"
              beforeUpload={() => false}
              onChange={handleUploadChange}
              fileList={fileList}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {/* --- Hàng 5: Nút hành động --- */}
          <Form.Item style={{ textAlign: "right" }}>
            <Space>
              <Popconfirm
                title="Bạn có chắc chắn muốn hủy không?"
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
