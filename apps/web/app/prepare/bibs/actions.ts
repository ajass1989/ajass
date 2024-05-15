'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { PrismaClient } from '@prisma/client/extension';
import { ActionResult } from '../../actionResult';
// import { RacerResponseDto } from '../teams/racerResponseDto';
// import { TeamResponseDto } from '../teams/teamResponseDto';

export type UpdateBibParams = {
  id: string;
  bib: number | null;
};

export async function updateBibs(
  params: UpdateBibParams[],
): Promise<ActionResult<Racer /*ResponseDto*/[]>> {
  try {
    let results: Racer /*ResponseDto*/[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const promises = params.map(async (param: UpdateBibParams) => {
        const newValue = await prisma.racer.update({
          where: { id: param.id },
          data: { bib: param.bib },
        });
        const dto: Racer /*ResponseDto*/ = {
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
          createdAt: newValue.createdAt,
          updatedAt: newValue.updatedAt,
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

export async function listRacers(): Promise<Racer /*ResponseDto*/[]> {
  const racers = await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
  return racers; //.map((racer) => ({
  // ...racer,
  // id: racer.id,
  // name: racer.name,
  // kana: racer.kana,
  // category: racer.category,
  // bib: racer.bib,
  // gender: racer.gender,
  // seed: racer.seed,
  // teamId: racer.teamId,
  // isFirstTime: racer.isFirstTime,
  // age: racer.age,
  // special: racer.special,
  // createdAt: racer.createdAt,
  // updatedAt: racer.updatedAt,
  // }));
}

export async function listTeams(): Promise<Team /*ResponseDto*/[]> {
  const teams = await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
  return teams; //.map((team) => {
  //   return {
  //     id: team.id,
  //     fullname: team.fullname,
  //     shortname: team.shortname,
  //     eventId: team.eventId,
  //     orderMale: team.orderMale,
  //     orderFemale: team.orderFemale,
  //     createdAt: team.createdAt,
  //     updatedAt: team.updatedAt,
  //   };
  // });
}
