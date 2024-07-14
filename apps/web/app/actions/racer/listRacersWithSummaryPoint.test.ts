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
      const rowSpanSummary = [6, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 2, 0];
      const points = [
        150, 130, 110, 90, 70, 50, 100, 80, 60, 230, 210, 190, 80, 60,
      ];
      const pointsSummary = [
        550, 550, 550, 550, 550, 550, 180, 180, 180, 440, 440, 440, 80, 80,
      ];
      const genders = [
        'm',
        'm',
        'm',
        'm',
        'm',
        'm',
        'f',
        'f',
        'f',
        'm',
        'm',
        'm',
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
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
      ];

      const result = await listRacersWithSummaryPoint();
      expect(result.length).toBe(14);
      Array.from({ length: result.length }).forEach((_, index) => {
        expect(result[index].rowSpanSummary).toBe(rowSpanSummary[index]);
        expect(result[index].point).toBe(points[index]);
        expect(result[index].summaryPoint).toBe(pointsSummary[index]);
        expect(result[index].gender).toBe(genders[index]);
        expect(result[index].category).toBe(categories[index]);
        expect(result[index].pointGetter).toBe(pointGetter[index]);
      });
    });
  });
});
