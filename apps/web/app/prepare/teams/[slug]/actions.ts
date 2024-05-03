'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../../actionResult';
import { TeamDto } from '../teamDto';
import { RacerDto } from '../racerDto';

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
    console.log(`addRacer: seed: ${values.seed}`);
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
    // if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //   if (e.code === 'P2025') {
    //     return {
    //       success: false,
    //       error: '保存に失敗しました。指定したキーが見つかりません。',
    //     };
    //   }
    // }
    throw e;
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

export async function deleteRacer(id: string): Promise<ActionResult<void>> {
  try {
    console.log(`deleteRacer: ${id}`);
    await prisma.racer.delete({
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
          error: '保存に失敗しました。指定したキーが見つかりません。',
        };
      }
    }
    throw e;
  }
}
