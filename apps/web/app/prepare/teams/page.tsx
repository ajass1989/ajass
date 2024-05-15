import { TeamTable } from './teamTable';
import { TeamsWithRacers, listTeamsWithRacers } from './actions';

export default async function PrepareTeamsPage() {
  const dataSource: TeamsWithRacers = await listTeamsWithRacers();
  return <TeamTable dataSource={dataSource} />;
}
