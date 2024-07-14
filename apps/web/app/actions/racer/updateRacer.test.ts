import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { updateRacer } from './updateRacer';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateRacer', () => {
    test('正常系', async () => {
      const result = await updateRacer('2', {
        name: 'racer2',
        kana: 'レーサー2',
        category: 'snowboard',
        bib: 2,
        gender: 'm',
        seed: 2,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer2');
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateRacer('unknown', {
        name: 'racer2',
        kana: 'レーサー2',
        category: 'snowboard',
        bib: 2,
        gender: 'm',
        seed: 2,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });
});
