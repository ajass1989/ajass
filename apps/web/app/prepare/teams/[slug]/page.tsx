import { prisma } from '@repo/database';
import ClientForm from './clientForm';

export default async function Page({ params }: { params: { slug: string } }) {
  const team = await prisma.team.findFirstOrThrow({
    where: { id: params.slug },
    include: {
      racers: true,
    },
  });
  return <ClientForm team={team} />;
}
