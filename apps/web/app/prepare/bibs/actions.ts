'use server';
import { Prisma, Racer, Result, Team, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { ActionResult } from '../../actionResult';

export type UpdateBibRequestDto = {
  id: string;
  bib: number | null;
};

export async function updateBibs(
  dto: UpdateBibRequestDto[],
): Promise<ActionResult<Racer[]>> {
  try {
    let newValues: Racer[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const promises = dto.map(async (param: UpdateBibRequestDto) => {
        const newValue = await prisma.racer.update({
          where: { id: param.id },
          data: { bib: param.bib },
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
        console.error(e);
        return {
          success: false,
          error: '保存に失敗しました。ビブが重複しています。',
        };
      }
    }
    throw e;
  }
}

export type UpdateResultStatusRequestDto = {
  racerId: string;
  set: number;
  status: string;
};

export async function updateResultStatus(
  dto: UpdateResultStatusRequestDto,
): Promise<ActionResult<Result>> {
  try {
    console.log(`updateResultStatus: dto: ${JSON.stringify(dto)}`);
    const r = await prisma.$transaction(async (prisma: PrismaClient) => {
      let r = await prisma.result.update({
        where: {
          set_racerId: {
            racerId: dto.racerId,
            set: dto.set,
          },
        },
        data: {
          status: dto.status,
        },
      });
      console.log(`updateResultStatus: r1: ${JSON.stringify(r)}`);
      if (dto.status !== '') {
        // ステータスに応じてタイムをクリアする
        r = await prisma.result.update({
          where: {
            set_racerId: {
              racerId: dto.racerId,
              set: dto.set,
            },
          },
          data: {
            time: null,
          },
        });
        console.log(`updateResultStatus: r2: ${JSON.stringify(r)}`);
      }
      return r;
    });
    console.log(`updateResultStatus: r: ${JSON.stringify(r)}`);
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

export type UpdateResultTimeRequestDto = {
  racerId: string;
  set: number;
  time: number | null;
};

export async function updateResultTime(
  dto: UpdateResultTimeRequestDto,
): Promise<ActionResult<Result>> {
  try {
    const r = await prisma.$transaction(async (prisma: PrismaClient) => {
      let r = await prisma.result.update({
        where: {
          set_racerId: {
            racerId: dto.racerId,
            set: dto.set,
          },
        },
        data: {
          time: dto.time,
        },
      });
      if (!dto.time) {
        // 有効なタイムの場合ステータスをクリアする
        r = await prisma.result.update({
          where: {
            set_racerId: {
              racerId: dto.racerId,
              set: dto.set,
            },
          },
          data: {
            status: null,
          },
        });
        console.log(`updateResultStatus: r2: ${JSON.stringify(r)}`);
      }
      return r;
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

export type RacerWithResults = Racer & {
  results: Result[];
  // } & {
  //   team: Team;
};

export async function listRacersWithResults(): Promise<RacerWithResults[]> {
  return await prisma.racer.findMany({
    where: {},
    orderBy: {
      bib: 'asc',
    },
    include: {
      results: true,
      // team: true,
    },
  });
}
