import { Link } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;

export default function LayoutComponent({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [current, serCurrent] = useState<{ name?: string }>({});

  const menuItems = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
      name: '',
    },
    {
      key: '2',
      icon: <UserAddOutlined />,
      label: <Link to="/character">人物列表</Link>,
      name: '人物列表',
    },
    {
      key: '3',
      icon: <UsergroupAddOutlined />,
      label: <Link to="/groups">人物分组</Link>,
      name: '人物分组',
    },
    {
      key: '4',
      icon: <UserSwitchOutlined />,
      label: <Link to="/relation">人物关系</Link>,
      name: '人物关系',
    },
  ];

  return (
    <Layout style={{ height: '100%' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
          onSelect={(data: any) => {
            serCurrent(menuItems[Number(data.key) - 1]);
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <div style={{ flex: 1 }} className="app-bar">
              人物关系网{current && current.name ? ` - ${current.name}` : ''}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
