import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { SNOWBOARD_MALE } from '../../../common/constant';

export default async function ResultsSnowboardMalePage() {
  const racers = await listRacers({ gender: 'm', category: 'snowboard' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: SNOWBOARD_MALE,
          },
        ]}
      />
      <h1>{SNOWBOARD_MALE}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/snowboardMale" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} />
    </>
  );
}
