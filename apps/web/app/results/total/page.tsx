import { Breadcrumb } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import { listTeams } from '../../input/actions';
import { listRacers } from '../actions/actions';

export default async function ResultsTotalPage() {
  const teams = await listTeams();
  const racers = await listRacers({});
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: '総合',
          },
        ]}
      />
      <h1>総合</h1>
      <ResultViewTable teams={teams} racers={racers} showPoint={false} />
    </>
  );
}
