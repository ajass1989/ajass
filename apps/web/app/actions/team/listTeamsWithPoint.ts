import { Racer, Team, prisma } from '@repo/database';

/**
 * 性別と競技で集計
 * @param racers
 * @param gender
 * @param category
 * @returns
 */
const aggregatePoint = (racers: Racer[], gender: string, category: string) => {
  let limit = 0;
  if (gender === 'm' && category === 'ski') limit = 5;
  if (gender === 'f' && category === 'ski') limit = 2;
  if (gender === 'm' && category === 'snowboard') limit = 2;
  if (gender === 'f' && category === 'snowboard') limit = 1;
  return racers
    .filter((racer) => racer.gender == gender && racer.category == category)
    .sort((a, b) => b.point - a.point)
    .slice(0, limit)
    .reduce((acc, racer) => acc + racer.point, 0);
};

/**
 * 特別ポイントの集計
 * @param racers 集計対象競技者一覧
 * @returns 特別ポイントの集計値
 */
const aggregateSpecialPoint = (racers: Racer[]) => {
  return racers.reduce((acc, racer) => acc + racer.specialPoint, 0);
};

/**
 * チーム情報とポイント
 */
export type TeamWithPoint = Team & { point: number };

/**
 * チーム一覧とポイントの取得
 * @returns チーム一覧とポイント
 */
export async function listTeamsWithPoint(): Promise<TeamWithPoint[]> {
  const teams = await prisma.team.findMany({
    include: {
      racers: true,
    },
  });
  return teams
    .map((team) => {
      return {
        ...team,
        point:
          aggregatePoint(team.racers, 'm', 'ski') +
          aggregatePoint(team.racers, 'f', 'ski') +
          aggregatePoint(team.racers, 'm', 'snowboard') +
          aggregatePoint(team.racers, 'f', 'snowboard') +
          aggregateSpecialPoint(team.racers),
      };
    })
    .sort((a, b) => b.point - a.point);
}
