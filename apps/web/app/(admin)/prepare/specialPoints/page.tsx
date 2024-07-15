import { Breadcrumb } from 'antd';
import { listSpecialPoints } from '../../../actions/specialPoint/listSpecialPoints';
import { EditSpecialPointsForm } from './editSpecialPointsForm';

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
      <EditSpecialPointsForm specialPoints={result.result!} />
    </>
  );
}
