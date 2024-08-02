import { Breadcrumb } from 'antd';
import { ResultEditTable } from './resultEditTable';
import { listRacers } from '../../actions/racer/listRacers';
import { listTeams } from '../../actions/team/listTeams';
import { CommonAlertProvider } from '../../common/components/commonAlertProvider';

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
      <CommonAlertProvider>
        <ResultEditTable teams={teams} racers={racers} />
      </CommonAlertProvider>
    </>
  );
}
