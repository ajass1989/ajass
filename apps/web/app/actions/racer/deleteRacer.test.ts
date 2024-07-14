import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { deleteRacer } from './deleteRacer';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('deleteRacer', () => {
    test('正常系', async () => {
      const result = await deleteRacer('1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('3');
      expect(result.result![0].seed).toBe(1);
      expect(result.result![1].seed).toBe(2);
    });

    test('準正常系:存在しないid', async () => {
      const result = await deleteRacer('unknown');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '削除に失敗しました。指定したキーが見つかりません。',
      );
    });
  });
});
