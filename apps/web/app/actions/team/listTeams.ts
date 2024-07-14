'use server';
import { Team, prisma } from '@repo/database';

/**
 * チーム一覧の取得
 * @returns チーム一覧
 */
export async function listTeams(): Promise<Team[]> {
  return await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
}
