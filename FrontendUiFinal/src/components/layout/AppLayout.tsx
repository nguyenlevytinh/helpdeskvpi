import React from "react";
import { Layout } from "antd";
import Topbar from "./Topbar";
import Sidebar from "../layout/Sidebar";
import { Outlet } from "react-router-dom";
import layoutBg from "../../assets/layout-bg.png";
const { Content } = Layout;

const AppLayout: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Topbar />
      <Layout>
        <Sidebar />
        <Content
          style={{
            background: `url(${layoutBg}) no-repeat center/cover`,
            padding: 16,
            fontSize: 10,
            overflowY: "auto",
            height: "calc(100vh - 50px)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
