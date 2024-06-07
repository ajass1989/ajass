import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import {
  UpdateBibRequestDto,
  UpdateStatusRequestDto,
  UpdateTimeRequestDto,
  listRacers,
  listTeams,
  updateBibs,
  updateStatus,
  updateTime,
} from './actions';
import { prisma } from '@repo/database';

describe('actions', () => {
  beforeEach(async () => {
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
        eventId: '2023',
        fullname: 'team1',
        shortname: 't1',
        orderMale: 1,
        orderFemale: 1,
      },
    });
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
    await prisma.racer.upsert({
      where: { id: '2' },
      update: {},
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
        status1: null,
        time1: null,
        status2: null,
        time2: null,
        bestTime: null,
      },
    });
    await prisma.racer.upsert({
      where: { id: '3' },
      update: {},
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
        status1: null,
        time1: 123456,
        status2: null,
        time2: 123456,
        bestTime: null,
      },
    });
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateBibs', () => {
    test('正常系:存在するid', async () => {
      const dto: UpdateBibRequestDto[] = [
        {
          id: '1',
          bib: 1,
        },
      ];
      const result = await updateBibs(dto);
      expect(result.error).toBeUndefined();
    });

    test('準正常系:存在しないid', async () => {
      const dto: UpdateBibRequestDto[] = [
        {
          id: 'noexist',
          bib: 100,
        },
      ];
      const result = await updateBibs(dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });

    test('準正常系:ビブが重複', async () => {
      const dto: UpdateBibRequestDto[] = [
        {
          id: '2',
          bib: 1,
        },
      ];
      const result = await updateBibs(dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。ビブが重複しています。');
    });
  });

  describe('updateStatus', () => {
    test('正常系:status1=nullで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: null,
        status2: undefined,
      };
      const result = await updateStatus('2', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe(null);
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe(null);
      expect(result.result!.time2).toBe(null);
    });

    test('正常系:status1=dqで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: 'dq',
        status2: undefined,
      };
      const result = await updateStatus('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe('dq');
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe(null);
      expect(result.result!.time2).toBe(123456);
    });

    test('正常系:status2=nullで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: undefined,
        status2: null,
      };
      const result = await updateStatus('2', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe(null);
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe(null);
      expect(result.result!.time2).toBe(null);
    });

    test('正常系:status2=dqで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: undefined,
        status2: 'dq',
      };
      const result = await updateStatus('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe(null);
      expect(result.result!.time1).toBe(123456);
      expect(result.result!.status2).toBe('dq');
      expect(result.result!.time2).toBe(null);
    });

    test('準正常系:存在しないid', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: 'dq',
        status2: undefined,
      };
      const result = await updateStatus('unknown', dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('updateTime', () => {
    test('正常系:time1=nullで更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: null,
        time2: undefined,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe('dq');
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe('dq');
      expect(result.result!.time2).toBe(null);
    });

    test('正常系:time1=123456で更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: 123456,
        time2: undefined,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe(null);
      expect(result.result!.time1).toBe(123456);
      expect(result.result!.status2).toBe('dq');
      expect(result.result!.time2).toBe(null);
    });

    test('正常系:time2=nullで更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: undefined,
        time2: null,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe('dq');
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe('dq');
      expect(result.result!.time2).toBe(null);
    });

    test('正常系:time2=123456で更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.status1).toBe('dq');
      expect(result.result!.time1).toBe(null);
      expect(result.result!.status2).toBe(null);
      expect(result.result!.time2).toBe(123456);
    });

    test('準正常系:存在しないid', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: 123456,
        time2: 123456,
      };
      const result = await updateTime('unknown', dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });

  describe('listRacers', () => {
    test('正常系', async () => {
      const result = await listRacers();
      expect(result.length).toBe(3);
    });
  });

  describe('listTeams', () => {
    test('正常系', async () => {
      const result = await listTeams();
      expect(result.length).toBe(1);
    });
  });
});
