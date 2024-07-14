'use server';
import { Point, prisma } from '@repo/database';

export async function getPoints(): Promise<Point[]> {
  return await prisma.point.findMany();
}
