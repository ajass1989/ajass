'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { RacerRequestDto } from '../../(admin)/prepare/teams/racerRequestDto';
import { ActionResult } from '../../common/actionResult';

export async function updateRacer(
  id: string,
  dto: RacerRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const data: Prisma.RacerUncheckedUpdateInput = { ...dto };
    const newValues = await prisma.racer.update({
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
