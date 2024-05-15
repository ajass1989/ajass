'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { TeamRequestDto } from './teamRequestDto';
import { TeamResponseWithRacersDto } from './teamResponseDto';
import { RacerResponseDto } from './racerResponseDto';

export type TeamsWithRacers = Prisma.PromiseReturnType<
  typeof getTeamsWithRacers
>;

export async function getTeamsWithRacers(): Promise<
  TeamResponseWithRacersDto[]
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
  // teamsをmapして、racersをmapして、RacerResponseDtoに変換して、TeamResponseDtoに変換して返す
  // ここにコードを追加してください
  const ts = teams.map((team) => {
    const rs: RacerResponseDto[] = team.racers.map((racer) => ({
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
    const t = {
      id: team.id,
      fullname: team.fullname,
      shortname: team.shortname,
      eventId: team.eventId,
      orderMale: team.orderMale,
      orderFemale: team.orderFemale,
      createdAt: team.createdAt.getTime() / 1000,
      updatedAt: team.updatedAt.getTime() / 1000,
      racers: rs,
    };

    return t;
  });
  return ts;
}

export async function listTeams(): Promise<TeamRequestDto[]> {
  const teams = await prisma.team.findMany({
    orderBy: {
      fullname: 'asc',
    },
  });
  return teams.map((team) => {
    return {
      key: team.id,
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
