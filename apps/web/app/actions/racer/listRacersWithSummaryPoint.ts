import { Racer, prisma } from '@repo/database';

/**
 * 競技者データ型
 * 種目別ポイントを追加
 * ポイントゲッターかどうかを追加
 * 種目別にまとめるためのrowSpanを追加
 */
export type RacerWithSummaryPoint = Racer & {
  team: { fullname: string | null };
  summaryPoint: number;
  pointGetter: boolean;
  rowSpanSummary: number;
};

/**
 * 団体集計画面用のデータを取得
 * @returns
 */
export async function listRacersWithSummaryPoint(): Promise<
  RacerWithSummaryPoint[]
> {
  const teams = await prisma.team.findMany({});
  const racers = await Promise.all(
    teams.map(async (team) => {
      return await listRacersByTeam(team.id);
    }),
  );
  return racers.flat();
}

async function listRacersByTeam(
  teamId: string,
): Promise<RacerWithSummaryPoint[]> {
  const racers = await prisma.racer.findMany({
    where: {
      teamId,
    },
    include: {
      team: { select: { fullname: true } },
    },
  });
  // 種目ごとの人数をカウント
  const countSkiMale = racers.filter(
    (racer) => racer.gender === 'm' && racer.category === 'ski',
  ).length;
  const countSkiFemale = racers.filter(
    (racer) => racer.gender === 'f' && racer.category === 'ski',
  ).length;
  const countSnowboardMale = racers.filter(
    (racer) => racer.gender === 'm' && racer.category === 'snowboard',
  ).length;
  const countSnowboardFemale = racers.filter(
    (racer) => racer.gender === 'f' && racer.category === 'snowboard',
  ).length;

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
        team: { fullname: racer.team?.fullname ?? '' },
        summaryPoint: aggregatePoint(racers, racer.gender, racer.category),
        pointGetter: pointGetter,
      };
    })
    .map((racer, index: number) => {
      // 種目別にまとめるためのrowSpan
      // 各種目の先頭競技者のrowSpanを競技者数から算出して設定する。
      // その他の行のrowSpanは0とする。
      let rowSpanSummary = 0;
      if (
        racer.gender === 'm' &&
        racer.category === 'ski' &&
        !(
          racers[index - 1]?.gender === 'm' &&
          racers[index - 1]?.category === 'ski'
        )
      ) {
        rowSpanSummary = countSkiMale;
      }
      if (
        racer.gender === 'f' &&
        racer.category === 'ski' &&
        !(
          racers[index - 1]?.gender === 'f' &&
          racers[index - 1]?.category === 'ski'
        )
      ) {
        rowSpanSummary = countSkiFemale;
      }
      if (
        racer.gender === 'm' &&
        racer.category === 'snowboard' &&
        !(
          racers[index - 1]?.gender === 'm' &&
          racers[index - 1]?.category === 'snowboard'
        )
      ) {
        rowSpanSummary = countSnowboardMale;
      }
      if (
        racer.gender === 'f' &&
        racer.category === 'snowboard' &&
        !(
          racers[index - 1]?.gender === 'f' &&
          racers[index - 1]?.category === 'snowboard'
        )
      ) {
        rowSpanSummary = countSnowboardFemale;
      }
      return {
        ...racer,
        rowSpanSummary,
      };
    });
}

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
