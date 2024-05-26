import { listTeams } from '../prepare/teams/actions';
import { listRacersWithResults } from '../prepare/bibs/actions';
import { ResultTable } from './resultTable';

export default async function InputPage() {
  const teams = await listTeams();
  const racers = await listRacersWithResults();

  return <ResultTable teams={teams} racers={racers} />;
}
