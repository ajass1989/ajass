'use client';

import { Racer, Team } from '@prisma/client';
import { Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import {
  getRowStyle,
  renderResult,
  renderTime,
  summary,
} from '../../common/racerUtil';
import { CategoryType, GenderType, SpecialType } from '../../common/types';

type Props = {
  teams: Team[];
  racers: Racer[];
};

// テーブル表示用のデータ型
interface DataType {
  key: string;
  id: string;
  name: string;
  kana: string;
  category: string; // ski, snowboard
  bib: number | null;
  gender: string; // f, m
  seed: number;
  teamId: string;
  result1: string;
  result2: string;
  special: string;
  summary: string;
  formatBestTime: string;
  age: number | null;
  point: number | null;
}

export function ResultViewTable(props: Props) {
  const [dataSource] = useState<Racer[]>(props.racers);
  const data: DataType[] = dataSource
    .map((racer) => ({
      key: racer.id,
      id: racer.id,
      name: racer.name,
      kana: racer.kana,
      category: racer.category,
      bib: racer.bib,
      gender: racer.gender,
      seed: racer.seed,
      teamId: racer.teamId ?? '',
      result1: renderResult(racer.status1, racer.time1),
      result2: renderResult(racer.status2, racer.time2),
      special: racer.special,
      summary: summary(
        racer.special as SpecialType,
        racer.gender as GenderType,
        racer.category as CategoryType,
      ),
      formatBestTime: renderTime(racer.bestTime),
      age: racer.age,
      point: racer.point,
    }))
    .sort((a, b) => {
      // ポイントでソート
      return a.point - b.point;
    });

  const columns: TableColumnsType<DataType> = [
    {
      title: '種目',
      dataIndex: 'summary',
      key: 'summary',
      width: 104,
      responsive: ['lg'],
    },
    {
      title: 'ビブ',
      dataIndex: 'bib',
      key: 'bib',
      width: 96,
    },
    {
      title: 'シード',
      dataIndex: 'seed',
      key: 'seed',
      width: 80,
      responsive: ['lg'],
    },
    {
      title: '選手名',
      dataIndex: 'name',
      key: 'name',
      width: 96,
    },
    {
      title: 'ふりがな',
      dataIndex: 'kana',
      key: 'kana',
      responsive: ['lg'],
      width: 96,
    },
    {
      title: '所属',
      dataIndex: 'team',
      render: (_: any, record: DataType) => {
        return (
          <span>
            {props.teams.find((item: Team) => item.id == record.teamId)
              ?.fullname ?? ''}
          </span>
        );
      },
      key: 'team',
      responsive: ['lg'],
      width: 128,
    },
    {
      title: '結果1',
      dataIndex: 'result1',
      key: 'result1',
      width: 128,
    },
    {
      title: '結果2',
      dataIndex: 'result2',
      key: 'result2',
      width: 128,
    },
    {
      title: 'ベスト',
      dataIndex: 'formatBestTime',
      key: 'formatBestTime',
      width: 128,
    },
    {
      title: 'ポイント',
      dataIndex: 'point',
      key: 'point',
      width: 80,
    },
  ];

  return (
    <>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        onRow={(record: DataType) => {
          return {
            style: getRowStyle(record.summary),
          };
        }}
        sticky={true}
      />
    </>
  );
}