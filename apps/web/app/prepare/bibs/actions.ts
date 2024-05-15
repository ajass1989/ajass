'use server';
import { Prisma, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { ActionResult } from '../../actionResult';
import { RacerResponseDto } from '../teams/racerResponseDto';
import { TeamResponseDto } from '../teams/teamResponseDto';

export type UpdateBibParams = {
  id: string;
  bib?: number;
};

export async function updateBibs(
  params: UpdateBibParams[],
): Promise<ActionResult<RacerResponseDto[]>> {
  try {
    let results: RacerResponseDto[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const promises = params.map(async (param: UpdateBibParams) => {
        const newValue = await prisma.racer.update({
          where: { id: param.id },
          data: { bib: param.bib },
        });
        const dto: RacerResponseDto = {
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
          createdAt: newValue.createdAt.getTime() / 1000,
          updatedAt: newValue.updatedAt.getTime() / 1000,
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

export async function listRacers(): Promise<RacerResponseDto[]> {
  const racers = await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
  return racers.map((racer) => ({
    id: racer.id,
    name: racer.name,
    kana: racer.kana,
    category: racer.category,
    bib: racer.bib ?? undefined,
    gender: racer.gender,
    seed: racer.seed,
    teamId: racer.teamId ?? undefined,
    isFirstTime: racer.isFirstTime,
    age: racer.age ?? undefined,
    special: racer.special,
    createdAt: racer.createdAt.getTime() / 1000,
    updatedAt: racer.updatedAt.getTime() / 1000,
  }));
}

export async function listTeams(): Promise<TeamResponseDto[]> {
  const teams = await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
  return teams.map((team) => {
    return {
      id: team.id,
      fullname: team.fullname,
      shortname: team.shortname,
      eventId: team.eventId,
      orderMale: team.orderMale,
      orderFemale: team.orderFemale,
      createdAt: team.createdAt.getTime() / 1000,
      updatedAt: team.updatedAt.getTime() / 1000,
    };
  });
}
