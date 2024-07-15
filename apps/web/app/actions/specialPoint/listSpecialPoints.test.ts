import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listSpecialPoints } from './listSpecialPoints';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listSpecialPoints', () => {
    test('正常系', async () => {
      const result = await listSpecialPoints();
      expect(result.success).toBeTruthy();
      const booby = result.result!.find((point) => point.id === 'booby');
      expect(booby!.point).toBe(20);
      const boobyMaker = result.result!.find(
        (point) => point.id === 'booby_maker',
      );
      expect(boobyMaker!.point).toBe(15);
    });
  });
});
