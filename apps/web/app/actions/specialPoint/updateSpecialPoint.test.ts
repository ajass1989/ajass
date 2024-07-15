import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { updateSpecialPoint } from './updateSpecialPoint';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateSpecialPoint', () => {
    test('正常系', async () => {
      const result = await updateSpecialPoint({
        boobyPoint: 99,
        boobyMakerPoint: 98,
      });
      expect(result.success).toBeTruthy();
      const booby = result.result!.find((p) => p.id === 'booby');
      expect(booby!.point).toBe(99);
      const boobyMaker = result.result!.find((p) => p.id === 'booby_maker');
      expect(boobyMaker!.point).toBe(98);
    });
  });
});
