import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function IndexPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>Hello World</h1>
      <Button type="primary">Button</Button>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
