import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function PrepareTeamsPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>チーム</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
