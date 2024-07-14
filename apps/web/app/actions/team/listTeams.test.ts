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
      const team1 = result.find((team) => team.id === '1');
      expect(team1!.fullname).toBe('チーム1');
      const team2 = result.find((team) => team.id === '2');
      expect(team2!.fullname).toBe('チーム2');
    });
  });
});
