import { Breadcrumb } from 'antd';
import { ResultEditTable } from './resultEditTable';
// import { listRacers } from './actions';
import { listTeams } from '../prepare/teams/actions';
import { listRacers } from '../results/actions/actions';

export default async function InputPage() {
  const teams = await listTeams();
  const racers = await listRacers({});
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '入力',
          },
        ]}
      />
      <h1>入力</h1>
      <ResultEditTable teams={teams} racers={racers} />
    </>
  );
}
