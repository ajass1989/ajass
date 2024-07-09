import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { getPoints, updatePoint } from './actions';
import { prisma } from '@repo/database';

describe('actions', () => {
  beforeEach(async () => {
    await prisma.point.deleteMany({});
    await prisma.point.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        pointSkiMale: 1,
        pointSkiFemale: 2,
        pointSnowboardMale: 3,
        pointSnowboardFemale: 4,
      },
    });
    await prisma.point.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        pointSkiMale: 5,
        pointSkiFemale: 6,
        pointSnowboardMale: 7,
        pointSnowboardFemale: 8,
      },
    });
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('getPoints', () => {
    test('正常系', async () => {
      const points = await getPoints();
      expect(points.length).toBe(2);
    });
  });

  describe('updatePoint', () => {
    test('正常系', async () => {
      const result = await updatePoint(1, {
        pointSkiMale: 10,
        pointSkiFemale: 20,
        pointSnowboardMale: 30,
        pointSnowboardFemale: 40,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.pointSkiMale).toBe(10);
      expect(result.result!.pointSkiFemale).toBe(20);
      expect(result.result!.pointSnowboardMale).toBe(30);
      expect(result.result!.pointSnowboardFemale).toBe(40);
    });
  });
});
