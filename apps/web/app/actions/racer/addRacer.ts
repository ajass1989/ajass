'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { RacerRequestDto } from '../../(admin)/prepare/teams/racerRequestDto';
import { ActionResult } from '../../common/actionResult';

export async function addRacer(
  dto: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedCreateInput = {
      ...dto,
    };
    const newValues = await prisma.racer.create({
      data: data,
    });
    return {
      success: true,
      result: { ...newValues },
    };
  } catch (e) {
    return {
      success: false,
      error: '追加に失敗しました。',
    };
  }
}
