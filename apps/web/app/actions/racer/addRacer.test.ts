import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { addRacer } from './addRacer';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await prisma.racer.deleteMany({
      where: {
        name: 'racer99',
      },
    });
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('addRacer', () => {
    test('正常系', async () => {
      const racer99 = {
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
      };
      const result = await addRacer(racer99);
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer99');
    });

    test('正常系', async () => {
      const racer99 = {
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
      };
      const result = await addRacer(racer99);
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer99');

      const result2 = await addRacer(racer99);
      expect(result2.success).toBeFalsy();
      expect(result2.error).toBe('追加に失敗しました。');
    });
  });
});
