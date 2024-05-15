'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';
import { TeamRequestDto } from '../teamRequestDto';
// import { TeamResponseDto } from '../teamResponseDto';
import { RacerRequestDto } from '../racerRequestDto';
// import { RacerResponseDto } from '../racerResponseDto';
import { PrismaClient } from '@prisma/client/extension';

export async function getTeam(
  id: string,
): Promise<Team /*ResponseDto*/ & { racers: Racer /*ResponseDto*/[] }> {
  const team = await prisma.team.findFirstOrThrow({
    where: { id: id },
    include: {
      racers: true,
    },
  });
  const rs: Racer /*ResponseDto*/[] = team.racers.map((racer) => ({
    id: racer.id,
    name: racer.name,
    kana: racer.kana,
    category: racer.category,
    bib: null,
    gender: racer.gender,
    seed: racer.seed,
    teamId: racer.teamId,
    isFirstTime: racer.isFirstTime,
    age: racer.age,
    special: racer.special,
    createdAt: racer.createdAt,
    updatedAt: racer.updatedAt,
  }));
  const t: Team /*ResponseDto*/ & { racers: Racer /*ResponseDto*/[] } = {
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
}

export async function updateTeam(
  id: string,
  values: TeamRequestDto,
): Promise<ActionResult<Team /*ResponseDto*/>> {
  try {
    const data: Prisma.TeamUncheckedUpdateInput = {
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
      orderMale: values.orderMale,
      orderFemale: values.orderFemale,
    };
    const newValues = await prisma.team.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        fullname: newValues.fullname,
        shortname: newValues.shortname,
        eventId: newValues.eventId,
        orderMale: newValues.orderMale,
        orderFemale: newValues.orderFemale,
        createdAt: newValues.createdAt,
        updatedAt: newValues.updatedAt,
      },
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

export async function addRacer(
  values: RacerRequestDto,
): Promise<ActionResult<Racer /*ResponseDto*/>> {
  try {
    const data: Prisma.RacerUncheckedCreateInput = {
      name: values.name,
      kana: values.kana,
      category: values.category,
      gender: values.gender,
      seed: values.seed,
      teamId: values.teamId,
      isFirstTime: values.isFirstTime,
      age: values.age,
      special: values.special,
    };
    const newValues = await prisma.racer.create({
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        name: newValues.name,
        kana: newValues.kana,
        category: newValues.category,
        bib: null,
        gender: newValues.gender,
        seed: newValues.seed,
        teamId: newValues.teamId,
        isFirstTime: newValues.isFirstTime,
        age: newValues.age,
        special: newValues.special,
        createdAt: newValues.createdAt,
        updatedAt: newValues.updatedAt,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: '追加に失敗しました。',
    };
  }
}

export async function updateRacer(
  id: string,
  values: RacerRequestDto,
): Promise<ActionResult<Racer /*ResponseDto*/>> {
  try {
    const data: Prisma.RacerUncheckedUpdateInput = {
      name: values.name,
      kana: values.kana,
      category: values.category,
      gender: values.gender,
      seed: values.seed,
      teamId: values.teamId,
      isFirstTime: values.isFirstTime,
      age: values.age,
      special: values.special,
    };
    const newValues = await prisma.racer.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        name: newValues.name,
        kana: newValues.kana,
        category: newValues.category,
        bib: null,
        gender: newValues.gender,
        seed: newValues.seed,
        teamId: newValues.teamId,
        isFirstTime: newValues.isFirstTime,
        age: newValues.age,
        special: newValues.special,
        createdAt: newValues.createdAt,
        updatedAt: newValues.updatedAt,
      },
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

export async function deleteRacer(
  id: string,
  teamId: string,
  special: string,
  category?: string,
  gender?: string,
): Promise<ActionResult<Racer /*ResponseDto*/[]>> {
  try {
    let results: Racer /*ResponseDto*/[] = [];
    await prisma.$transaction(async (prisma: PrismaClient) => {
      const deleteResult = await prisma.racer.delete({
        where: { id: id },
      });
      const restRecords = await prisma.racer.findMany({
        where: {
          AND: [
            { id: { not: deleteResult.id } }, // 削除されたID以外
            { teamId: teamId },
            { gender: gender },
            { category: category },
            { special: special },
          ],
        },
        orderBy: {
          seed: 'asc',
        },
      });
      for (let i = 0; i < restRecords.length; i++) {
        const newValue = await prisma.racer.update({
          where: { id: restRecords[i].id },
          data: {
            seed: i + 1,
          },
        });
        results.push(newValue);
      }
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
