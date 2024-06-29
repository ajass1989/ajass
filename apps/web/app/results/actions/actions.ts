import { Racer, Team, prisma } from '@repo/database';

type ListRacersRequestDto = {
  gender?: 'f' | 'm';
  category?: 'ski' | 'snowboard';
  special?: 'normal' | 'junior' | 'senior';
};
export async function listRacers(dto: ListRacersRequestDto): Promise<Racer[]> {
  return await prisma.racer.findMany({
    where: {
      // eventId: '2023',
      ...dto,
    },
    orderBy: [
      {
        bestTime: { sort: 'asc', nulls: 'last' },
      },
      {
        bib: 'desc', // タイムが同じ場合、bibの昇順
      },
    ],
  });
}

/**
 *
 * @param racers 性別と競技で集計
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

export type TeamWithPoint = Team & { point: number };

export async function listTeamsWithPoint(): Promise<TeamWithPoint[]> {
  const teams = await prisma.team.findMany({
    include: {
      racers: true,
    },
  });
  return teams
    .map((team) => {
      const pointSkiMale = aggregatePoint(team.racers, 'm', 'ski');
      const pointSkiFemale = aggregatePoint(team.racers, 'f', 'ski');
      const pointSnowboardMale = aggregatePoint(team.racers, 'm', 'snowboard');
      const pointSnowboardFemale = aggregatePoint(
        team.racers,
        'f',
        'snowboard',
      );
      return {
        ...team,
        point:
          pointSkiMale +
          pointSkiFemale +
          pointSnowboardMale +
          pointSnowboardFemale,
      };
    })
    .sort((a, b) => b.point - a.point);
}

/**
 * 競技者データ型
 * 競技別ポイントを追加
 * ポイントゲッターかどうかを追加
 * 競技別にまとめるためのrowSpanを追加
 */
export type RacerWithSummaryPoint = Racer & {
  summaryPoint: number;
  pointGetter: boolean;
  rowSpanSummary: number;
};

export async function listRacersWithSummaryPoint(): Promise<
  RacerWithSummaryPoint[]
> {
  const racers = await prisma.racer.findMany({
    where: {
      teamId: { not: null },
    },
  });
  let pointGetterSkiMale = 0;
  let pointGetterSkiFemale = 0;
  let pointGetterSnowboardMale = 0;
  let pointGetterSnowboardFemale = 0;
  return racers
    .sort((a, b) => {
      // ポイントでソート
      return b.point - a.point;
    })
    .sort((a, b) => {
      // 性別でソート
      if (a.gender < b.gender) return 1;
      if (a.gender > b.gender) return -1;
      return 0;
    })
    .sort((a, b) => {
      // 種目でソート
      if (a.category < b.category) return -1;
      if (a.category > b.category) return 1;
      return 0;
    })
    .map((racer) => {
      // ポイントゲッターかどうか
      let pointGetter = false;
      if (racer.gender === 'm' && racer.category === 'ski') {
        pointGetterSkiMale++;
        if (pointGetterSkiMale <= 5) pointGetter = true;
      }
      if (racer.gender === 'f' && racer.category === 'ski') {
        pointGetterSkiFemale++;
        if (pointGetterSkiFemale <= 2) pointGetter = true;
      }
      if (racer.gender === 'm' && racer.category === 'snowboard') {
        pointGetterSnowboardMale++;
        if (pointGetterSnowboardMale <= 2) pointGetter = true;
      }
      if (racer.gender === 'f' && racer.category === 'snowboard') {
        pointGetterSnowboardFemale++;
        if (pointGetterSnowboardFemale <= 1) pointGetter = true;
      }
      return {
        ...racer,
        summaryPoint: aggregatePoint(racers, racer.gender, racer.category),
        pointGetter: pointGetter,
      };
    })
    .map((racer, index: number) => {
      // 競技別にまとめるためのrowSpan
      let rowSpanSummary = 0;
      if (index === 0) rowSpanSummary = pointGetterSkiMale;
      if (index === pointGetterSkiMale) rowSpanSummary = pointGetterSkiFemale;
      if (index === pointGetterSkiMale + pointGetterSkiFemale)
        rowSpanSummary = pointGetterSnowboardMale;
      if (
        index ===
        pointGetterSkiMale + pointGetterSkiFemale + pointGetterSnowboardMale
      )
        rowSpanSummary = pointGetterSnowboardFemale;
      return {
        ...racer,
        rowSpanSummary,
      };
    });
}
