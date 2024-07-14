'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * 滑走順の更新
 * @param id 更新対象のチームID
 * @param orderFemale 滑走順（女子）
 * @param orderMale 滑走順（男子）
 * @returns
 */
export async function updateTeamOrder(
  id: string,
  orderFemale: number,
  orderMale: number,
): Promise<ActionResult<void>> {
  try {
    await prisma.team.update({
      where: { id },
      data: {
        orderFemale,
        orderMale,
      },
    });

    return {
      success: true,
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
          error: '保存に失敗しました。滑走順が重複しています。',
        };
      }
    }
    return {
      success: false,
      error: (e as Error).message,
    };
  }
}
