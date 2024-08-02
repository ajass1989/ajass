import { getTeamWithRacers } from '../../../../actions/team/getTeamWithRacers';
import { CommonAlertProvider } from '../../../../common/components/commonAlertProvider';
import { EditTeamForm } from './editTeamForm';

export default async function Page({ params }: { params: { slug: string } }) {
  const result = await getTeamWithRacers(params.slug);
  return (
    <CommonAlertProvider>
      <EditTeamForm team={result.result!} />
    </CommonAlertProvider>
  );
}
