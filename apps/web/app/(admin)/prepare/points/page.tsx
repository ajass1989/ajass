import { listPoints } from '../../../actions/point/listPoints';
import { PointTabs } from './pointTabs';

export default async function PreparePointsPage() {
  const points = await listPoints();
  return <PointTabs points={points} />;
}
