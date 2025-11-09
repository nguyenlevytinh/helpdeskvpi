// Removed invalid import for App from "antd"
import Layout from "antd/es/layout"
import ConfigProvider from "antd/es/config-provider"
import "antd/dist/reset.css"
import { BrowserRouter } from "react-router-dom"

import AppHeader from "./components/AppContext/AppHeader"
import AppRoutes from "./routes.tsx"

const { Content } = Layout

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      {/* Removed AntApp wrapper as it does not exist */}
        <BrowserRouter>
          <Layout style={{ minHeight: "100vh" }}>
            <AppHeader />
            <Content style={{ padding: "24px 32px" }}>
              <div className="container">
                <AppRoutes />
              </div>
            </Content>
          </Layout>
        </BrowserRouter>
      {/* Removed AntApp closing tag */}
    </ConfigProvider>
  )
}