'use server';
import { Prisma, Racer, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { UpdateRacerRequestDto } from './updateRacer';
import { ActionResult } from '../../common/actionResult';
import { CategoryType, GenderType, SpecialType } from '../../common/types';

function getMaxSeed(
  racersByTeam: Racer[],
  special: SpecialType,
  category?: CategoryType,
  gender?: GenderType,
): number {
  const racersBySummary = racersByTeam.filter((racer) => {
    if (special === 'junior' || special === 'senior') {
      return racer.special === special;
    } else {
      return (
        racer.special === special &&
        racer.gender === gender &&
        racer.category === category
      );
    }
  });
  if (racersBySummary.length === 0) return 0;
  return Math.max(...racersBySummary.map((item) => item.seed));
}

/**
 * 競技者情報の一括追加
 * @param dtos 競技者情報配列
 * @returns 追加後の競技者情報配列
 */
export async function addRacerBulk(
  teamId: string,
  dtos: UpdateRacerRequestDto[],
): Promise<ActionResult<Racer[]>> {
  try {
    let results: Racer[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const racersByTeam = await prisma.racer.findMany({ where: { teamId } });
      let seedSkiMale = getMaxSeed(racersByTeam, 'normal', 'ski', 'm');
      let seedSkiFemale = getMaxSeed(racersByTeam, 'normal', 'ski', 'f');
      let seedSnowboardMale = getMaxSeed(
        racersByTeam,
        'normal',
        'snowboard',
        'm',
      );
      let seedSnowboardFemale = getMaxSeed(
        racersByTeam,
        'normal',
        'snowboard',
        'f',
      );
      let seedJunior = getMaxSeed(racersByTeam, 'junior');
      let seedSenior = getMaxSeed(racersByTeam, 'senior');
      let seed = 1;

      results = await Promise.all(
        dtos.map(async (dto) => {
          if (
            dto.special === 'normal' &&
            dto.gender === 'm' &&
            dto.category === 'ski'
          ) {
            seed = ++seedSkiMale;
          }
          if (
            dto.special === 'normal' &&
            dto.gender === 'f' &&
            dto.category === 'ski'
          ) {
            seed = ++seedSkiFemale;
          }
          if (
            dto.special === 'normal' &&
            dto.gender === 'm' &&
            dto.category === 'snowboard'
          ) {
            seed = ++seedSnowboardMale;
          }
          if (
            dto.special === 'normal' &&
            dto.gender === 'f' &&
            dto.category === 'snowboard'
          ) {
            seed = ++seedSnowboardFemale;
          }
          if (dto.special === 'junior') seed = ++seedJunior;
          if (dto.special === 'senior') seed = ++seedSenior;
          const data: Prisma.RacerUncheckedCreateInput = {
            ...dto,
            teamId,
            seed,
          };
          return await prisma.racer.create({
            data: data,
          });
        }),
      );
    });
    const result = {
      success: true,
      result: results,
    };
    return result;
  } catch (e) {
    return {
      success: false,
      error: '追加に失敗しました。',
    };
  }
}
