import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { getTeamWithRacers } from './getTeamWithRacers';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('getTeamWithRacers', () => {
    test('正常系', async () => {
      const result = await getTeamWithRacers('1');
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム1');
      expect(result.result!.racers.length).toBe(18);
      const racer15 = result.result!.racers.find((r) => r.id === '1');
      expect(racer15!.name).toBe('racer1');
    });

    test('準正常系:存在しないid', async () => {
      const result = await getTeamWithRacers('unknown');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('指定したチームが見つかりません。');
    });
  });
});
