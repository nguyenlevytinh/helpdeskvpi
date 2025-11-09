import React, { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string }) => {
    try {
      setLoading(true);

      // Giả lập gọi API đăng nhập
      if (values.email === "user@company.com") {
        message.success("Đăng nhập thành công!");
        navigate("/dashboard"); // Chuyển hướng đến dashboard
      } else {
        throw new Error("Email không hợp lệ");
      }
    } catch (error) {
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: 300,
          padding: 24,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ textAlign: "center" }}>Login</h3>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
