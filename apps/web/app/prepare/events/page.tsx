import { prisma, Event } from '@repo/database';
import { EditEventForm } from './editEventForm';

export default async function Page() {
  const dataSource: Event = await prisma.event.findFirstOrThrow({
    where: {},
  });
  return <EditEventForm dataSource={dataSource} />;
}
