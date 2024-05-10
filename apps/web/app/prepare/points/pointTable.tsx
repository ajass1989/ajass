'use client';
import { Point } from '@repo/database';
import { Table } from 'antd';
import { useState } from 'react';

type Props = {
  points: Point[];
};

type EditableTableProps = Parameters<typeof Table>[0];
interface DataType {
  key: number;
  pointSkiMale: number;
  pointSkiFemale: number;
  pointSnowboardMale: number;
  pointSnowboardFemale: number;
}
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

export function PointTable(props: Props) {
  const [dataSource, setDataSource] = useState<Point[]>(props.points);
  const data: DataType[] = dataSource.map((point: Point) => {
    return {
      key: point.id,
      pointSkiMale: point.pointSkiMale,
      pointSkiFemale: point.pointSkiFemale,
      pointSnowboardMale: point.pointSnowboardMale,
      pointSnowboardFemale: point.pointSnowboardFemale,
    };
  });

  const columns: ColumnTypes[number][] = [
    {
      title: '順位',
      dataIndex: 'key',
    },
    {
      title: 'スキー男子',
      dataIndex: 'pointSkiMale',
    },
    {
      title: 'スキー女子',
      dataIndex: 'pointSkiFemale',
    },
    {
      title: 'スノーボード男子',
      dataIndex: 'pointSnowboardMale',
    },
    {
      title: 'スノーボード女子',
      dataIndex: 'pointSnowboardFemale',
    },
  ];

  return <Table columns={columns as ColumnTypes} dataSource={data} />;
}
