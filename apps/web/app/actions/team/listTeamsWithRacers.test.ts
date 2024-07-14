import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { listTeamsWithRacers } from './listTeamsWithRacers';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listTeamsWithRacers', () => {
    test('正常系', async () => {
      const actual = await listTeamsWithRacers();
      const team1 = actual.find((team) => team.fullname === 'チーム1');
      expect(team1!.fullname).toBe('チーム1');
      expect(team1!.racers.length).greaterThan(17);
      const racer1 = team1!.racers.find((racer) => racer.name === 'racer1');
      expect(racer1!.name).toBe('racer1');
      expect(racer1!.kana).toBe('レーサー1');
      expect(racer1!.category).toBe('ski');
      expect(racer1!.bib).toBe(1);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.isFirstTime).toBe(false);
      // expect(racer1!.totalOrder).toBe(null);
    });
  });
});
