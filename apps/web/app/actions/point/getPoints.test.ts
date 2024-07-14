import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listPoints } from './getPoints';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('getPoints', () => {
    test('正常系', async () => {
      const points = await listPoints();
      expect(points.length).toBe(2);
    });
  });
});
