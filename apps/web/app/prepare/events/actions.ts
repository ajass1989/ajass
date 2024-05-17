'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';
import { EventRequestDto } from './eventRequestDto';
import { Event } from '@repo/database';

export async function getEvent(): Promise<Event> {
  return await prisma.event.findFirstOrThrow({
    where: {},
  });
}

export async function updateEvent(
  id: string,
  values: EventRequestDto,
): Promise<ActionResult<Event>> {
  try {
    const data: Prisma.EventUpdateInput = {
      id: id,
      ...values,
    };
    const newValues = await prisma.event.update({
      where: { id: id },
      data: data,
    });
    return {
      success: true,
      result: { ...newValues },
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
