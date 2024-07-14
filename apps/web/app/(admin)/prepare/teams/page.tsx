import {
  TeamWithRacers,
  listTeamsWithRacers,
} from '../../../actions/team/listTeamsWithRacers';
import { TeamTable } from './teamTable';

export default async function PrepareTeamsPage() {
  const teams: TeamWithRacers[] = await listTeamsWithRacers();
  return <TeamTable teams={teams} />;
}
