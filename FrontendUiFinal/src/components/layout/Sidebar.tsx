import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "/tickets", icon: <FileTextOutlined />, label: "Quản lý Ticket" },
    { key: "/departments", icon: <ApartmentOutlined />, label: "Quản lý đơn vị" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Báo cáo" },
    { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt" },
    { key: "/faq", icon: <QuestionCircleOutlined />, label: "FAQ" },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={228}
      style={{
        background: "#fff",
        height: "calc(100vh - 50px)",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={(item) => navigate(item.key)}
        style={{ fontSize: 10, height: "100%" }}
      />
    </Sider>
  );
};

export default Sidebar;
