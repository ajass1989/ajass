'use server';
import { Point, prisma } from '@repo/database';

/**
 * ポイント一覧取得
 * @returns ポイント一覧
 */
export async function listPoints(): Promise<Point[]> {
  return await prisma.point.findMany();
}
