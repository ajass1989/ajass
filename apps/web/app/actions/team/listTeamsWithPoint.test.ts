import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { listTeamsWithPoint } from './listTeamsWithPoint';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listTeamsWithPoint', () => {
    test('正常系', async () => {
      const result = await listTeamsWithPoint();
      expect(result.length).toBe(2);
      expect(result[0].point).toBe(1250);
    });
  });
});
