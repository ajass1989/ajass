'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * チームの削除
 * @param id チームID
 * @returns 削除結果
 */
export async function deleteTeam(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.team.delete({
      where: { id: id },
    });
    return {
      success: true,
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
