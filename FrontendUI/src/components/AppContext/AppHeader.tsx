import Menu from "antd/es/menu"
import Layout from "antd/es/layout"
import Typography from "antd/es/typography"
import { useLocation, useNavigate } from "react-router-dom"

const { Header } = Layout

export default function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  // Mapping pathname → key
  let selectedKey = ""
  if (location.pathname.startsWith("/tickets")) {
    selectedKey = "tickets"
  } else if (location.pathname.startsWith("/admin/tickets")) {
    selectedKey = "admin"
  }

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        height: 64,
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo / Title */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Typography.Title
          level={4}
          style={{
            color: "white",
            margin: 0,
            cursor: "pointer",
            fontWeight: 600,
          }}
          onClick={() => navigate("/tickets")}
        >
          Helpdesk Service
        </Typography.Title>
      </div>

      {/* Navigation menu */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={[
          { key: "tickets", label: "Danh sách yêu cầu của tôi" },
          { key: "admin", label: "Admin / Helpdesk" },
        ]}
        onClick={(e) => {
          if (e.key === "tickets") navigate("/tickets")
          if (e.key === "admin") navigate("/admin/tickets")
        }}
        style={{ minWidth: 400, justifyContent: "flex-end" }}
      />
    </Header>
  )
}