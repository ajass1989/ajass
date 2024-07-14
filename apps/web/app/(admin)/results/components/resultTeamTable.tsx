'use client';
import { Table, TableColumnsType } from 'antd';
import { useState } from 'react';
import {
  getRowStyleByPoint,
  renderResult,
  renderTime,
  summaryWithoutSpecial,
} from '../../../common/racerUtil';
import { CategoryType, GenderType, SpecialType } from '../../../common/types';
import { RacerWithSummaryPoint } from '../../../actions/racer/listRacersWithSummaryPoint';
import { TeamWithPoint } from '../../../actions/team/listTeamsWithPoint';

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
  summary: string;
  name: string;
  kana: string;
  bib: string;
  gender: string;
  category: string;
  special: string;
  seed: number;
  result1: string;
  result2: string;
  bestTime: number | null;
  point: number;
  pointSummary: number;
  pointGetter: boolean;
  rowSpanSummary: number;
}

export function ResultTeamTable(props: Props) {
  const expandedRowRender = (record: TeamDataType) => {
    const columns: TableColumnsType<RacerDataType> = [
      {
        title: '種目',
        dataIndex: 'summary',
        key: 'summary',
        onCell: (record: RacerDataType) => {
          return { rowSpan: record.rowSpanSummary };
        },
      },
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
        render: (_: RacerDataType, record: RacerDataType) =>
          renderTime(record.bestTime),
      },
      { title: 'ポイント', dataIndex: 'point', key: 'point' },
      {
        title: '種目別ポイント',
        dataIndex: 'pointSummary',
        key: 'pointSummary',
        onCell: (record: RacerDataType) => {
          return { rowSpan: record.rowSpanSummary };
        },
      },
      {
        title: '特別ポイント',
        dataIndex: 'specialPoint',
        key: 'specialPoint',
      },
    ];

    // チームごとに選手を抽出
    const [racersByTeam] = useState<RacerWithSummaryPoint[]>(props.racers);

    const data: RacerDataType[] = racersByTeam
      .filter((racer) => racer.teamId === record.teamId)
      .map((racer) => {
        return {
          key: racer.id,
          summary: summaryWithoutSpecial(
            racer.gender as GenderType,
            racer.category as CategoryType,
          ),
          name: racer.name,
          kana: racer.kana,
          bib: racer.bib?.toString() ?? '',
          gender: racer.gender,
          category: racer.category,
          special: racer.special,
          seed: racer.seed,
          result1: renderResult(racer.status1, racer.time1),
          result2: renderResult(racer.status2, racer.time2),
          bestTime: racer.bestTime,
          point: racer.point,
          pointSummary: racer.summaryPoint,
          specialPoint: racer.specialPoint,
          pointGetter: racer.pointGetter,
          rowSpanSummary: racer.rowSpanSummary,
        };
      });
    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered={true}
        rowHoverable={false}
        onRow={(record) => {
          return {
            style: getRowStyleByPoint(
              record.gender as GenderType,
              record.category as CategoryType,
              record.special as SpecialType,
              record.pointGetter,
            ),
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
      bordered={true}
      rowHoverable={false}
    />
  );
}
