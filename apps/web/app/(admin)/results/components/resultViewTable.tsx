'use client';
import { Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import {
  getRowStyle,
  renderResult,
  renderTime,
  summary,
} from '../../../common/racerUtil';
import { CategoryType, GenderType, SpecialType } from '../../../common/types';
import { RacerWithTeam } from '../../../actions/racer/listRacers';

type Props = {
  racers: RacerWithTeam[];
  showPoint?: boolean;
  showAge?: boolean;
  showTotalOrder?: boolean;
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
  team: { fullname: string };
  result1: string;
  result2: string;
  special: string;
  summary: string;
  bestTime: number | null;
  age: number | null;
  point: number | null;
}

export function ResultViewTable({
  racers,
  showPoint = true,
  showAge = false,
}: Props) {
  const [dataSource] = useState<RacerWithTeam[]>(racers);
  const data: DataType[] = dataSource.map((racer, index) => ({
    key: racer.id,
    id: racer.id,
    name: racer.name,
    kana: racer.kana,
    category: racer.category,
    bib: racer.bib,
    gender: racer.gender,
    seed: racer.seed,
    teamId: racer.teamId ?? '',
    team: { fullname: racer.team.fullname ?? '' },
    result1: renderResult(racer.status1, racer.time1),
    result2: renderResult(racer.status2, racer.time2),
    special: racer.special,
    summary: summary(
      racer.special as SpecialType,
      racer.gender as GenderType,
      racer.category as CategoryType,
    ),
    bestTime: racer.bestTime,
    age: racer.age,
    point: racer.point,
    order: racer.bestTime ? index + 1 : '',
  }));

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
      render: (_: DataType, record: DataType) => {
        return <span>{record.team.fullname}</span>;
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
      dataIndex: 'bestTime',
      key: 'bestTime',
      render: (_: DataType, record: DataType) => {
        return <span>{renderTime(record.bestTime)}</span>;
      },
      width: 128,
    },
    {
      title: '年齢',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      hidden: !showAge,
    },
    {
      title: '年齢補正',
      dataIndex: 'ageHandicap',
      key: 'ageHandicap',
      width: 128,
      hidden: !showAge,
      render: (_: DataType, record: DataType) => {
        return <span>-{renderTime((record.age! - 60) * 1000)}</span>;
      },
    },
    {
      title: '採用タイム',
      dataIndex: 'adoptTime',
      key: 'adoptTime',
      width: 128,
      hidden: !showAge,
      render: (_: DataType, record: DataType) => {
        return (
          <span>
            {record.bestTime
              ? renderTime(record.bestTime! - (record.age! - 60) * 1000)
              : ''}
          </span>
        );
      },
    },
    {
      title: '順位',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: 'ポイント',
      dataIndex: 'point',
      key: 'point',
      width: 80,
      hidden: !showPoint,
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      bordered={true}
      onRow={(record: DataType) => {
        return {
          style: getRowStyle(
            record.gender as GenderType,
            record.category as CategoryType,
            record.special as SpecialType,
          ),
        };
      }}
      sticky={true}
      rowHoverable={false}
    />
  );
}
