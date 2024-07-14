import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';
import Link from 'next/link';

export default async function ResultsSnowboardMalePage() {
  const teams = await listTeams();
  const racers = await listRacers({ gender: 'm', category: 'snowboard' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: 'スノボ男子',
          },
        ]}
      />
      <h1>スノボ男子</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/snowboardMale" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable teams={teams} racers={racers} />
    </>
  );
}
