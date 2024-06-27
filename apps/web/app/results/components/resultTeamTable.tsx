'use client';

import { Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import {
  getRowStyle,
  renderResult,
  renderTime,
  summaryWithoutSpecial,
} from '../../common/racerUtil';
import { CategoryType, GenderType } from '../../common/types';
import { RacerWithSummaryPoint, TeamWithPoint } from '../actions/actions';

type Props = {
  teams: TeamWithPoint[];
  racers: RacerWithSummaryPoint[];
};

interface TeamDataType {
  key: string;
  fullname: string;
  teamId: string;
  point: number;
  order: number;
}

interface RacerDataType {
  key: React.Key;
  // id: string;
  summary: string;
  name: string;
  kana: string;
  bib: string;
  gender: string;
  category: string;
  seed: number;
  result1: string;
  result2: string;
  bestTime: number | null;
  point: number;
  pointSummary: number;
}

export function ResultTeamTable(props: Props) {
  const expandedRowRender = () => {
    const columns: TableColumnsType<RacerDataType> = [
      { title: '種目', dataIndex: 'summary', key: 'summary' },
      { title: '選手名', dataIndex: 'name', key: 'name' },
      { title: 'ふりがな', dataIndex: 'kana', key: 'kana' },
      { title: 'ビブ', dataIndex: 'bib', key: 'bib' },
      { title: 'シード', dataIndex: 'seed', key: 'seed' },
      { title: '記録1', dataIndex: 'result1', key: 'result1' },
      { title: '記録2', dataIndex: 'result2', key: 'result2' },
      {
        title: 'ベストタイム',
        dataIndex: 'bestTime',
        key: 'bestTime',
        render: (_: any, record: RacerDataType) => renderTime(record.bestTime),
      },
      { title: 'ポイント', dataIndex: 'point', key: 'point' },
      {
        title: '競技別ポイント',
        dataIndex: 'pointSummary',
        key: 'pointSummary',
      },
      {
        title: '特別ポイント',
        dataIndex: 'pointSpecial',
        key: 'pointSpecial',
      },
    ];

    // チームごとに選手を抽出
    const [racersByTeam] = useState<RacerWithSummaryPoint[]>(props.racers);

    const data = racersByTeam.map((racer) => {
      return {
        key: racer.id,
        summary: summaryWithoutSpecial(
          racer.gender as GenderType,
          racer.category as CategoryType,
        ),
        name: racer.name,
        kana: racer.kana,
        bib: racer.bib!.toString() ?? '',
        gender: racer.gender,
        category: racer.category,
        seed: racer.seed,
        result1: renderResult(racer.status1, racer.time1),
        result2: renderResult(racer.status2, racer.time2),
        bestTime: racer.bestTime,
        point: racer.point,
        pointSummary: racer.summaryPoint,
        pointSpecial: 0, // TODO 特別ポイント計算
      };
    });
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        onRow={(record: any) => {
          return {
            style: getRowStyle(record.summary),
          };
        }}
      />
    );
  };

  const columns: TableColumnsType<TeamDataType> = [
    { title: 'チーム名', dataIndex: 'fullname', key: 'fullname' },
    { title: '団体ポイント', dataIndex: 'point', key: 'point' },
    { title: '団体順位', dataIndex: 'order', key: 'order' },
  ];

  const [teamDataSource] = useState<TeamWithPoint[]>(props.teams);
  const data: TeamDataType[] = teamDataSource.map((team, index) => ({
    key: team.id,
    fullname: team.fullname,
    teamId: team.id,
    point: team.point,
    order: index + 1,
  }));
  return (
    <Table
      columns={columns}
      expandable={{ expandedRowRender, defaultExpandAllRows: true }}
      dataSource={data}
      pagination={false}
    />
  );
}
