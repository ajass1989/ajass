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
      const team1 = result.find((team) => team.id === '1');
      expect(team1!.point).toBe(1250);
      const team2 = result.find((team) => team.id === '2');
      expect(team2!.point).toBe(0);
    });
  });
});
