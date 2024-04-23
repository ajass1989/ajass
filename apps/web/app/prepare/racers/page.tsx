import { prisma } from '@repo/database';
import ClientTable from './clientTable';

export default async function PrepareRacersPage() {
  const dataSource = await prisma.racer.findMany({
    where: {
      // eventId: '2023',
    },
    orderBy: {
      bib: 'asc',
    },
  });
  const teams = await prisma.team.findMany({
    where: {},
    orderBy: {
      fullname: 'asc',
    },
  });
  return <ClientTable dataSource={dataSource} teams={teams} />;
}
