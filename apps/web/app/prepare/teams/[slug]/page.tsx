import { EditTeamForm } from './editTeamForm';
import { getTeamWithRacers } from './actions';

// export const dynamic = 'force-dynamic'; // 動的レンダリングを強制

export default async function Page({ params }: { params: { slug: string } }) {
  const result = await getTeamWithRacers(params.slug);
  return <EditTeamForm team={result.result!} />;
}
