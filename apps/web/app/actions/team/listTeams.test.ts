import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listTeams } from './listTeams';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listTeams', () => {
    test('正常系', async () => {
      const result = await listTeams();
      expect(result.length).toBe(2);
    });
  });
});
