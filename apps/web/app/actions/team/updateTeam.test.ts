import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { updateTeam } from './updateTeam';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateTeam', () => {
    test('正常系', async () => {
      const result = await updateTeam('1', {
        fullname: 'チーム1+',
        shortname: 'チーム1+',
        eventId: '2023',
        orderMale: 90,
        orderFemale: 90,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム1+');
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateTeam('unknown', {
        fullname: 'チーム1+',
        shortname: 'チーム1+',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });
});
