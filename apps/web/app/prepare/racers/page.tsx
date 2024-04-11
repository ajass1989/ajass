import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function PrepareRacersPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>選手</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
