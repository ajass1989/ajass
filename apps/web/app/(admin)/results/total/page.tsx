import { Breadcrumb, Button, Flex } from 'antd';
import { ResultViewTable } from '../components/resultViewTable';
import Link from 'next/link';
import { listRacers } from '../../../actions/racer/listRacers';

export default async function ResultsTotalPage() {
  const racers = await listRacers({});
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: '結果',
          },
          {
            title: '総合',
          },
        ]}
      />
      <h1>総合</h1>
      <Flex>
        <Button type="primary" style={{ marginBottom: 16 }}>
          <Link href="/report/total" target="_blank">
            帳票出力
          </Link>
        </Button>
      </Flex>
      <ResultViewTable
        racers={racers}
        showPoint={false}
        showTotalOrder={true}
      />
    </>
  );
}
