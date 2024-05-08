import { prisma } from '@repo/database';
import { BibTable } from './bibTable';

export default async function PrepareRacersPage() {
  const racers = await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
  const teams = await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
  return <BibTable racers={racers} teams={teams} />;
}
