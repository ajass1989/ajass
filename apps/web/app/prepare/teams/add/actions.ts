'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';

export type TeamType = {
  id?: string;
  fullname: string;
  shortname: string;
  eventId: string;
  createdAt?: number;
  updatedAt?: number;
};

export async function addTeam(
  values: TeamType,
): Promise<ActionResult<TeamType>> {
  try {
    const data: Prisma.TeamUncheckedCreateInput = {
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
    };
    const newValues = await prisma.team.create({
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        fullname: newValues.fullname,
        shortname: newValues.shortname,
        eventId: newValues.eventId,
        createdAt: newValues.createdAt.getTime(),
        updatedAt: newValues.updatedAt.getTime(),
      },
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
