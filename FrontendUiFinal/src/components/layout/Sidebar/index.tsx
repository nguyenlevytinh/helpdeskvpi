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
import { Permissions } from "../../../context/permissions";
import { useAuth } from "../../../context/AuthContext";

const menuItemBg = "/menuitem-bg.png";
import "./Sidebar.css";

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const role = user?.role ?? "Guest";

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard", perm: "dashboard" },
    { key: "/tickets", icon: <FileTextOutlined />, label: "Quản lý Ticket", perm: "tickets" },
    { key: "/departments", icon: <ApartmentOutlined />, label: "Quản lý đơn vị", perm: "departments" },
    { key: "/reports", icon: <BarChartOutlined />, label: "Báo cáo", perm: "reports" },
    { key: "/settings", icon: <SettingOutlined />, label: "Cài đặt", perm: "settings" },
    { key: "/faq", icon: <QuestionCircleOutlined />, label: "FAQ", perm: "faq" },
  ];
  const handleNavigate = (e: any) => {
    navigate(e.key);
  }


  const allowedMenu = menuItems.filter(
    (item) => Permissions.menu[item.perm as keyof typeof Permissions.menu]?.includes(role)
  );
  

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={228}
      className="custom-sider"
    >
      <div
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          padding: "0px",
        }}
      >
        <Button
          type="text"
          icon={
            collapsed
              ? <MenuUnfoldOutlined style={{ color: "#fff" }} />
              : <MenuFoldOutlined style={{ color: "#fff" }} />
          }
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[location.pathname]}
        onClick={handleNavigate}
        items={allowedMenu.map(item => ({
          ...item,
          style: {
            backgroundImage: item.key === location.pathname ? "" : `url(${menuItemBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            margin: "8px 10px",
            borderRadius: 8,
          }
        }))}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;
