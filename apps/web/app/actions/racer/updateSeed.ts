'use server';
import { Racer, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * シードの入れ替え
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
