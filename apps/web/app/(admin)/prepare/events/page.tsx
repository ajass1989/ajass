import { EditEventForm } from './editEventForm';
import { getEvent } from './actions';
import { Event } from '@repo/database';

export default async function Page() {
  const dataSource: Event = await getEvent();
  return <EditEventForm dataSource={dataSource} />;
}
