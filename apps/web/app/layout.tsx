'use client';
import './global.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout, Menu, MenuProps, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { useEffect, useState } from 'react';
import { Content, Footer } from 'antd/es/layout/layout';
import {
  EditOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  getItem('準備', '/prepare', <UnorderedListOutlined />, [
    getItem(
      <Link href="/prepare/events">大会</Link>,
      '/prepare/events',
      <UnorderedListOutlined />,
    ),
    getItem(
      <Link href="/prepare/teams">チーム</Link>,
      '/prepare/teams',
      <EditOutlined />,
    ),
    getItem(
      <Link href="/prepare/points">ポイント</Link>,
      '/prepare/points',
      <UnorderedListOutlined />,
    ),
  ]),
  getItem(<Link href="/input">入力</Link>, '/input', <EditOutlined />),
  getItem('結果', '/results', <UnorderedListOutlined />, [
    getItem(
      <Link href="/results/total">総合</Link>,
      '/results/total',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/ski/male">スキー男子</Link>,
      '/results/ski/male',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/ski/female">スキー女子</Link>,
      '/results/ski/female',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/snowboard/male">スノボ男子</Link>,
      '/results/snowboard/male',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/snowboard/female">スノボ女子</Link>,
      '/results/snowboard/female',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/junior">ジュニア</Link>,
      '/results/junior',
      <TeamOutlined />,
    ),
    getItem(
      <Link href="/results/senior">シニア</Link>,
      '/results/senior',
      <TeamOutlined />,
    ),
  ]),
];

export default function RootLayout({ children }: React.PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState('mail');
  const [openKeys, setOpenKeys] = useState<string[]>(['prepare']);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    setOpenKeys(openKeys);
  };

  const pathname = usePathname();

  useEffect(() => {
    const parts = pathname.split('/');

    // pathnameから最大２階層目までを取り出して選択中のメニューを設定
    const current =
      parts.length > 2 ? `/${parts[1]}/${parts[2]}` : `/${parts[1]}`;
    console.log(`current: ${current}`);
    setCurrent(current);

    // pathname から最大１階層目までを取り出してオープン中のメニューを設定
    const keyToOpen = parts.length > 1 ? `/${parts[1]}` : '';
    setOpenKeys([keyToOpen]);
  }, [pathname]);

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
                selectedKeys={[current]}
                openKeys={openKeys}
                mode="inline"
                items={items}
                onClick={onClick}
                onOpenChange={onOpenChange}
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
