import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { updateTeamOrder } from './updateTeamOrder';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateTeamOrder', () => {
    test('正常系', async () => {
      const result = await updateTeamOrder('1', 100, 100);
      expect(result.success).toBeTruthy();
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateTeamOrder('unknown', 2, 2);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });

    test('準正常系:滑走順が重複', async () => {
      const result = await updateTeamOrder('1', 2, 2);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。滑走順が重複しています。');
    });
  });
});
