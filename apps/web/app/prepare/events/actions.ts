'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { EventResponseDto } from './eventResponseDto';
import { EventRequestDto } from './eventRequestDto';

export async function getEvent(): Promise<EventResponseDto> {
  const event = await prisma.event.findFirstOrThrow({
    where: {},
  });
  const dto: EventResponseDto = {
    id: event.id,
    name: event.name,
    date: event.date.toISOString(),
    location: event.location,
    race: event.race,
    setter: event.setter,
    management: event.management,
    createdAt: event.createdAt.getTime() / 1000,
    updatedAt: event.updatedAt.getTime() / 1000,
  };
  return dto;
}

export async function updateEvent(
  id: string,
  values: EventRequestDto,
): Promise<ActionResult<EventResponseDto>> {
  try {
    const data: Prisma.EventUpdateInput = {
      id: id,
      name: values.name,
      date: values.date,
      location: values.location,
      race: values.race,
      setter: values.setter,
      management: values.management,
    };
    const newValues = await prisma.event.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: {
        id: newValues.id,
        name: newValues.name,
        date: newValues.date.toISOString(),
        location: newValues.location,
        race: newValues.race,
        setter: newValues.setter,
        management: newValues.management,
        createdAt: newValues.createdAt.getTime() / 1000,
        updatedAt: newValues.updatedAt.getTime() / 1000,
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
