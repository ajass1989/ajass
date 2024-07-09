import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import {
  deleteTeam,
  listTeams,
  listTeamsWithRacers,
  updateTeamOrder,
} from './actions';

describe('actions', () => {
  beforeEach(async () => {
    await prisma.event.deleteMany({});
    await prisma.event.upsert({
      where: { id: '2023' },
      update: {},
      create: {
        id: '2023',
        name: '大会1',
        date: new Date('2023-02-05'),
        location: '軽井沢プリンスホテルスキー場 パラレルコース',
        race: '大回転（2本:ベストタイム）',
        setter: 'セッター太郎',
        management: '幹事会社A, 幹事会社B',
      },
    });
    await prisma.team.deleteMany({});
    await prisma.team.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        fullname: 'チーム1',
        shortname: 'チーム1',
        eventId: '2023',
        orderMale: 1,
        orderFemale: 1,
      },
    });
    await prisma.team.upsert({
      where: { id: '2' },
      update: {},
      create: {
        id: '2',
        fullname: 'チーム2',
        shortname: 'チーム2',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      },
    });
    await prisma.racer.deleteMany({});
    await prisma.racer.upsert({
      where: { id: '1' },
      update: {},
      create: {
        id: '1',
        name: 'racer1',
        kana: 'レーサー1',
        category: 'ski',
        bib: 1,
        gender: 'f',
        seed: 1,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
      },
    });
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listTeamsWithRacers', () => {
    test('正常系', async () => {
      const actual = await listTeamsWithRacers();
      expect(actual.length).toBe(2);
      expect(actual[0].fullname).toBe('チーム1');
      expect(actual[0].racers.length).toBe(1);
      expect(actual[0].racers[0].name).toBe('racer1');
    });
  });

  describe('listTeams', () => {
    test('正常系', async () => {
      const actual = await listTeams();
      expect(actual.length).toBe(2);
      expect(actual[0].fullname).toBe('チーム1');
    });
  });

  describe('deleteTeam', () => {
    test('正常系', async () => {
      const result = await deleteTeam('1');
      expect(result.success).toBeTruthy();
    });

    test('準正常系:存在しないid', async () => {
      const result = await deleteTeam('unknown');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '削除に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('updateTeamOrder', () => {
    test('正常系', async () => {
      const result = await updateTeamOrder('1', 100, 100);
      expect(result.success).toBeTruthy();
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateTeamOrder('unknown', 2, 2);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });

    test('準正常系:滑走順が重複', async () => {
      const result = await updateTeamOrder('1', 2, 2);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。滑走順が重複しています。');
    });
  });
});
