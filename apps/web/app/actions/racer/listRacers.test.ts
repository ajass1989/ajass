import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listRacers } from './listRacers';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });
  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listRacers', () => {
    test('正常系 all', async () => {
      const result = await listRacers({});
      expect(result.length).toBe(18);
      const racer51 = result.find((r) => r.id === '51');
      expect(racer51!.age).toBe(65);
      expect(racer51!.ageHandicap).toBe(-5000);
      expect(racer51!.adoptTime).toBe(null);

      const racer1 = result.find((r) => r.id === '1');
      expect(racer1!.age).toBe(20);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);
    });

    test('正常系 f', async () => {
      const result = await listRacers({ gender: 'f' });
      expect(result.length).toBe(8);
    });

    test('正常系 m', async () => {
      const result = await listRacers({ gender: 'm' });
      expect(result.length).toBe(10);
    });

    test('正常系 ski f', async () => {
      const result = await listRacers({ gender: 'f', category: 'ski' });
      expect(result.length).toBe(4);
    });

    test('正常系 snowboard m', async () => {
      const result = await listRacers({ gender: 'm', category: 'snowboard' });
      expect(result.length).toBe(3);
    });

    test('正常系 senior', async () => {
      const result = await listRacers({ special: 'senior' });
      expect(result.length).toBe(2);
    });

    test('正常系 junior', async () => {
      const result = await listRacers({ special: 'junior' });
      expect(result.length).toBe(2);
    });
  });
});
