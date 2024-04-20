'use client';
import { Team } from '@repo/database';
import { Button, Popconfirm, Table, TableProps } from 'antd';
import Link from 'next/link';
import { deleteTeam } from './actions';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Props = {
  dataSource: Team[];
};

interface DataType {
  key: React.Key;
  fullname: string; // チーム名
  shortname: string; // 略称
}

export default function ClientTable(props: Props) {
  const [dataSource, setDataSource] = useState<Team[]>(props.dataSource);
  const searchParams = useSearchParams();

  const data: DataType[] = dataSource.map((d: Team) => ({
    key: d.id,
    fullname: d.fullname,
    shortname: d.shortname,
  }));
  const queryString = searchParams.get('newTeam');
  if (queryString) {
    const newTeam: Team = JSON.parse(queryString) as Team;
    const index = data.findIndex((item) => item.key === newTeam.id);
    // QueryStringからUpsert
    if (index !== -1) {
      data[index] = { ...data[index], ...newTeam };
    } else {
      data.push({
        key: newTeam.id,
        fullname: newTeam.fullname,
        shortname: newTeam.shortname,
      });
    }
  }

  const onDelete = async (key: React.Key) => {
    await deleteTeam(key as string);
    const newDataSource = dataSource.filter((item) => item.id != key);
    setDataSource(newDataSource);
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'チーム名',
      dataIndex: 'fullname',
      key: 'fullname',
      render: (_: any, record: DataType) => (
        <Link href={`/prepare/teams/${record.key}`}>{record.fullname}</Link>
      ),
    },
    {
      title: '略称',
      dataIndex: 'shortname',
      key: 'shortname',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataType) =>
        data.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => onDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div>
      <h1>チーム</h1>
      <Button type="primary">
        <Link href="/prepare/teams/add">追加</Link>
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
