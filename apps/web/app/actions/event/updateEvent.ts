'use server';
import { Prisma, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { Event } from '@repo/database';

/**
 * イベント更新パラメータ
 */
export type UpdateEventRequestDto = {
  name: string;
  date: string;
  location: string;
  race: string;
  setter: string;
  management: string;
};

/**
 * イベント情報の更新
 * @param id イベントID
 * @param dto 更新するイベント情報
 * @returns 更新後のイベント情報
 */
export async function updateEvent(
  id: string,
  dto: UpdateEventRequestDto,
): Promise<ActionResult<Event>> {
  try {
    const newEvent = await prisma.event.update({
      where: { id: id },
      data: { ...dto },
    });
    return {
      success: true,
      result: newEvent,
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
