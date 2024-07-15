'use server';
import { Prisma, SpecialPoint, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * 特別ポイント更新パラメータ
 */
export type UpdateSpecialPointRequestDto = {
  boobyPoint: number;
  boobyMakerPoint: number;
};

/**
 * 特別ポイントの更新
 * @param id ポイントID
 * @param dto 更新するポイント情報
 * @returns 更新後のポイント情報
 */
export async function updateSpecialPoint(
  dto: UpdateSpecialPointRequestDto,
): Promise<ActionResult<SpecialPoint[]>> {
  try {
    const newBoobyPoint = await prisma.specialPoint.update({
      where: { id: 'booby' },
      data: { point: dto.boobyPoint },
    });
    const newBoobyMakerPoint = await prisma.specialPoint.update({
      where: { id: 'booby_maker' },
      data: { point: dto.boobyMakerPoint },
    });
    return {
      success: true,
      result: [newBoobyPoint, newBoobyMakerPoint],
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
