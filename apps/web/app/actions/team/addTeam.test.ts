import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { addTeam } from './addTeam';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('addTeam', () => {
    test('正常系', async () => {
      const result = await addTeam({
        fullname: 'チーム10',
        shortname: 'チーム10',
        eventId: '2023',
        orderMale: 10,
        orderFemale: 10,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム10');
      expect(result.result!.shortname).toBe('チーム10');
      expect(result.result!.orderMale).toBe(10);
      expect(result.result!.orderFemale).toBe(10);
    });

    test('準正常系:重複したチーム名', async () => {
      const result = await addTeam({
        fullname: 'チーム1',
        shortname: 'チーム2',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。キーが重複しています。');
    });
  });
});
