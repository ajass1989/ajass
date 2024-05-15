import { EditEventForm } from './editEventForm';
import { getEvent } from './actions';
import { EventResponseDto } from './eventResponseDto';

export default async function Page() {
  const dataSource: EventResponseDto = await getEvent();
  return <EditEventForm dataSource={dataSource} />;
}
