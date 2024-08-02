import { listPoints } from '../../../actions/point/listPoints';
import { CommonAlertProvider } from '../../../common/components/commonAlertProvider';
import { PointTabs } from './pointTabs';

export default async function PreparePointsPage() {
  const points = await listPoints();
  return (
    <CommonAlertProvider>
      <PointTabs points={points} />
    </CommonAlertProvider>
  );
}
