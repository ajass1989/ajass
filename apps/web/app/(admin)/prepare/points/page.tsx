import { getPoints } from '../../../actions/point/getPoints';
import { PointTabs } from './pointTabs';

export default async function PreparePointsPage() {
  const points = await getPoints();
  return <PointTabs points={points} />;
}
