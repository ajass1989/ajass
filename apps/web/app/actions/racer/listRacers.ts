'use server';
import { Racer, prisma } from '@repo/database';

type ListRacersRequestDto = {
  gender?: 'f' | 'm';
  category?: 'ski' | 'snowboard';
  special?: 'normal' | 'junior' | 'senior';
};

/**
 * 競技者データ型
 * 種目別ポイントを追加
 * ポイントゲッターかどうかを追加
 * 種目別にまとめるためのrowSpanを追加
 */
export type RacerWithTeam = Racer & {
  team: { fullname: string };
};

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
  return racers.map((racer) => {
    return {
      ...racer,
      team: { fullname: racer.team?.fullname ?? '' },
    };
  });
}
