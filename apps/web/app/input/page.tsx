import { prisma } from '@repo/database';
import { Button } from 'antd';

export default async function InputPage() {
  const users = await prisma.racer.findMany();

  return (
    <div>
      <h1>入力</h1>
      <Button type="primary">Button</Button>
    </div>
  );
}
