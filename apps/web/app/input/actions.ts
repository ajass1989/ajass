'use server';
import { Result, prisma } from '@repo/database';

export async function getResults(): Promise<Result[]> {
  return await prisma.result.findMany();
}
