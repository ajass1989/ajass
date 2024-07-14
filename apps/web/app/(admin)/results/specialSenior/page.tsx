import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';
import Link from 'next/link';

export default async function ResultsSeniorPage() {
  const teams = await listTeams();
  const racers = await listRacers({ special: 'senior' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: 'シニア',
          },
        ]}
      />
      <h1>シニア</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/specialSenior" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable
        teams={teams}
        racers={racers}
        showPoint={false}
        showAge={true}
      />
    </>
  );
}