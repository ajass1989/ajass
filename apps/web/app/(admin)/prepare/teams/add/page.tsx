import { CommonAlertProvider } from '../../../../common/components/commonAlertProvider';
import { AddTeamForm } from './addTeamForm';

export default async function Page() {
  return (
    <CommonAlertProvider>
      <AddTeamForm />
    </CommonAlertProvider>
  );
}
