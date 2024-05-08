'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { TeamDto } from './teamDto';

export async function listTeams(): Promise<TeamDto[]> {
  const teams = await prisma.team.findMany({
    orderBy: {
      fullname: 'asc',
    },
  });
  return teams.map((team) => {
    return {
      key: team.id,
      fullname: team.fullname,
      shortname: team.shortname,
      eventId: team.eventId,
      orderMale: team.orderMale,
      orderFemale: team.orderFemale,
      createdAt: team.createdAt.getTime(),
      updatedAt: team.updatedAt.getTime(),
    };
  });
}

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
