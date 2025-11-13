import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  ApartmentOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Permissions } from "../../context/permissions";
import { useAuth } from "../../context/AuthContext";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy user & role từ AuthContext
  const { user } = useAuth();
  const role = user?.role ?? "Guest";

  const menuItems: { key: string; icon: React.ReactNode; label: string; perm: keyof typeof Permissions.menu }[] = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", perm: "dashboard" },
    { key: "/tickets", icon: <FileTextOutlined />, label: "Quản lý Ticket", perm: "tickets" },
    { key: "/departments", icon: <ApartmentOutlined />, label: "Quản lý đơn vị", perm: "departments" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Báo cáo", perm: "reports" },
    { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt", perm: "settings" },
    { key: "/faq", icon: <QuestionCircleOutlined />, label: "FAQ", perm: "faq" },
  ];

  // Filter item theo role
  const allowedMenu = menuItems.filter(
    (item) => Permissions.menu[item.perm]?.includes(role)
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={228}
      style={{
        background: "#fff",
        height: "calc(100vh - 50px)",
        borderRight: "1px solid #f0f0f0",
      }}
    >
      {/* Nút collapsed */}
      <div
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          alignItems: "center",
          padding: "10px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Button
          type="text"
          icon={
            collapsed
              ? <MenuUnfoldOutlined style={{ color: "#000" }} />
              : <MenuFoldOutlined style={{ color: "#000" }} />
          }
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu items đã phân quyền */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={allowedMenu}
        onClick={(item) => navigate(item.key)}
        style={{ fontSize: 10, height: "100%" }}
      />
    </Sider>
  );
};

export default Sidebar;
