import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listRacers } from './listRacers';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });
  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listRacers', () => {
    test('正常系', async () => {
      const result = await listRacers({});
      expect(result.length).toBe(18);
    });
  });
});
