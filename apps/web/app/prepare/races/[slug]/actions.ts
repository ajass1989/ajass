'use server';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../prisma';
type FieldType = {
  key: string;
  name: string;
  date?: Date;
  location?: string;
  race?: string;
  setter?: string;
  management?: string;
};

export async function hoge(values: FieldType) {
  const i: Prisma.RaceCreateInput = {
    name: values.name,
    date: values.date!,
    location: values.location!,
    race: values.race!,
    setter: values.setter!,
    management: values.management!,
  };
  return await prisma.race.update({
    where: { id: values.key },
    data: i,
  });
}
