'use client';

import { Racer } from '@prisma/client';
import { Table } from 'antd';
import { useState } from 'react';
import { renderResult, renderTime, summary } from '../../../common/racerUtil';
import { CategoryType, GenderType, SpecialType } from '../../../common/types';

type Props = {
  racers: Racer[];
};

interface DataType {
  key: string;
  id: string;
  name: string;
  kana: string;
  category: string;
  bib: number | null;
  gender: string;
  seed: number;
  teamId: string;
  status1: string;
  formatTime1: string;
  status2: string;
  formatTime2: string;
  special: string;
  summary: string;
  formatBestTime: string;
  age: number | null;
}

const columns = [
  {
    title: '種目',
    dataIndex: 'summary',
    key: 'summary',
  },
  {
    title: 'ビブ',
    dataIndex: 'bib',
    key: 'bib',
  },
  {
    title: 'シード',
    dataIndex: 'seed',
    key: 'seed',
  },
  {
    title: '選手名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'ふりがな',
    dataIndex: 'kana',
    key: 'kana',
  },
  {
    title: '所属',
    dataIndex: 'teamId',
    render: (_: any, record: DataType) => {
      return <span></span>;
    },
    key: 'teamId',
  },
  {
    title: '記録1',
    dataIndex: 'formatTime1',
    key: 'formatTime1',
  },
  {
    title: '記録2',
    dataIndex: 'formatTime2',
    key: 'formatTime2',
  },
  {
    title: 'ベスト',
    dataIndex: 'formatBestTime',
    key: 'formatBestTime',
  },
];

export function ResultViewTable(props: Props) {
  const [dataSource, setDataSource] = useState<Racer[]>(props.racers);
  const data: DataType[] = dataSource.map((racer) => ({
    key: racer.id,
    id: racer.id,
    name: racer.name,
    kana: racer.kana,
    category: racer.category,
    bib: racer.bib,
    gender: racer.gender,
    seed: racer.seed,
    teamId: racer.teamId ?? '',
    status1: racer.status1 ?? '',
    time1: racer.time1 ?? '',
    formatTime1: renderResult(racer.status1, racer.time1),
    status2: racer.status2 ?? '',
    time2: racer.time2 ?? '',
    formatTime2: renderResult(racer.status2, racer.time2),
    special: racer.special,
    summary: summary(
      racer.special as SpecialType,
      racer.gender as GenderType,
      racer.category as CategoryType,
    ),
    formatBestTime: renderTime(racer.bestTime),
    age: racer.age,
  }));
  // .sort((a, b) => {
  //   // ベストタイムでソート
  //   // return a.bestTime - b.bestTime;
  // });

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        sticky={true}
      />
    </>
  );
}
