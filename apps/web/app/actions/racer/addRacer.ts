'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { UpdateRacerRequestDto } from './updateRacer';
import { ActionResult } from '../../common/actionResult';

/**
 * 競技者情報の追加
 * @param dto 競技者情報
 * @returns 更新後の競技者情報
 */
export async function addRacer(
  dto: UpdateRacerRequestDto,
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
