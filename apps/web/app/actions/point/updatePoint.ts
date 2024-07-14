'use server';
import { Point, Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * ポイント更新パラメータ
 */
export type UpdatePointRequestDto = {
  pointSkiMale?: number;
  pointSkiFemale?: number;
  pointSnowboardMale?: number;
  pointSnowboardFemale?: number;
};

/**
 * ポイントの更新
 * @param id ポイントID
 * @param dto 更新するポイント情報
 * @returns 更新後のポイント情報
 */
export async function updatePoint(
  id: number,
  dto: UpdatePointRequestDto,
): Promise<ActionResult<Point>> {
  try {
    const newValue = await prisma.point.update({
      where: { id },
      data: { ...dto },
    });
    const result: Point = {
      id: newValue.id,
      pointSkiMale: newValue.pointSkiMale,
      pointSkiFemale: newValue.pointSkiFemale,
      pointSnowboardMale: newValue.pointSnowboardMale,
      pointSnowboardFemale: newValue.pointSnowboardFemale,
      createdAt: newValue.createdAt,
      updatedAt: newValue.updatedAt,
    };
    return {
      success: true,
      result: result,
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
