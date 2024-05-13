import { prisma } from '@repo/database';
import { Prisma } from '@prisma/client';
import { TeamTable } from './teamTable';

async function getTeamsWithRacers() {
  const teams = await prisma.team.findMany({
    where: {
      eventId: '2023',
    },
    orderBy: {
      fullname: 'asc',
    },
    include: {
      racers: true,
    },
  });
  return teams;
}

export type TeamsWithRacers = Prisma.PromiseReturnType<
  typeof getTeamsWithRacers
>;

export async function PrepareTeamsPage() {
  const dataSource: TeamsWithRacers = await getTeamsWithRacers();
  return <TeamTable dataSource={dataSource} />;
}
