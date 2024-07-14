'use server';
import { Racer, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { updateResult } from './updateResult';

/**
 * ポイントの一括更新
 * @returns ポイント更新後の競技者一覧
 */
export async function updatePoints(): Promise<ActionResult<Racer[]>> {
  try {
    const racersBefore = await prisma.racer.findMany({
      where: {
        bib: { not: null },
      },
    });
    const promises = racersBefore.map(async (racer) => {
      await updateResult(racer.id, {});
    });
    await Promise.all(promises);
    const racersAfter = await prisma.racer.findMany({
      where: {
        bib: { not: null },
      },
      orderBy: {
        point: 'desc',
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
