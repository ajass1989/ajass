'use client';
import React from 'react';
import { Point } from '@repo/database';
import { Breadcrumb, Tabs, TabsProps } from 'antd';
import { LineChartOutlined, TableOutlined } from '@ant-design/icons';
import { PointChart } from './pointChart';
import { PointTable } from './pointTable';

type Props = {
  points: Point[];
};

export function PointTabs(props: Props) {
  const [points, setPoints] = React.useState<Point[]>(props.points);

  const updatePoint = (newData: Point) => {
    const newPoints = [...points];
    const index = points.findIndex((item) => newData.id === item.id);
    const item = points[index];
    newPoints.splice(index, 1, {
      ...item,
      ...newData,
    });
    setPoints(newPoints);
  };

  const items: TabsProps['items'] = [
    {
      key: 'table',
      label: '表',
      icon: <TableOutlined />,
      children: <PointTable points={points} updatePoint={updatePoint} />,
    },
    {
      key: 'lineChart',
      label: 'グラフ',
      icon: <LineChartOutlined />,
      children: <PointChart points={points} />,
    },
  ];

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '準備',
          },
          {
            title: 'ポイント',
          },
        ]}
      />
      <h1>ポイント</h1>
      <Tabs defaultActiveKey="table" type="card" items={items} />
    </>
  );
}
