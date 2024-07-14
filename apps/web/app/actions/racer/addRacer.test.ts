import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { addRacer } from './addRacer';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('addRacer', () => {
    test('正常系', async () => {
      const result = await addRacer({
        name: 'racer99',
        kana: 'レーサー99',
        category: 'snowboard',
        bib: 99,
        gender: 'm',
        seed: 99,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer99');
    });
  });
});
