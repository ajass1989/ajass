import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { deleteTeam } from './deleteTeam';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('deleteTeam', () => {
    test('正常系', async () => {
      const result = await deleteTeam('1');
      expect(result.success).toBeTruthy();
    });

    test('準正常系:存在しないid', async () => {
      const result = await deleteTeam('unknown');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '削除に失敗しました。指定したキーが見つかりません。',
      );
    });
  });
});
