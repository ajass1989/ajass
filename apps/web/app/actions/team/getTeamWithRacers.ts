'use server';
import { Prisma, Racer, Team, prisma } from '@repo/database';
import { ActionResult } from '../../common/actionResult';
import { TeamWithRacers } from './listTeamsWithRacers';

/**
 * チーム情報の取得（チームに所属する選手情報も取得）
 * @param id チームID
 * @returns チーム情報と所属する選手情報
 */
export async function getTeamWithRacers(
  id: string,
): Promise<ActionResult<TeamWithRacers>> {
  try {
    const team = await prisma.team.findFirstOrThrow({
      where: { id: id },
      include: {
        racers: true,
      },
    });
    const rs: Racer[] = team.racers.map((racer) => ({
      ...racer,
    }));
    const t: Team & { racers: Racer[] } = {
      ...team,
      racers: rs,
    };
    return {
      success: true,
      result: t,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          success: false,
          error: '指定したチームが見つかりません。',
        };
      }
    }
    throw e;
  }
}
