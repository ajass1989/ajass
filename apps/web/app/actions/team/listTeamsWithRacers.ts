'use server';
import { Racer, Team, prisma } from '@repo/database';

/**
 * チームに所属する選手情報を含むチーム情報
 */
export type TeamWithRacers = Team & {
  racers: Racer[];
};

/**
 * チーム一覧と所属する選手情報の取得
 * @returns チーム一覧と所属する選手情報
 */
export async function listTeamsWithRacers(): Promise<TeamWithRacers[]> {
  'use server';
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
  const ts = teams.map((team) => {
    const rs: Racer[] = team.racers.map((racer) => ({ ...racer }));
    const t = { ...team, racers: rs };
    return t;
  });
  return ts;
}
