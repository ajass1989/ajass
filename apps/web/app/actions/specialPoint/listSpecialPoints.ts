'use server';
import { SpecialPoint, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * 特別ポイント一覧取得
 * @returns 特別ポイント一覧
 */
export async function listSpecialPoints(): Promise<
  ActionResult<SpecialPoint[]>
> {
  const specialPoints = await prisma.specialPoint.findMany();
  const booby = specialPoints.find((point) => {
    return point.id === 'booby';
  });
  if (!booby) {
    return {
      success: false,
      error: 'boobyが存在しません。',
    };
  }
  const boobyMaker = specialPoints.find((point) => {
    return point.id === 'booby_maker';
  });
  if (!boobyMaker) {
    return {
      success: false,
      error: 'booby_makerが存在しません。',
    };
  }
  return {
    success: true,
    result: specialPoints,
  };
}
