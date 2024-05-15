import { BibTable } from './bibTable';
import { listRacers, listTeams } from './actions';

export default async function PrepareRacersPage() {
  const racers = await listRacers();
  const teams = await listTeams();
  return <BibTable racers={racers} teams={teams} />;
}
