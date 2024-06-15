import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import {
  addRacer,
  deleteRacer,
  getTeamWithRacers,
  updateRacer,
  updateSeed,
  updateTeam,
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
    await prisma.racer.upsert({
      where: { id: '1' },
      update: {
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
    await prisma.racer.upsert({
      where: { id: '2' },
      update: {
        name: 'racer2',
        kana: 'レーサー2',
        category: 'ski',
        bib: 2,
        gender: 'f',
        seed: 2,
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
      create: {
        id: '2',
        name: 'racer2',
        kana: 'レーサー2',
        category: 'ski',
        bib: 2,
        gender: 'f',
        seed: 2,
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
    await prisma.racer.upsert({
      where: { id: '3' },
      update: {
        name: 'racer3',
        kana: 'レーサー3',
        category: 'ski',
        bib: 3,
        gender: 'f',
        seed: 3,
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
      create: {
        id: '3',
        name: 'racer3',
        kana: 'レーサー3',
        category: 'ski',
        bib: 3,
        gender: 'f',
        seed: 3,
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

  describe('getTeamWithRacers', () => {
    test('正常系', async () => {
      const result = await getTeamWithRacers('1');
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム1');
      expect(result.result!.racers.length).toBe(3);
      expect(result.result!.racers[0].name).toBe('racer1');
    });

    test('準正常系:存在しないid', async () => {
      const result = await getTeamWithRacers('2');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('指定したチームが見つかりません。');
    });
  });

  describe('updateTeam', () => {
    test('正常系', async () => {
      const result = await updateTeam('1', {
        fullname: 'チーム1+',
        shortname: 'チーム1+',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム1+');
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateTeam('2', {
        fullname: 'チーム1+',
        shortname: 'チーム1+',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('addRacer', () => {
    test('正常系', async () => {
      const result = await addRacer({
        name: 'racer4',
        kana: 'レーサー4',
        category: 'snowboard',
        bib: 4,
        gender: 'm',
        seed: 4,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer4');
    });
  });

  describe('updateRacer', () => {
    test('正常系', async () => {
      const result = await updateRacer('2', {
        name: 'racer2',
        kana: 'レーサー2',
        category: 'snowboard',
        bib: 2,
        gender: 'm',
        seed: 2,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.name).toBe('racer2');
    });

    test('準正常系:存在しないid', async () => {
      const result = await updateRacer('unknown', {
        name: 'racer2',
        kana: 'レーサー2',
        category: 'snowboard',
        bib: 2,
        gender: 'm',
        seed: 2,
        teamId: '1',
        special: 'senior',
        isFirstTime: true,
        age: 65,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('deleteRacer', () => {
    test('正常系', async () => {
      const result = await deleteRacer('1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('3');
      expect(result.result![0].seed).toBe(1);
      expect(result.result![1].seed).toBe(2);
    });

    test('準正常系:存在しないid', async () => {
      const result = await deleteRacer('unknown');
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '削除に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('updateSeed', () => {
    test('正常系:下に移動1->2', async () => {
      const result = await updateSeed('1', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('1');
    });

    test('正常系:下に移動2->3', async () => {
      const result = await updateSeed('2', '3');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('2');
    });

    test('正常系:下に移動1->3', async () => {
      const result = await updateSeed('1', '3');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('3');
      expect(result.result![2].id).toBe('1');
    });

    test('正常系:上に移動3->2', async () => {
      const result = await updateSeed('3', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('2');
    });

    test('正常系:上に移動2->1', async () => {
      const result = await updateSeed('2', '1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('1');
    });

    test('正常系:上に移動3->1', async () => {
      const result = await updateSeed('3', '1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('1');
      expect(result.result![2].id).toBe('2');
    });

    test('正常系:移動なし', async () => {
      const result = await updateSeed('2', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(0);
    });
  });
});
