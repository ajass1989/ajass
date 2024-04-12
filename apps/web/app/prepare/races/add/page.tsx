'use client';
import { PrismaClient } from '@prisma/client';
import { Button, Table, TableProps } from 'antd';
const prisma = new PrismaClient();

interface DataType {
  key: React.Key;
  name: string; // 大会名
  date: string; // 開催日
  location: string; // 開催地
  race: string; // 競技
  setter: string; // ポールセッター
  management: string; // 幹事会社
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
    render: (text) => {
      return text;
    },
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

export default async function PrepareRacesPage() {
  const ddd = await prisma.race.findMany();
  const data: DataType[] = ddd.map((d) => ({
    key: d.id,
    name: d.name,
    date: d.date.toDateString(),
    location: d.location,
    race: d.race,
    setter: d.setter,
    management: d.management,
  }));

  return (
    <div>
      <h1>競技追加</h1>
    </div>
  );
}
