import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { SNOWBOARD_FEMALE } from '../../../common/constant';

export default async function ResultsSnowboardFemalePage() {
  const racers = await listRacers({ gender: 'f', category: 'snowboard' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: SNOWBOARD_FEMALE,
          },
        ]}
      />
      <h1>{SNOWBOARD_FEMALE}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/snowboardFemale" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} />
    </>
  );
}
