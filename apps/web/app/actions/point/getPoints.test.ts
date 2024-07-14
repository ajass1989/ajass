import { afterEach, beforeEach, describe, expect, test } from 'vitest';
// import { getPoints } from './updatePoint';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { getPoints } from './getPoints';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
    // await prisma.point.deleteMany({});
    // await prisma.point.upsert({
    //   where: { id: 1 },
    //   update: {},
    //   create: {
    //     id: 1,
    //     pointSkiMale: 1,
    //     pointSkiFemale: 2,
    //     pointSnowboardMale: 3,
    //     pointSnowboardFemale: 4,
    //   },
    // });
    // await prisma.point.upsert({
    //   where: { id: 2 },
    //   update: {},
    //   create: {
    //     id: 2,
    //     pointSkiMale: 5,
    //     pointSkiFemale: 6,
    //     pointSnowboardMale: 7,
    //     pointSnowboardFemale: 8,
    //   },
    // });
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
});
