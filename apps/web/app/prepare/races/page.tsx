import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function PrepareRacesPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>競技</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
