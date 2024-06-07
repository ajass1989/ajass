'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../common/actionResult';
import { StatusType } from '../common/types';

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
): Promise<ActionResult<Racer>> {
  try {
    // ステータスが文字列の場合、タイムをnullにする
    // それ以外の場合、タイムは変更しない
    const time1 = typeof dto.status1 === 'string' ? null : undefined;
    const time2 = typeof dto.status2 === 'string' ? null : undefined;
    const r = await prisma.$transaction(async (tx) => {
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
      let update2 = await tx.racer.update({
        where: { id },
        data: {
          bestTime: getBestTime(update1),
        },
      });
      return update2;
    });
    return {
      success: true,
      result: r,
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

export async function updateTime(
  id: string,
  dto: UpdateTimeRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const status1 = typeof dto.time1 === 'number' ? null : undefined;
    const status2 = typeof dto.time2 === 'number' ? null : undefined;
    const r = await prisma.$transaction(async (tx) => {
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
      let update2 = await tx.racer.update({
        where: { id },
        data: {
          bestTime: getBestTime(update1),
        },
      });
      return update2;
    });
    return {
      success: true,
      result: r,
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
