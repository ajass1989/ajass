'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import {
  // TeamResponseDto,
  TeamWithRacers /*ResponseWithRacersDto*/,
} from './teamResponseDto';
// import { RacerResponseDto } from './racerResponseDto';

export type TeamsWithRacers = Prisma.PromiseReturnType<
  typeof listTeamsWithRacers
>;

export async function listTeamsWithRacers(): Promise<
  TeamWithRacers /*TeamResponseWithRacersDto*/[]
> {
  const teams = await prisma.team.findMany({
    where: {
      eventId: '2023',
    },
    orderBy: {
      fullname: 'asc',
    },
    include: {
      racers: true,
    },
  });
  const ts = teams.map((team) => {
    const rs: Racer /*ResponseDto*/[] = team.racers.map((racer) => ({
      id: racer.id,
      name: racer.name,
      kana: racer.kana,
      category: racer.category,
      bib: racer.bib,
      gender: racer.gender,
      seed: racer.seed,
      teamId: racer.teamId,
      isFirstTime: racer.isFirstTime,
      age: racer.age,
      special: racer.special,
      createdAt: racer.createdAt,
      updatedAt: racer.updatedAt,
    }));
    const t = {
      id: team.id,
      fullname: team.fullname,
      shortname: team.shortname,
      eventId: team.eventId,
      orderMale: team.orderMale,
      orderFemale: team.orderFemale,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      racers: rs,
    };
    return t;
  });
  return ts;
}

export async function listTeams(): Promise<Team /*ResponseDto*/[]> {
  const teams = await prisma.team.findMany({
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
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  });
}

export async function deleteTeam(id: string): Promise<ActionResult<void>> {
  try {
    await prisma.team.delete({
      where: { id: id },
    });
    return {
      success: true,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '削除に失敗しました。指定したキーが見つかりません。',
        };
      }
    }
    throw e;
  }
}

export async function updateTeamOrder(
  id: string,
  orderFemale: number,
  orderMale: number,
): Promise<ActionResult<void>> {
  try {
    await prisma.team.update({
      where: { id: id },
      data: {
        orderFemale: orderFemale,
        orderMale: orderMale,
      },
    });

    return {
      success: true,
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
    return {
      success: false,
      error: (e as Error).message,
    };
  }
}
