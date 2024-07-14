import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { listRacersWithSummaryPoint } from './listRacersWithSummaryPoint';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';

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
      const points = [
        150, 130, 110, 90, 70, 50, 0, 100, 80, 60, 0, 230, 210, 190, 80, 60, 0,
        0,
      ];
      const pointsSummary = [
        550, 550, 550, 550, 550, 550, 550, 180, 180, 180, 180, 440, 440, 440,
        80, 80, 80, 80,
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
