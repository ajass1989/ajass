import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';
import { SENIOR } from '../../../common/constant';

export default async function ResultsSeniorPage() {
  const racers = await listRacers({ special: 'senior' });
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: SENIOR,
          },
        ]}
      />
      <h1>{SENIOR}</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/specialSenior" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable racers={racers} showPoint={false} showAge={true} />
    </>
  );
}
