import { Team, prisma } from '@repo/database';
import ClientTable from './clientTable';

export default async function PrepareTeamsPage() {
  const dataSource: Team[] = await prisma.team.findMany({
    where: {
      eventId: '2023',
    },
    orderBy: {
      fullname: 'asc',
    },
  });
  return <ClientTable dataSource={dataSource} />;
}
