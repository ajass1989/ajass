'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';
import { TeamRequestDto } from '../teamRequestDto';
import { TeamResponseDto } from '../teamResponseDto';

export async function addTeam(
  values: TeamRequestDto,
): Promise<ActionResult<TeamResponseDto>> {
  try {
    const data: Prisma.TeamUncheckedCreateInput = {
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
      orderMale: values.orderMale,
      orderFemale: values.orderFemale,
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
        orderMale: newValues.orderMale,
        orderFemale: newValues.orderFemale,
        createdAt: newValues.createdAt.getTime() / 1000,
        updatedAt: newValues.updatedAt.getTime() / 1000,
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
