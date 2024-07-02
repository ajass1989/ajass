'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../common/actionResult';
import { StatusType } from '../common/types';

export async function updateBib(
  dto: UpdateBibRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const newValue = await prisma.racer.update({
      where: { id: dto.id },
      data: { bib: dto.bib },
    });
    return {
      success: true,
      result: newValue,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '保存に失敗しました。指定したキーが見つかりません。',
        };
      }
      if (e.code === 'P2002') {
        return {
          success: false,
          error: '保存に失敗しました。ビブが重複しています。',
        };
      }
    }
    throw e;
  }
}

export type UpdateBibRequestDto = {
  id: string;
  bib: number | null;
};

export async function updateBibs(
  dtos: UpdateBibRequestDto[],
): Promise<ActionResult<Racer[]>> {
  try {
    let newValues: Racer[] = [];
    await prisma.$transaction(async (tx) => {
      await tx.racer.updateMany({
        data: { bib: null },
      });
      const promises = dtos.map(async (dto: UpdateBibRequestDto) => {
        const newValue = await tx.racer.update({
          where: { id: dto.id },
          data: { bib: dto.bib },
        });
        return newValue;
      });
      newValues = await Promise.all(promises);
    });
    return {
      success: true,
      result: newValues,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '保存に失敗しました。指定したキーが見つかりません。',
        };
      }
      if (e.code === 'P2002') {
        return {
          success: false,
          error: '保存に失敗しました。ビブが重複しています。',
        };
      }
    }
    throw e;
  }
}

export async function updateRacersPoints(): Promise<ActionResult<Racer[]>> {
  try {
    const racersBefore = await prisma.racer.findMany({
      where: {
        bib: { not: null },
      },
    });
    const promises = racersBefore.map(async (racer) => {
      await updateRacersPoint(racer.id);
    });
    await Promise.all(promises);
    //
    const racersAfter = await prisma.racer.findMany({
      where: {
        bib: { not: null },
      },
    });
    return {
      success: true,
      result: racersAfter,
    };
  } catch (e) {
    return {
      success: false,
      error: 'ポイントの更新に失敗しました。',
    };
  }
}

export type UpdateStatusRequestDto = {
  status1?: StatusType;
  status2?: StatusType;
};

export async function updateStatus(
  id: string,
  dto: UpdateStatusRequestDto,
): Promise<ActionResult<Racer[]>> {
  try {
    const racer = await prisma.$transaction(async (tx) => {
      // タイムとステータスの更新
      const update1 = await tx.racer.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      // ベストタイムの更新
      return await tx.racer.update({
        where: { id },
        data: {
          bestTime: getBestTime(update1),
        },
      });
    });
    // 獲得ポイントの更新
    return {
      success: true,
      result: [racer],
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

export type UpdateTimeRequestDto = {
  time1?: number | null;
  time2?: number | null;
};

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

export async function updateRacersPoint(
  id: string,
): Promise<ActionResult<Racer[]>> {
  // タイム更新対象のレーサーを取得
  const racer = await prisma.racer.findUniqueOrThrow({
    where: {
      id,
    },
  });
  // タイム更新対象と同じ性別・カテゴリのレーサー群をベストタイム順にソートして取得
  const racers = await prisma.racer.findMany({
    where: {
      gender: racer.gender,
      category: racer.category,
      bib: { not: null },
      teamId: { not: null },
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

  // 特別ポイントを取得
  const specialPoints = await prisma.specialPoint.findMany({});

  // 特別ポイントを適用
  const specialRacers = await prisma.racer.findMany({
    where: {
      teamId: { not: null },
      bestTime: { not: null },
    },
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
          specialPoints.find((point) => point.id == 'booby_maker')?.point ?? 0,
      },
    });
  }

  // ポイントを取得
  const points = await prisma.point.findMany({
    select: {
      id: true,
      pointSkiFemale: racer.gender === 'f' && racer.category === 'ski',
      pointSkiMale: racer.gender === 'm' && racer.category === 'ski',
      pointSnowboardFemale:
        racer.gender === 'f' && racer.category === 'snowboard',
      pointSnowboardMale:
        racer.gender === 'm' && racer.category === 'snowboard',
    },
    orderBy: {
      id: 'asc',
    },
  });
  type Point = {
    id: number;
    point: number;
  };
  const points2: Point[] = points.map((p) => {
    return {
      id: p.id,
      point:
        p.pointSkiFemale ??
        p.pointSkiMale ??
        p.pointSnowboardFemale ??
        p.pointSnowboardMale,
    };
  });

  // ポイントを更新
  return {
    success: true,
    result: await Promise.all(
      racers.map(async (racer, i) => {
        // デフォルトは配列最後の値
        let point = points2[points2.length - 1].point;
        // ポイントがない場合、最後のポイントを取得
        if (i < points2.length) {
          point = points2[i].point;
        }
        if (typeof racer.bestTime !== 'number') {
          point = 0;
        }
        return await prisma.racer.update({
          where: { id: racer.id },
          data: { point },
        });
      }),
    ),
  };
}

export async function updateTime(
  id: string,
  dto: UpdateTimeRequestDto,
): Promise<ActionResult<Racer[]>> {
  try {
    const racer = await prisma.$transaction(async (tx) => {
      // タイムとステータスの更新
      const update1 = await tx.racer.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      // ベストタイムの更新
      const bestTime = getBestTime(update1);
      return await tx.racer.update({
        where: { id },
        data: {
          bestTime,
        },
      });
    });
    // 獲得ポイントの更新
    return {
      success: true,
      result: [racer],
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

export async function listRacers(): Promise<Racer[]> {
  return await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
}

export async function listTeams(): Promise<Team[]> {
  return await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
}
