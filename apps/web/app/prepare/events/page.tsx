import { prisma, Event } from '@repo/database';
import { EditEventForm } from './editEventForm';

export async function Page() {
  const dataSource: Event = await getEvent();
  return <EditEventForm dataSource={dataSource} />;
}

async function getEvent(): Promise<Event> {
  return await prisma.event.findFirstOrThrow({
    where: {},
  });
}
