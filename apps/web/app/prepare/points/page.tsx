import { prisma } from '@repo/database';
import { PointTable } from './pointTable';
import { Tabs, TabsProps } from 'antd';
import { LineChartOutlined, TableOutlined } from '@ant-design/icons';
import { PointChart } from './pointChart';

export default async function PreparePointsPage() {
  const points = await prisma.point.findMany();

  const items: TabsProps['items'] = [
    {
      key: 'table',
      label: '表',
      icon: <TableOutlined />,
      children: <PointTable points={points} />,
    },
    {
      key: 'lineChart',
      label: 'グラフ',
      icon: <LineChartOutlined />,
      children: <PointChart points={points} />,
    },
  ];

  return (
    <div>
      <h1>ポイント</h1>
      <Tabs defaultActiveKey="table" type="card" items={items} />
    </div>
  );
}
