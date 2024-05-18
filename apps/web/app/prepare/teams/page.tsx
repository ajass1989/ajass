import { TeamTable } from './teamTable';
import { TeamWithRacers, listTeamsWithRacers } from './actions';

export default async function PrepareTeamsPage() {
  const teams: TeamWithRacers[] = await listTeamsWithRacers();
  return <TeamTable teams={teams} />;
}
