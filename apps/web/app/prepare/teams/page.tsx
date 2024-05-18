import { TeamTable } from './teamTable';
import { TeamsWithRacers, listTeamsWithRacers } from './actions';

export default async function PrepareTeamsPage() {
  const teams: TeamsWithRacers = await listTeamsWithRacers();
  return <TeamTable teams={teams} />;
}
