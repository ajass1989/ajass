import { Team, prisma } from '@repo/database';
import ClientForm from './clientForm';

export default async function Page({ params }: { params: { slug: string } }) {
  const dataSource: Team = await prisma.team.findFirstOrThrow({
    where: { id: params.slug },
  });
  console.log('dataSource:', dataSource);
  return <ClientForm dataSource={dataSource} />;
}
