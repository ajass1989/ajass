import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';

export default async function ResultsSkiFemalePage() {
  const teams = await listTeams();
  const racers = await listRacers({ gender: 'f', category: 'ski' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: 'スキー女子',
          },
        ]}
      />
      <h1>スキー女子</h1>
      <ResultViewTable teams={teams} racers={racers} />
    </>
  );
}
