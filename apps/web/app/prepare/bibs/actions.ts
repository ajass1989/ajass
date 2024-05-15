'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { ActionResult } from '../../actionResult';

export type UpdateBibParams = {
  id: string;
  bib: number | null;
};

export async function updateBibs(
  params: UpdateBibParams[],
): Promise<ActionResult<Racer[]>> {
  try {
    let results: Racer[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const promises = params.map(async (param: UpdateBibParams) => {
        const newValue = await prisma.racer.update({
          where: { id: param.id },
          data: { bib: param.bib },
        });
        return newValue;
      });
      results = await Promise.all(promises);
    });
    return {
      success: true,
      result: results,
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
