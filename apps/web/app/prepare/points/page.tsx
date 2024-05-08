import { prisma } from '@repo/database';
import { PointTable } from './pointTable';

export default async function PreparePointsPage() {
  const points = await prisma.point.findMany();

  return (
    <div>
      <h1>ポイント</h1>
      <PointTable points={points} />
    </div>
  );
}
