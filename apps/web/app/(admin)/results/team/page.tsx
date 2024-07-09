import { Breadcrumb } from 'antd';
import { ResultTeamTable } from '../components/resultTeamTable';
import {
  listRacersWithSummaryPoint,
  listTeamsWithPoint,
} from '../actions/actions';

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
      <ResultTeamTable teams={teams} racers={racers} />
    </>
  );
}
