'use server';
import { prisma } from '@repo/database';
import { Event } from '@repo/database';

/**
 * イベント情報の取得
 * @returns イベント情報
 */
export async function getEvent(): Promise<Event> {
  return await prisma.event.findFirstOrThrow({
    where: {},
  });
}
