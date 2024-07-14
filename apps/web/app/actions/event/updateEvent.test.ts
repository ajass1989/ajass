import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { UpdateEventRequestDto, updateEvent } from './updateEvent';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';

describe.concurrent('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe.sequential('updateEvent', () => {
    test.sequential('正常系', async () => {
      const dto: UpdateEventRequestDto = {
        name: '大会2',
        date: new Date('2024-02-05').toISOString(),
        location: '熊の湯温泉スキー場',
        race: '大回転（2本:合計タイム）',
        setter: 'セッター次郎',
        management: '幹事会社C, 幹事会社D',
      };

      const result = await updateEvent('2023', dto);
      expect(result.success).toBe(true);
      expect(result.result!.name).toBe('大会2');
      expect(result.result!.date.toDateString()).toBe('Mon Feb 05 2024');
      expect(result.result!.location).toBe('熊の湯温泉スキー場');
      expect(result.result!.race).toBe('大回転（2本:合計タイム）');
      expect(result.result!.setter).toBe('セッター次郎');
      expect(result.result!.management).toBe('幹事会社C, 幹事会社D');
    });
  });
});
