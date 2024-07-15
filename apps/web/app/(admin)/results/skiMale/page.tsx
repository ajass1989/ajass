import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { SKI_MALE } from '../../../common/constant';

export default async function ResultsSkiMalePage() {
  const racers = await listRacers({ gender: 'm', category: 'ski' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: SKI_MALE,
          },
        ]}
      />
      <h1>{SKI_MALE}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/skiMale" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} />
    </>
  );
}
