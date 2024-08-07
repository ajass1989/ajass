'use server';
import { Prisma, Team, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { TeamRequestDto } from './teamRequestDto';

/**
 * チーム情報の更新
 * @param id チームID
 * @param dto 更新するチーム情報
 * @returns 更新後のチーム情報
 */
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
