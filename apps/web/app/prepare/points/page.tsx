import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function PreparePointsPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>ポイント</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
