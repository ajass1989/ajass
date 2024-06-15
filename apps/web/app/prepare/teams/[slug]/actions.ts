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

/**
 * シードの入れ替え
 *
 * @param activeId 移動対象のRacerId
 * @param overId 移動先のRacerId
 */
export async function updateSeed(
  activeId: string,
  overId: string,
): Promise<ActionResult<Racer[]>> {
  // 移動対象のシードを取得
  const activeRacer = await prisma.racer.findFirstOrThrow({
    where: {
      id: activeId,
    },
  });
  // 移動先のシードを取得
  const overRacer = await prisma.racer.findFirstOrThrow({
    where: {
      id: overId,
    },
  });
  // 移動対象のシードと移動先のシードの大小関係を確認
  // 下に移動
  if (activeRacer.seed < overRacer.seed) {
    // 移動対象の次〜移動先の前までのシードをすべて1つずつ減らす
    const moveRecords = await prisma.racer.findMany({
      where: {
        // TODO 更新対象のレコードを制限する必要がある（categoryとgenderが一致するレーサーのみ）
        AND: [
          { seed: { gt: activeRacer.seed } },
          { seed: { lte: overRacer.seed } },
          { gender: activeRacer.gender },
          { category: activeRacer.category },
          { teamId: activeRacer.teamId },
          { special: activeRacer.special },
        ],
      },
      orderBy: {
        seed: 'asc',
      },
    });
    const newRacers = await Promise.all(
      moveRecords.map(async (racer: Racer) => {
        return await prisma.racer.update({
          where: { id: racer.id },
          data: {
            seed: { decrement: 1 }, // racer.seed - 1,
          },
        });
      }),
    );
    // 移動対象のシードを移動先のシードに更新
    const newActiveRacer = await prisma.racer.update({
      where: { id: activeId },
      data: {
        seed: overRacer.seed,
      },
    });

    return {
      success: true,
      result: [...newRacers, newActiveRacer].sort((a, b) => a.seed - b.seed),
    };
  }
  // 上に移動
  if (activeRacer.seed > overRacer.seed) {
    // 移動先の次〜移動対象の前までのシードをすべて1つずつ増やす
    const moveRecords = await prisma.racer.findMany({
      where: {
        // TODO 更新対象のレコードを制限する必要がある（categoryとgenderが一致するレーサーのみ）
        AND: [
          { seed: { gte: overRacer.seed } }, // 2
          { seed: { lt: activeRacer.seed } }, // 3
          { gender: activeRacer.gender },
          { category: activeRacer.category },
          { teamId: activeRacer.teamId },
          { special: activeRacer.special },
        ],
      },
      orderBy: {
        seed: 'asc',
      },
    });
    console.log(`moveRecords: ${moveRecords.length}`);
    const newRacers = await Promise.all(
      moveRecords.map(async (racer: Racer) => {
        return await prisma.racer.update({
          where: { id: racer.id },
          data: {
            seed: { increment: 1 },
          },
        });
      }),
    );
    // 移動対象のシードを移動先のシードに更新
    const newActiveRacer = await prisma.racer.update({
      where: { id: activeId },
      data: {
        seed: overRacer.seed,
      },
    });

    return {
      success: true,
      result: [newActiveRacer, ...newRacers].sort((a, b) => a.seed - b.seed),
    };
  }
  return {
    success: true,
    result: [],
  };
}
