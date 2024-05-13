import { Point, prisma } from '@repo/database';
import { PointTable } from './pointTable';
import { Tabs, TabsProps } from 'antd';
import { LineChartOutlined, TableOutlined } from '@ant-design/icons';
import { PointChart } from './pointChart';

export async function PreparePointsPage() {
  const points = await getPoints();

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

export async function getPoints(): Promise<Point[]> {
  return await prisma.point.findMany();
}
