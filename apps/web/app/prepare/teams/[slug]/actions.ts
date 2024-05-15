'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';
import { TeamRequestDto } from '../teamRequestDto';
import { RacerRequestDto } from '../racerRequestDto';
import { PrismaClient } from '@prisma/client/extension';

export async function getTeam(id: string): Promise<Team & { racers: Racer[] }> {
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
  return t;
}

export async function updateTeam(
  id: string,
  values: TeamRequestDto,
): Promise<ActionResult<Team>> {
  try {
    const data: Prisma.TeamUncheckedUpdateInput = { ...values };
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
  values: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedCreateInput = {
      ...values,
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
  values: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedUpdateInput = { ...values };
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

export async function deleteRacer(
  id: string,
  teamId: string,
  special: string,
  category?: string,
  gender?: string,
): Promise<ActionResult<Racer[]>> {
  try {
    let results: Racer[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const deleteResult = await prisma.racer.delete({
        where: { id: id },
      });
      const restRecords = await prisma.racer.findMany({
        where: {
          AND: [
            { id: { not: deleteResult.id } }, // 削除されたID以外
            { teamId: teamId },
            { gender: gender },
            { category: category },
            { special: special },
          ],
        },
        orderBy: {
          seed: 'asc',
        },
      });
      for (let i = 0; i < restRecords.length; i++) {
        const newValue = await prisma.racer.update({
          where: { id: restRecords[i].id },
          data: {
            seed: i + 1,
          },
        });
        results.push(newValue);
      }
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
