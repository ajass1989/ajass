import { Breadcrumb, Button, Flex } from 'antd';
import { ResultTeamTable } from '../components/resultTeamTable';
import { listRacersWithSummaryPoint } from '../../../actions/racer/listRacersWithSummaryPoint';
import Link from 'next/link';
import { listTeamsWithPoint } from '../../../actions/team/listTeamsWithPoint';

export default async function ResultsTeamPage() {
  const teams = await listTeamsWithPoint();
  const racers = await listRacersWithSummaryPoint();
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: '団体',
          },
        ]}
      />
      <h1>団体総合順位</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/team" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultTeamTable teams={teams} racers={racers} />
    </>
  );
}
