'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { StatusType } from '../../common/types';

/**
 * 結果の更新リクエストDTO
 */
export type UpdateResultRequestDto = {
  status1?: StatusType;
  status2?: StatusType;
  time1?: number | null;
  time2?: number | null;
};

/**
 * 結果の更新
 * @param id 競技者ID
 * @param dto 更新する結果情報
 * @returns 更新後の全選手情報
 */
export async function updateResult(
  id: string,
  dto: UpdateResultRequestDto,
): Promise<ActionResult<Racer[]>> {
  try {
    // 指定した選手のタイムと状態の更新
    const updateRacer = await prisma.racer.update({
      where: { id },
      data: {
        ...dto,
      },
    });

    // 指定した選手のベストタイムの更新
    await prisma.racer.update({
      where: { id },
      data: {
        bestTime: getBestTime(updateRacer),
      },
    });

    // 指定した選手が属する性別・カテゴリのポイントテーブルを取得
    const pointsOriginal = await prisma.point.findMany({
      select: {
        id: true,
        pointSkiFemale:
          updateRacer.gender === 'f' && updateRacer.category === 'ski',
        pointSkiMale:
          updateRacer.gender === 'm' && updateRacer.category === 'ski',
        pointSnowboardFemale:
          updateRacer.gender === 'f' && updateRacer.category === 'snowboard',
        pointSnowboardMale:
          updateRacer.gender === 'm' && updateRacer.category === 'snowboard',
      },
      orderBy: {
        id: 'asc',
      },
    });
    type Point = {
      id: number;
      point: number;
    };
    const points: Point[] = pointsOriginal.map((p) => {
      return {
        id: p.id,
        point:
          p.pointSkiFemale ??
          p.pointSkiMale ??
          p.pointSnowboardFemale ??
          p.pointSnowboardMale,
      };
    });

    // 全選手の個人成績(ポイントと総合順位)の更新
    const racers = await prisma.racer.findMany({
      where: {
        bib: { not: null },
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
    await Promise.all(
      racers.map(async (racer, i) => {
        // デフォルトは配列最後の値
        let point = points[points.length - 1].point;
        // ポイントがない場合、最後のポイントを取得
        if (i < points.length) {
          point = points[i].point;
        }
        if (racer.bestTime === null) {
          // if (typeof racer.bestTime !== 'number') {
          point = 0;
        }
        return await prisma.racer.update({
          where: { id: racer.id },
          data: { point, totalOrder: i + 1 },
        });
      }),
    );

    // 全選手の個人成績（特別ポイント）の更新
    const specialPoints = await prisma.specialPoint.findMany({});
    const specialRacers = await prisma.racer.findMany({
      where: {},
      orderBy: [
        {
          bestTime: 'desc',
        },
        {
          bib: 'asc',
        },
      ],
      take: 2,
    });
    await prisma.racer.updateMany({
      where: {},
      data: {
        specialPoint: 0,
      },
    });
    if (specialRacers.length >= 1) {
      await prisma.racer.update({
        where: { id: specialRacers[0].id },
        data: {
          specialPoint:
            specialPoints.find((point) => point.id === 'booby')?.point ?? 0,
        },
      });
    }
    if (specialRacers.length >= 2) {
      await prisma.racer.update({
        where: { id: specialRacers[1].id },
        data: {
          specialPoint:
            specialPoints.find((point) => point.id == 'booby_maker')?.point ??
            0,
        },
      });
    }
    // 最終的な全選手のデータを取得
    const allRacers = await prisma.racer.findMany({});
    return {
      success: true,
      result: allRacers,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '保存に失敗しました。指定したキーが見つかりません。',
        };
      }
    }
    throw e;
  }
}

/**
 * 一本目と二本目のタイムからベストタイムを取得
 * @param racer 対象の選手
 * @returns ベストタイム
 */
function getBestTime(racer: Racer): number | null {
  if (
    racer.status1 == null &&
    racer.time1 &&
    racer.status2 == null &&
    racer.time2
  ) {
    return Math.min(racer.time1, racer.time2);
  }
  if (
    racer.status1 == null &&
    racer.time1 &&
    (racer.status2 != null || !racer.time2)
  ) {
    return racer.time1;
  }
  if (
    (racer.status1 != null || !racer.time1) &&
    racer.status2 == null &&
    racer.time2
  ) {
    return racer.time2;
  }
  return null;
}
