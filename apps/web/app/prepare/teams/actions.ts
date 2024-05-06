'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { TeamDto } from './teamDto';

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

export async function updateTeamOrder(
  id: string,
  orderFemale: number,
  orderMale: number,
): Promise<ActionResult<void>> {
  try {
    await prisma.team.update({
      where: { id: id },
      data: {
        orderFemale: orderFemale,
        orderMale: orderMale,
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
    }
    return {
      success: false,
      error: (e as Error).message,
    };
  }
}
