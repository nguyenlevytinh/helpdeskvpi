import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, message, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    const success = await login(values.email);
    setLoading(false);

    if (success) {
      message.success("Đăng nhập thành công!");
      navigate("/tickets");
    } else {
      message.error("Email không hợp lệ. Vui lòng thử lại!");
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
          IT Helpdesk Login
        </Title>
        <Form name="loginForm" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="example@company.com" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
