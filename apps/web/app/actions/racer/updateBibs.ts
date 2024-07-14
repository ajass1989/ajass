'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { UpdateBibRequestDto } from './updateBib';

/**
 * ビブの一括更新
 * @param dtos
 * @returns
 */
export async function updateBibs(
  dtos: UpdateBibRequestDto[],
): Promise<ActionResult<Racer[]>> {
  try {
    let newValues: Racer[] = [];
    await prisma.$transaction(async (tx) => {
      await tx.racer.updateMany({
        data: { bib: null },
      });
      const promises = dtos.map(async (dto: UpdateBibRequestDto) => {
        const newValue = await tx.racer.update({
          where: { id: dto.id },
          data: { bib: dto.bib },
        });
        return newValue;
      });
      newValues = await Promise.all(promises);
    });
    return {
      success: true,
      result: newValues,
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
