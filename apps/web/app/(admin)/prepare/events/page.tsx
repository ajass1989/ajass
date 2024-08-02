import { getEvent } from '../../../actions/event/getEvent';
import { CommonAlertProvider } from '../../../common/components/commonAlertProvider';
import { EditEventForm } from './editEventForm';
import { Event } from '@repo/database';

export default async function Page() {
  const dataSource: Event = await getEvent();
  return (
    <CommonAlertProvider>
      <EditEventForm dataSource={dataSource} />;
    </CommonAlertProvider>
  );
}
