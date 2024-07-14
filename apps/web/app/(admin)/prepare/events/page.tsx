import { getEvent } from '../../../actions/event/getEvent';
import { EditEventForm } from './editEventForm';
import { Event } from '@repo/database';

export default async function Page() {
  const dataSource: Event = await getEvent();
  return <EditEventForm dataSource={dataSource} />;
}
