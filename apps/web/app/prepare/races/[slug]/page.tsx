import { Race } from '@prisma/client';
import { prisma } from '../../../prisma';
import ClientForm from './clientForm';

export default async function Page({ params }: { params: { slug: string } }) {
  console.log('params.slug:', params.slug);
  const dataSource: Race = await prisma.race.findFirstOrThrow({
    where: { id: params.slug },
  });
  console.log('dataSource:', dataSource);

  return <ClientForm dataSource={dataSource} />;
}
