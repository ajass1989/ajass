import { Racer, prisma } from '@repo/database';

type ListRacersRequestDto = {
  gender: 'f' | 'm';
  category: 'ski' | 'snowboard';
};
export async function listRacers(dto: ListRacersRequestDto): Promise<Racer[]> {
  return await prisma.racer.findMany({
    where: {
      // eventId: '2023',
      ...dto,
    },
    orderBy: {
      bib: 'asc',
    },
  });
}
