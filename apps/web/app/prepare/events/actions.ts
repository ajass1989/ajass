'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../actionResult';

export type EventType = {
  id: string;
  name: string;
  date: string;
  location: string;
  race: string;
  setter: string;
  management: string;
};

export async function updateEvent(
  values: EventType,
): Promise<ActionResult<EventType>> {
  try {
    const data: Prisma.EventUpdateInput = {
      id: values.id,
      name: values.name,
      date: values.date,
      location: values.location,
      race: values.race,
      setter: values.setter,
      management: values.management,
    };
    const newValues = await prisma.event.update({
      where: { id: values.id },
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
