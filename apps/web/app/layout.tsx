'use client';
import './global.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Menu, MenuProps, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useState } from 'react';
import { Content, Footer } from 'antd/es/layout/layout';
import {
  EditOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('準備', 'settings', <UnorderedListOutlined />, [
    getItem(
      <Link href="/prepare/events">大会</Link>,
      '21',
      <UnorderedListOutlined />,
    ),
    getItem(<Link href="/prepare/teams">チーム</Link>, '22', <EditOutlined />),
    getItem(<Link href="/prepare/bibs">ビブ管理</Link>, '23', <EditOutlined />),
    getItem(
      <Link href="/prepare/points">ポイント</Link>,
      '24',
      <UnorderedListOutlined />,
    ),
  ]),
  getItem(<Link href="/input">結果入力</Link>, '01', <EditOutlined />),
  getItem('集計', 'summary', <UnorderedListOutlined />, [
    getItem(
      <Link href="/summary/individual">個人</Link>,
      '11',
      <TeamOutlined />,
    ),
    getItem(<Link href="/summary/team">団体</Link>, '12', <TeamOutlined />),
  ]),
];

export default function RootLayout({ children }: React.PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <html lang="ja">
      <body>
        <AntdRegistry>
          <Layout style={{ minHeight: '100vh' }}>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <div className="logo" />
              <Menu
                theme="dark"
                defaultSelectedKeys={['1']}
                mode="inline"
                items={items}
              />
            </Sider>
            <Layout>
              <Content style={{ margin: '0' }}>
                <div
                  style={{
                    padding: 24,
                    minHeight: 360,
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                  }}
                >
                  {children}
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
              </Footer>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
