'use server';
import { Point, Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

export async function getPoints(): Promise<Point[]> {
  return await prisma.point.findMany();
}

export type UpdatePointParams = {
  pointSkiMale?: number;
  pointSkiFemale?: number;
  pointSnowboardMale?: number;
  pointSnowboardFemale?: number;
};

export async function updatePoint(
  id: number,
  params: UpdatePointParams,
): Promise<ActionResult<Point>> {
  try {
    const newValue = await prisma.point.update({
      where: { id },
      data: { ...params },
    });
    const dto: Point = {
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
      result: dto,
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
