'use server';
import { Racer, prisma } from '@repo/database';

/**
 * 競技者一覧取得リクエストDTO
 */
export type ListRacersRequestDto = {
  gender?: 'f' | 'm';
  category?: 'ski' | 'snowboard';
  special?: 'normal' | 'junior' | 'senior';
  teamId?: string;
};

/**
 * 競技者データ型
 * 種目別ポイントを追加
 * ポイントゲッターかどうかを追加
 * 種目別にまとめるためのrowSpanを追加
 */
export type RacerWithTeam = Racer & {
  team: { fullname: string };
  ageHandicap: number | null;
  adoptTime: number | null;
};

/**
 * 競技者一覧取得
 * @param dto
 * @returns
 */
export async function listRacers(
  dto: ListRacersRequestDto,
): Promise<RacerWithTeam[]> {
  const racers = await prisma.racer.findMany({
    where: {
      ...dto,
    },
    include: {
      team: { select: { fullname: true } },
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
  const racers2 = racers.map((racer) => {
    return {
      ...racer,
      team: { fullname: racer.team?.fullname ?? '' },
      ageHandicap:
        racer.special === 'senior' ? -(racer.age! - 60) * 1000 : null,
      adoptTime:
        racer.special === 'senior' && racer.bestTime
          ? racer.bestTime - (racer.age! - 60) * 1000
          : null,
    };
  });
  // シニアの場合に限り、年齢補正タイムでソートする
  if (dto.special === 'senior') {
    return racers2.sort((a, b) => {
      if (!a.adoptTime || !b.adoptTime) {
        return -1;
      }
      if (!a.bib || !b.bib) {
        return -1;
      }
      if (a.adoptTime === b.adoptTime) {
        return a.bib - b.bib;
      }
      return a.adoptTime - b.adoptTime;
    });
  }

  return racers2;
}
