import { Race } from '@prisma/client';
import { prisma } from '../../prisma';
import ClientTable from './clientTable';

export default async function PrepareRacesPage() {
  const dataSource: Race[] = await prisma.race.findMany();
  return <ClientTable dataSource={dataSource} />;
}
