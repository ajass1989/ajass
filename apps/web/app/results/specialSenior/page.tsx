import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../prepare/teams/actions';
import { listRacers } from '../actions/actions';

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
      <ResultViewTable teams={teams} racers={racers} />
    </>
  );
}
