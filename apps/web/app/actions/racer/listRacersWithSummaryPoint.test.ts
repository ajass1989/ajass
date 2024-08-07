import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { listRacersWithSummaryPoint } from './listRacersWithSummaryPoint';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { updateResult, UpdateResultRequestDto } from './updateResult';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listRacersWithSummaryPoint', () => {
    test('正常系', async () => {
      const rowSpanSummary = [
        7, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 4, 0, 0, 0,
      ];
      const points = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      const pointsSummary = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ];
      const genders = [
        'm',
        'm',
        'm',
        'm',
        'm',
        'm',
        'm',
        'f',
        'f',
        'f',
        'f',
        'm',
        'm',
        'm',
        'f',
        'f',
        'f',
        'f',
      ];
      const categories = [
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
      ];
      const pointGetter = [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        true,
        false,
        false,
        false,
      ];

      const result = await listRacersWithSummaryPoint();
      expect(result.length).toBe(18);
      Array.from({ length: result.length }).forEach((_, index) => {
        expect(result[index].rowSpanSummary, `index: ${index}`).toBe(
          rowSpanSummary[index],
        );
        expect(result[index].point, `index: ${index}`).toBe(points[index]);
        expect(result[index].summaryPoint, `index: ${index}`).toBe(
          pointsSummary[index],
        );
        expect(result[index].gender, `index: ${index}`).toBe(genders[index]);
        expect(result[index].category, `index: ${index}`).toBe(
          categories[index],
        );
        expect(result[index].pointGetter, `index: ${index}`).toBe(
          pointGetter[index],
        );
      });
    });
  });

  describe('updateResult & listRacersWithSummaryPoint', () => {
    test('正常系', async () => {
      const dto1: UpdateResultRequestDto = {
        time1: 123456,
      };
      const dto2: UpdateResultRequestDto = {
        time1: 123455,
      };
      // スキー女子
      await updateResult('1', dto1);
      await updateResult('2', dto2);
      // スキー男子
      await updateResult('11', dto1);
      await updateResult('12', dto2);
      // スノボ女子
      await updateResult('21', dto1);
      await updateResult('22', dto2);
      // スノボ男子
      await updateResult('31', dto1);
      await updateResult('32', dto2);

      const rowSpanSummary = [
        7, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 3, 0, 0, 4, 0, 0, 0,
      ];
      const points = [
        130, 120, 0, 0, 0, 0, 0, 130, 105, 0, 0, 65, 56, 0, 65, 42, 0, 0,
      ];
      const pointsSummary = [
        250, 250, 250, 250, 250, 250, 250, 235, 235, 235, 235, 121, 121, 121,
        65, 65, 65, 65,
      ];
      const genders = [
        'm',
        'm',
        'm',
        'm',
        'm',
        'm',
        'm',
        'f',
        'f',
        'f',
        'f',
        'm',
        'm',
        'm',
        'f',
        'f',
        'f',
        'f',
      ];
      const categories = [
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'ski',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
        'snowboard',
      ];
      const pointGetter = [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        true,
        false,
        true,
        false,
        false,
        false,
      ];

      const result = await listRacersWithSummaryPoint();
      expect(result.length).toBe(18);
      Array.from({ length: result.length }).forEach((_, index) => {
        expect(result[index].rowSpanSummary, `index: ${index}`).toBe(
          rowSpanSummary[index],
        );
        expect(result[index].point, `index: ${index}`).toBe(points[index]);
        expect(result[index].summaryPoint, `index: ${index}`).toBe(
          pointsSummary[index],
        );
        expect(result[index].gender, `index: ${index}`).toBe(genders[index]);
        expect(result[index].category, `index: ${index}`).toBe(
          categories[index],
        );
        expect(result[index].pointGetter, `index: ${index}`).toBe(
          pointGetter[index],
        );
      });
    });
  });
});
