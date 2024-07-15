import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { JUNIOR } from '../../../common/constant';

export default async function ResultsJuniorPage() {
  const racers = await listRacers({ special: 'junior' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: JUNIOR,
          },
        ]}
      />
      <h1>{JUNIOR}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/specialJunior" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} showPoint={false} />
    </>
  );
}
