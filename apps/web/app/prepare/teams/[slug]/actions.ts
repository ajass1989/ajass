'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../../../common/actionResult';
import { TeamRequestDto } from '../teamRequestDto';
import { RacerRequestDto } from '../racerRequestDto';
import { PrismaClient } from '@prisma/client/extension';

export async function getTeamWithRacers(
  id: string,
): Promise<ActionResult<Team & { racers: Racer[] }>> {
  try {
    const team = await prisma.team.findFirstOrThrow({
      where: { id: id },
      include: {
        racers: true,
      },
    });
    const rs: Racer[] = team.racers.map((racer) => ({
      ...racer,
    }));
    const t: Team & { racers: Racer[] } = {
      ...team,
      racers: rs,
    };
    return {
      success: true,
      result: t,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '指定したチームが見つかりません。',
        };
      }
    }
    throw e;
  }
}

export async function updateTeam(
  id: string,
  dto: TeamRequestDto,
): Promise<ActionResult<Team>> {
  try {
    const data: Prisma.TeamUncheckedUpdateInput = { ...dto };
    const newValues = await prisma.team.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: { ...newValues },
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

export async function addRacer(
  dto: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedCreateInput = {
      ...dto,
    };
    const newValues = await prisma.racer.create({
      data: data,
    });
    return {
      success: true,
      result: { ...newValues },
    };
  } catch (e) {
    return {
      success: false,
      error: '追加に失敗しました。',
    };
  }
}

export async function updateRacer(
  id: string,
  dto: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedUpdateInput = { ...dto };
    const newValues = await prisma.racer.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: { ...newValues },
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

export async function deleteRacer(id: string): Promise<ActionResult<Racer[]>> {
  try {
    let results: Racer[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const deleted: Racer = await prisma.racer.delete({
        where: { id: id },
      });
      const restRecords = await prisma.racer.findMany({
        where: {
          AND: [
            { id: { not: deleted.id } }, // 削除されたID以外
            { teamId: deleted.teamId },
            { gender: deleted.gender },
            { category: deleted.category },
            { special: deleted.special },
          ],
        },
        orderBy: {
          seed: 'asc',
        },
      });
      results = await Promise.all(
        restRecords.map(async (racer: Racer, i: number) => {
          return await prisma.racer.update({
            where: { id: racer.id },
            data: {
              seed: i + 1,
            },
          });
        }),
      );
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
          error: '削除に失敗しました。指定したキーが見つかりません。',
        };
      }
    }
    throw e;
  }
}
