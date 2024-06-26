import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';

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
      <ResultViewTable teams={teams} racers={racers} />
    </>
  );
}
