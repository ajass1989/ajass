'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';
import { TeamDto } from '../teamDto';
import { RacerDto } from '../racerDto';
import { PrismaClient } from '@prisma/client/extension';

export async function updateTeam(
  values: TeamDto,
): Promise<ActionResult<TeamDto>> {
  try {
    const data: Prisma.TeamUncheckedUpdateInput = {
      fullname: values.fullname,
      shortname: values.shortname,
      eventId: values.eventId,
      orderMale: values.orderMale,
      orderFemale: values.orderFemale,
    };
    const newValues = await prisma.team.update({
      where: { id: values.id },
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
        createdAt: newValues.createdAt.getTime(),
        updatedAt: newValues.updatedAt.getTime(),
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
  values: RacerDto,
): Promise<ActionResult<RacerDto>> {
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
        gender: newValues.gender,
        seed: newValues.seed,
        teamId: newValues.teamId,
        isFirstTime: newValues.isFirstTime,
        age: newValues.age,
        special: newValues.special,
        createdAt: newValues.createdAt.getTime(),
        updatedAt: newValues.updatedAt.getTime(),
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
  values: RacerDto,
): Promise<ActionResult<RacerDto>> {
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
      where: { id: values.id },
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        name: newValues.name,
        kana: newValues.kana,
        category: newValues.category,
        gender: newValues.gender,
        seed: newValues.seed,
        teamId: newValues.teamId,
        isFirstTime: newValues.isFirstTime,
        age: newValues.age,
        special: newValues.special,
        createdAt: newValues.createdAt.getTime(),
        updatedAt: newValues.updatedAt.getTime(),
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
): Promise<ActionResult<RacerDto[]>> {
  try {
    let results: RacerDto[] = [];
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
