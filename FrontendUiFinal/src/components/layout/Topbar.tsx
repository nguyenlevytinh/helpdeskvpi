import React from "react";
import { Layout, Avatar, Dropdown, MenuProps } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import "./Topbar.css";

const { Header } = Layout;

interface TopbarProps {
  userName?: string;
  logoPath?: string;
}

const Topbar: React.FC<TopbarProps> = ({ userName = "User", logoPath = "/vp_logo.png" }) => {
  const { logout } = useAuth(); // Lấy hàm logout từ AuthContext
  const navigate = useNavigate(); // Hook để chuyển hướng
  const location = useLocation(); // Hook để lấy thông tin route hiện tại

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout(); // Gọi hàm logout
    navigate("/login"); // Chuyển hướng về trang Login
  };

  const items: MenuProps["items"] = [
    { key: "1", label: "Profile" },
    { key: "2", label: "Logout", onClick: handleLogout }, // Gọi handleLogout khi nhấn Logout
  ];

  // Ánh xạ route sang tiêu đề
  const pageTitles: { [key: string]: string } = {
    "/dashboard": "DASHBOARD",
    "/tickets": "DANH SÁCH TICKET",
    "/tickets/create": "TẠO MỚI TICKET",
  };

  // Lấy tiêu đề dựa trên route hiện tại
  let currentTitle = "IT HELPDESK SERVICE";

  if (location.pathname.startsWith("/tickets/") && location.pathname !== "/tickets/create") {
    currentTitle = "CHI TIẾT TICKET"; // Tiêu đề cho route động /tickets/:id
  } else {
    currentTitle = pageTitles[location.pathname] || "IT HELPDESK SERVICE";
  }

  return (
    <Header className="topbar">
      <div className="topbar-left">
        <img src={logoPath} alt="Logo" className="topbar-logo" />
        <span
          className="topbar-title"
          style={{
            marginLeft: "55px",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {currentTitle}
        </span>
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
