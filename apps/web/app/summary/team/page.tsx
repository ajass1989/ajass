import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function SummaryTeamPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>団体</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
