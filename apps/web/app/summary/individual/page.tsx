import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function SummaryIndividualPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>個人</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
