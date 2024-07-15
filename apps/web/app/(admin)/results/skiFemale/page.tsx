import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { SKI_FEMALE } from '../../../common/constant';

export default async function ResultsSkiFemalePage() {
  const racers = await listRacers({ gender: 'f', category: 'ski' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: SKI_FEMALE,
          },
        ]}
      />
      <h1>{SKI_FEMALE}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/skiFemale" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} />
    </>
  );
}
