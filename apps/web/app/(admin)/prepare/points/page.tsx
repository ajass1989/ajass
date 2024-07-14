import { listPoints } from '../../../actions/point/getPoints';
import { PointTabs } from './pointTabs';

export default async function PreparePointsPage() {
  const points = await listPoints();
  return <PointTabs points={points} />;
}
