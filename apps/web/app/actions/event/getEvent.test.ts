import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { getEvent } from './getEvent';

describe.concurrent('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
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
});
