import { EditTeamForm } from './editTeamForm';
import { getTeam } from './actions';

export default async function Page({ params }: { params: { slug: string } }) {
  const team = await getTeam(params.slug);
  return <EditTeamForm team={team} />;
}
