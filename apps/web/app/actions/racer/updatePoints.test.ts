import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { updatePoints } from './updatePoints';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });
  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updatePoints', () => {
    test('正常系', async () => {
      const result = await updatePoints();
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(14);
      expect(result.result!.find((racer) => racer.id === '3')!.point).toBe(130);
      expect(
        result.result!.find((racer) => racer.id === '3')!.specialPoint,
      ).toBe(20);
      expect(result.result!.find((racer) => racer.id === '2')!.point).toBe(0);
      expect(
        result.result!.find((racer) => racer.id === '2')!.specialPoint,
      ).toBe(0);
      expect(result.result!.find((racer) => racer.id === '1')!.point).toBe(0);
      expect(
        result.result!.find((racer) => racer.id === '1')!.specialPoint,
      ).toBe(15);
    });
  });
});
