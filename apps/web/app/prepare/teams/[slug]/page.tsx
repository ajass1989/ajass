import { Racer, Team, prisma } from '@repo/database';
import { EditTeamForm } from './editTeamForm';

export async function Page({ params }: { params: { slug: string } }) {
  const team = await getTeam(params.slug);
  return <EditTeamForm team={team} />;
}

export async function getTeam(id: string): Promise<Team & { racers: Racer[] }> {
  return await prisma.team.findFirstOrThrow({
    where: { id: id },
    include: {
      racers: true,
    },
  });
}
