import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { UpdateBibRequestDto, updateBib } from './updateBib';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateBib', () => {
    test('正常系:存在するid', async () => {
      const dto: UpdateBibRequestDto = {
        id: '1',
        bib: 100,
      };
      const result = await updateBib(dto);
      expect(result.error).toBeUndefined();
    });

    test('準正常系:存在しないid', async () => {
      const dto: UpdateBibRequestDto = {
        id: 'noexist',
        bib: 100,
      };
      const result = await updateBib(dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });

    test('準正常系:ビブが重複', async () => {
      const dto: UpdateBibRequestDto = {
        id: '2',
        bib: 1,
      };
      const result = await updateBib(dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。ビブが重複しています。');
    });
  });
});
