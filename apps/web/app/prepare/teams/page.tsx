import { Racer, Team, prisma } from '@repo/database';
import { Prisma } from '@prisma/client';
// import type { PrismaClient } from '@repo/database';
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
  // const users = await prisma.user.findMany({ include: { posts: true } });
  // return users;
  return teams;
}

export type TeamsWithRacers = Prisma.PromiseReturnType<
  typeof getTeamsWithRacers
>;

export default async function PrepareTeamsPage() {
  const dataSource: TeamsWithRacers = await getTeamsWithRacers();
  // const snowboardFemaleCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [
  //           { teamId: team.id },
  //           { category: 'snowboard' },
  //           { gender: 'f' },
  //           { special: 'normal' },
  //         ],
  //       },
  //     });
  //   }),
  // );
  // const snowboardMaleCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [
  //           { teamId: team.id },
  //           { category: 'snowboard' },
  //           { gender: 'm' },
  //           { special: 'normal' },
  //         ],
  //       },
  //     });
  //   }),
  // );
  // const skiFemaleCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [
  //           { teamId: team.id },
  //           { category: 'ski' },
  //           { gender: 'f' },
  //           { special: 'normal' },
  //         ],
  //       },
  //     });
  //   }),
  // );
  // const skiMaleCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [
  //           { teamId: team.id },
  //           { category: 'ski' },
  //           { gender: 'm' },
  //           { special: 'normal' },
  //         ],
  //       },
  //     });
  //   }),
  // );
  // const seniorCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [{ teamId: team.id }, { special: 'senior' }],
  //       },
  //     });
  //   }),
  // );
  // const juniorCounts = await Promise.all(
  //   dataSource.map(async (team) => {
  //     return await prisma.racer.count({
  //       where: {
  //         AND: [{ teamId: team.id }, { special: 'junior' }],
  //       },
  //     });
  //   }),
  // );

  // console.log(`snowboardMaleCounts: ${snowboardMaleCounts}`);
  // console.log(`seniorCounts: ${seniorCounts}`);
  return <TeamTable dataSource={dataSource} />;
}
