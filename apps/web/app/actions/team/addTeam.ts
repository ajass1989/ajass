'use server';
import { Prisma, Team, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { TeamRequestDto } from '../../(admin)/prepare/teams/teamRequestDto';

export async function addTeam(
  dto: TeamRequestDto,
): Promise<ActionResult<Team>> {
  try {
    const data: Prisma.TeamUncheckedCreateInput = { ...dto };
    const newValues = await prisma.team.create({ data: data });
    return {
      success: true,
      result: { ...newValues },
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return {
          success: false,
          error: '保存に失敗しました。キーが重複しています。',
        };
      }
    }
    throw e;
  }
}
