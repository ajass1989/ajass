import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { updatePoints } from './updatePoints';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await prisma.racer.deleteMany({});
    await generateTestData(prisma);
  });
  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updatePoints', () => {
    test('正常系', async () => {
      const result = await updatePoints();
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);
      const racer3 = result.result!.find((racer) => racer.id === '3');
      expect(racer3!.point).toBe(0);
      expect(racer3!.specialPoint).toBe(0);
      const racer2 = result.result!.find((racer) => racer.id === '2');
      expect(racer2!.point).toBe(0);
      expect(racer2!.specialPoint).toBe(0);
      const racer1 = result.result!.find((racer) => racer.id === '1');
      expect(racer1!.point).toBe(0);
      expect(racer1!.specialPoint).toBe(0);
    });
  });
});
