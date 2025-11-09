import { Button, Dropdown, Menu } from 'antd';
import Avatar from 'antd/es/avatar';
import Typography from 'antd/es/typography';
import Layout from 'antd/es/layout';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { useAppContext } from '../components/AppContext';
import { useThemeContext } from './ThemeProvider';
import AppLoader from '../components/AppContext/AppLoader';
import SidePad from './SidePad';
import colors from './colors';

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { state: appState, logout } = useAppContext();
  const { state: themeState, setOpenSidePad } = useThemeContext();

  const { user } = appState;
  const { openSidePad } = themeState;

  const handleToggleMenu = () => setOpenSidePad(!openSidePad);
  const handleLogout = () => logout();

  const userMenu = (
    <Menu
      items={[
        { key: 'info', label: `${user?.fullName || 'Người dùng'}` },
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Đăng xuất',
          onClick: handleLogout,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Overlay Loading */}
      <AppLoader />

      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={!openSidePad}
        onCollapse={() => setOpenSidePad(!openSidePad)}
        width={220}
        style={{
          background: colors.PRIMARY,
          color: colors.TEXT_WHITE,
          position: 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
        }}
      >
        <LogoStl>
          <img src="/vp_logo.png" alt="Logo" style={{ height: 40 }} />
        </LogoStl>
        <SidePad />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: colors.PRIMARY,
            color: colors.TEXT_WHITE,
            padding: '0 16px',
          }}
        >
          {/* Nút toggle sidebar */}
          <Button
            type="text"
            icon={openSidePad ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
            onClick={handleToggleMenu}
            style={{ color: colors.TEXT_WHITE }}
          />

          {/* Tên ứng dụng */}
          <Typography.Title
            level={4}
            style={{
              color: colors.TEXT_WHITE,
              textTransform: 'uppercase',
              margin: 0,
              textAlign: 'center',
              flex: 1,
            }}
          >
            {appState.appName || 'IT Helpdesk System'}
          </Typography.Title>

          {/* User info + logout */}
          <Dropdown overlay={userMenu} placement="bottomRight">
            <UserInfoStl>
              <Avatar icon={<UserOutlined />} />
              <Typography.Text
                style={{
                  color: colors.TEXT_WHITE,
                  marginLeft: 8,
                }}
              >
                {user?.fullName || 'User'} ({user?.role || 'N/A'})
              </Typography.Text>
            </UserInfoStl>
          </Dropdown>
        </Header>

        {/* Nội dung chính */}
        <Content
          style={{
            padding: '16px 24px',
            background: '#fff',
            overflowY: 'auto',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

// ==== Styled Components ====
const LogoStl = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserInfoStl = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
