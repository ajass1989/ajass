import { Racer, prisma } from '@repo/database';

type ListRacersRequestDto = {
  gender?: 'f' | 'm';
  category?: 'ski' | 'snowboard';
  special?: 'normal' | 'junior' | 'senior';
};
export async function listRacers(dto: ListRacersRequestDto): Promise<Racer[]> {
  return await prisma.racer.findMany({
    where: {
      // eventId: '2023',
      ...dto,
    },
    orderBy: [
      {
        bestTime: { sort: 'asc', nulls: 'last' },
      },
      {
        bib: 'desc', // タイムが同じ場合、bibの昇順
      },
    ],
  });
}
