import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';

export default async function ResultsSnowboardFemalePage() {
  const teams = await listTeams();
  const racers = await listRacers({ gender: 'f', category: 'snowboard' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: 'スノボ女子',
          },
        ]}
      />
      <h1>スノボ女子</h1>
      <ResultViewTable teams={teams} racers={racers} />
    </>
  );
}
