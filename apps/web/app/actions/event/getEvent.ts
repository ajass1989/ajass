'use server';
import { prisma } from '@repo/database';
import { Event } from '@repo/database';

export async function getEvent(): Promise<Event> {
  return await prisma.event.findFirstOrThrow({
    where: {},
  });
}
