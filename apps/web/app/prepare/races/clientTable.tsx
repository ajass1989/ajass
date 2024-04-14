'use client';
import { Race } from '@prisma/client';
import { Button, Table, TableProps } from 'antd';
import Link from 'next/link';

type Props = {
  dataSource: Race[];
};

interface DataType {
  key: React.Key;
  name: string; // 大会名
  date?: Date; // 開催日
  location?: string; // 開催地
  race?: string; // 競技
  setter?: string; // ポールセッター
  management?: string; // 幹事会社
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '大会名',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '開催日',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '開催地',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'ポールセッター',
    dataIndex: 'setter',
    key: 'setter',
  },
  {
    title: '幹事会社',
    dataIndex: 'management',
    key: 'management',
  },
];

export default async function ClientTable(props: Props) {
  const data: DataType[] = props.dataSource.map((d: Race) => ({
    key: d.id,
    name: d.name,
    date: d.date ?? undefined,
    location: d.location ?? undefined,
    race: d.race ?? undefined,
    setter: d.setter ?? undefined,
    management: d.management ?? undefined,
  }));

  return (
    <div>
      <h1>競技</h1>
      <Button type="primary">
        <Link href="/prepare/races/add">追加</Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
