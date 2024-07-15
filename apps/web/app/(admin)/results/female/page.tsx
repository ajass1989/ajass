import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { FEMALE } from '../../../common/constant';

export default async function ResultsSkiMalePage() {
  const racers = await listRacers({ gender: 'f' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: FEMALE,
          },
        ]}
      />
      <h1>{FEMALE}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/female" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} showPoint={false} />
    </>
  );
}
