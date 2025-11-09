import React from "react";
import { Layout, Avatar, Dropdown, MenuProps, Space } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import "./Topbar.css";

const { Header } = Layout;

interface TopbarProps {
  onLogout?: () => void;
  userName?: string;
  logoPath?: string;
}

const Topbar: React.FC<TopbarProps> = ({ onLogout, userName = "User", logoPath = "/vp_logo.png" }) => {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const items: MenuProps["items"] = [
    { key: "1", label: "Profile" },
    { key: "2", label: "Logout", onClick: onLogout },
  ];

  return (
    <Header className="topbar">
      <div className="topbar-left">
        <img src={logoPath} alt="Logo" className="topbar-logo" />
        <span className="topbar-title">IT Helpdesk</span>
      </div>
      <div className="topbar-right">
        <BellOutlined className="topbar-icon" />
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <Avatar className="topbar-avatar">{initials}</Avatar>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Topbar;
