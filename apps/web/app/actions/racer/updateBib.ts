'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';

/**
 * ビブの更新
 * @param dto
 * @returns
 */
export async function updateBib(
  dto: UpdateBibRequestDto,
): Promise<ActionResult<Racer>> {
  try {
    const newValue = await prisma.racer.update({
      where: { id: dto.id },
      data: { bib: dto.bib },
    });
    return {
      success: true,
      result: newValue,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '保存に失敗しました。指定したキーが見つかりません。',
        };
      }
      if (e.code === 'P2002') {
        return {
          success: false,
          error: '保存に失敗しました。ビブが重複しています。',
        };
      }
    }
    throw e;
  }
}

export type UpdateBibRequestDto = {
  id: string;
  bib: number | null;
};
