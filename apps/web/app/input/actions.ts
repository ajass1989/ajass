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

export type UpdateStatusRequestDto = {
  status1?: StatusType;
  status2?: StatusType;
};

export async function updateStatus(
  id: string,
  dto: UpdateStatusRequestDto,
): Promise<ActionResult<Racer[]>> {
  try {
    // ステータスが文字列の場合、タイムをnullにする
    // それ以外の場合、タイムは変更しない
    const time1 = typeof dto.status1 === 'string' ? null : undefined;
    const time2 = typeof dto.status2 === 'string' ? null : undefined;
    await prisma.$transaction(async (tx) => {
      // タイムとステータスの更新
      let update1 = await tx.racer.update({
        where: { id },
        data: {
          ...dto,
          time1,
          time2,
        },
      });
      // ベストタイムの更新
      await tx.racer.update({
        where: { id },
        data: {
          bestTime: getBestTime(update1),
        },
      });
    });
    // 獲得ポイントの更新
    return {
      success: true,
      result: await updateRacersPoint(id),
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
  if (racer.time1 && racer.time2) {
    return Math.min(racer.time1, racer.time2);
  }
  if (racer.time1 && !racer.time2) {
    return racer.time1;
  }
  if (!racer.time1 && racer.time2) {
    return racer.time2;
  }
  return null;
}

async function updateRacersPoint(id: string): Promise<Racer[]> {
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
  return await Promise.all(
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
  );
}

export async function updateTime(
  id: string,
  dto: UpdateTimeRequestDto,
): Promise<ActionResult<Racer[]>> {
  try {
    const status1 = typeof dto.time1 === 'number' ? null : undefined;
    const status2 = typeof dto.time2 === 'number' ? null : undefined;
    await prisma.$transaction(async (tx) => {
      // タイムとステータスの更新
      let update1 = await tx.racer.update({
        where: { id },
        data: {
          ...dto,
          status1,
          status2,
        },
      });
      // ベストタイムの更新
      const bestTime = getBestTime(update1);
      await tx.racer.update({
        where: { id },
        data: {
          bestTime,
        },
      });
    });
    // 獲得ポイントの更新
    return {
      success: true,
      result: await updateRacersPoint(id),
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
