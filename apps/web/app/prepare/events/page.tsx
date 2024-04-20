import { prisma, Event } from '@repo/database';
import ClientForm from './clientForm';

export default async function Page() {
  const dataSource: Event = await prisma.event.findFirstOrThrow({
    where: {},
  });
  return <ClientForm dataSource={dataSource} />;
}
