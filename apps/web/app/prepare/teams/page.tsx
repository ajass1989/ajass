import { TeamTable } from './teamTable';
import { TeamsWithRacers, getTeamsWithRacers } from './actions';

export default async function PrepareTeamsPage() {
  const dataSource: TeamsWithRacers = await getTeamsWithRacers();
  return <TeamTable dataSource={dataSource} />;
}
