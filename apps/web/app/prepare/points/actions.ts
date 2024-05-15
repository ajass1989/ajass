'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { PointDto } from './pointDto';

export type UpdatePointParams = {
  id: number;
  pointSkiMale?: number;
  pointSkiFemale?: number;
  pointSnowboardMale?: number;
  pointSnowboardFemale?: number;
};

export async function updatePoint(
  params: UpdatePointParams,
): Promise<ActionResult<PointDto>> {
  try {
    const newValue = await prisma.point.update({
      where: { id: params.id },
      data: {
        pointSkiMale: params.pointSkiMale,
        pointSkiFemale: params.pointSkiFemale,
        pointSnowboardMale: params.pointSnowboardMale,
        pointSnowboardFemale: params.pointSnowboardFemale,
      },
    });
    const dto: PointDto = {
      id: newValue.id,
      pointSkiMale: newValue.pointSkiMale,
      pointSkiFemale: newValue.pointSkiFemale,
      pointSnowboardMale: newValue.pointSnowboardMale,
      pointSnowboardFemale: newValue.pointSnowboardFemale,
      createAt: newValue.createdAt,
      updateAt: newValue.updatedAt,
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

export async function getPoints(): Promise<PointDto[]> {
  const points = await prisma.point.findMany();
  return points.map((point) => ({
    id: point.id,
    pointSkiMale: point.pointSkiMale,
    pointSkiFemale: point.pointSkiFemale,
    pointSnowboardMale: point.pointSnowboardMale,
    pointSnowboardFemale: point.pointSnowboardFemale,
    createAt: point.createdAt,
    updateAt: point.updatedAt,
  }));
}
