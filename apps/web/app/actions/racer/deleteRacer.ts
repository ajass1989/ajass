'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { ActionResult } from '../../common/actionResult';

/**
 * 競技者情報の削除
 * TODO ポイントの更新
 * @param id 競技者ID
 * @returns 削除後にシード値を更新した競技者情報一覧
 */
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
