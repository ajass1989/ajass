import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';

export default async function ResultsJuniorPage() {
  const teams = await listTeams();
  const racers = await listRacers({ special: 'junior' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: 'ジュニア',
          },
        ]}
      />
      <h1>ジュニア</h1>
      <ResultViewTable teams={teams} racers={racers} showPoint={false} />
    </>
  );
}
