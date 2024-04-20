'use server';
import { Prisma, prisma } from '@repo/database';

export type EventType = {
  id: string;
  name: string;
  date: string;
  location: string;
  race: string;
  setter: string;
  management: string;
};

export async function updateEvent(values: EventType) {
  const i: Prisma.EventUpdateInput = {
    id: values.id,
    name: values.name,
    date: values.date,
    location: values.location,
    race: values.race,
    setter: values.setter,
    management: values.management,
  };
  return await prisma.event.update({
    where: { id: values.id },
    data: i,
  });
}
