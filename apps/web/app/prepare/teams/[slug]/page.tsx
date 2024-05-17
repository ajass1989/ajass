import { EditTeamForm } from './editTeamForm';
import { getTeam } from './actions';

export const dynamic = 'force-dynamic'; // 動的レンダリングを強制

export default async function Page({ params }: { params: { slug: string } }) {
  const team = await getTeam(params.slug);
  console.log(`editTeam: ${team.fullname}`);
  return <EditTeamForm team={team} />;
}
