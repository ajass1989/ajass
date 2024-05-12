'use server';
import { Prisma, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { RacerDto } from '../teams/racerDto';
import { ActionResult } from '../../actionResult';

export type UpdateBibParams = {
  id: string;
  bib: number | null;
};

export async function updateBibs(
  params: UpdateBibParams[],
): Promise<ActionResult<RacerDto[]>> {
  try {
    let results: RacerDto[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const promises = params.map(async (param: UpdateBibParams) => {
        const newValue = await prisma.racer.update({
          where: { id: param.id },
          data: { bib: param.bib },
        });
        const dto: RacerDto = {
          id: newValue.id,
          name: newValue.name,
          kana: newValue.kana,
          category: newValue.category,
          bib: newValue.bib,
          gender: newValue.gender,
          seed: newValue.seed,
          teamId: newValue.teamId,
          isFirstTime: newValue.isFirstTime,
          age: newValue.age,
          special: newValue.special,
        };
        return dto;
      });
      results = await Promise.all(promises);
    });
    return {
      success: true,
      result: results,
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
