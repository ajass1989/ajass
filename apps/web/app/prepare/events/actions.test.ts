import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { UpdateEventRequestDto, getEvent, updateEvent } from './actions';
import { prisma } from '@repo/database';

describe.concurrent('actions', () => {
  beforeEach(async () => {
    await prisma.event.upsert({
      where: { id: '2023' },
      update: {},
      create: {
        id: '2023',
        name: '大会1',
        date: new Date('2023-02-05'),
        location: '軽井沢プリンスホテルスキー場 パラレルコース',
        race: '大回転（2本:ベストタイム）',
        setter: 'セッター太郎',
        management: '幹事会社A, 幹事会社B',
      },
    });
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe.sequential('getEvent', () => {
    test.sequential('正常系', async () => {
      const event = await getEvent();
      expect(event.name).toBe('大会1');
      expect(event.date.toDateString()).toBe('Sun Feb 05 2023');
      expect(event.location).toBe(
        '軽井沢プリンスホテルスキー場 パラレルコース',
      );
      expect(event.race).toBe('大回転（2本:ベストタイム）');
      expect(event.setter).toBe('セッター太郎');
      expect(event.management).toBe('幹事会社A, 幹事会社B');
    });
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
