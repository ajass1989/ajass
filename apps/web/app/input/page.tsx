import { listRacers } from './actions';
import { listTeams } from '../prepare/teams/actions';
import { ResultTable } from './resultTable';

export default async function InputPage() {
  const teams = await listTeams();
  const racers = await listRacers();

  return <ResultTable teams={teams} racers={racers} />;
}
