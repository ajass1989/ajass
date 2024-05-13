import { Racer, Team, prisma } from '@repo/database';
import { BibTable } from './bibTable';

export async function PrepareRacersPage() {
  const racers = await getRacers();
  const teams = await getTeams();
  return <BibTable racers={racers} teams={teams} />;
}

async function getRacers(): Promise<Racer[]> {
  return await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
}

async function getTeams(): Promise<Team[]> {
  return await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
}
