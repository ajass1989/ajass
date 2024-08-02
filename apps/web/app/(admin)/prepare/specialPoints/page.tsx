import { Breadcrumb } from 'antd';
import { listSpecialPoints } from '../../../actions/specialPoint/listSpecialPoints';
import { EditSpecialPointsForm } from './editSpecialPointsForm';
import { CommonAlertProvider } from '../../../common/components/commonAlertProvider';

export default async function PreparePointsPage() {
  const result = await listSpecialPoints();
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '準備',
          },
          {
            title: '特別ポイント',
          },
        ]}
      />
      <h1>特別ポイント</h1>
      <CommonAlertProvider>
        <EditSpecialPointsForm specialPoints={result.result!} />
      </CommonAlertProvider>
    </>
  );
}
