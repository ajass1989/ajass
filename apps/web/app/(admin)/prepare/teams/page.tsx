import {
  TeamWithRacers,
  listTeamsWithRacers,
} from '../../../actions/team/listTeamsWithRacers';
import { CommonAlertProvider } from '../../../common/components/commonAlertProvider';
import { TeamTable } from './teamTable';

export default async function PrepareTeamsPage() {
  const teams: TeamWithRacers[] = await listTeamsWithRacers();
  return (
    <CommonAlertProvider>
      <TeamTable teams={teams} />
    </CommonAlertProvider>
  );
}
