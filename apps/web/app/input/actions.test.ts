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
        bestTime: 123456,
      },
    });
    const TEST_POINTS = [
      {
        id: 1,
        pointSkiMale: 130,
        pointSkiFemale: 130,
        pointSnowboardMale: 65,
        pointSnowboardFemale: 65,
      },
      {
        id: 2,
        pointSkiMale: 120,
        pointSkiFemale: 105,
        pointSnowboardMale: 56,
        pointSnowboardFemale: 42,
      },
      {
        id: 3,
        pointSkiMale: 112,
        pointSkiFemale: 90,
        pointSnowboardMale: 48,
        pointSnowboardFemale: 30,
      },
      {
        id: 4,
        pointSkiMale: 105,
        pointSkiFemale: 78,
        pointSnowboardMale: 41,
        pointSnowboardFemale: 25,
      },
      {
        id: 5,
        pointSkiMale: 100,
        pointSkiFemale: 68,
        pointSnowboardMale: 35,
        pointSnowboardFemale: 20,
      },
      {
        id: 6,
        pointSkiMale: 95,
        pointSkiFemale: 60,
        pointSnowboardMale: 32,
        pointSnowboardFemale: 15,
      },
      {
        id: 7,
        pointSkiMale: 90,
        pointSkiFemale: 52,
        pointSnowboardMale: 29,
        pointSnowboardFemale: 10,
      },
      {
        id: 8,
        pointSkiMale: 86,
        pointSkiFemale: 46,
        pointSnowboardMale: 26,
        pointSnowboardFemale: 7,
      },
      {
        id: 9,
        pointSkiMale: 82,
        pointSkiFemale: 40,
        pointSnowboardMale: 23,
        pointSnowboardFemale: 6,
      },
      {
        id: 10,
        pointSkiMale: 78,
        pointSkiFemale: 35,
        pointSnowboardMale: 20,
        pointSnowboardFemale: 5,
      },
      {
        id: 11,
        pointSkiMale: 74,
        pointSkiFemale: 30,
        pointSnowboardMale: 18,
        pointSnowboardFemale: 5,
      },
      {
        id: 12,
        pointSkiMale: 71,
        pointSkiFemale: 26,
        pointSnowboardMale: 16,
        pointSnowboardFemale: 5,
      },
      {
        id: 13,
        pointSkiMale: 68,
        pointSkiFemale: 23,
        pointSnowboardMale: 14,
        pointSnowboardFemale: 5,
      },
      {
        id: 14,
        pointSkiMale: 65,
        pointSkiFemale: 20,
        pointSnowboardMale: 12,
        pointSnowboardFemale: 5,
      },
      {
        id: 15,
        pointSkiMale: 62,
        pointSkiFemale: 18,
        pointSnowboardMale: 10,
        pointSnowboardFemale: 5,
      },
      {
        id: 16,
        pointSkiMale: 59,
        pointSkiFemale: 16,
        pointSnowboardMale: 9,
        pointSnowboardFemale: 5,
      },
      {
        id: 17,
        pointSkiMale: 56,
        pointSkiFemale: 15,
        pointSnowboardMale: 8,
        pointSnowboardFemale: 5,
      },
      {
        id: 18,
        pointSkiMale: 53,
        pointSkiFemale: 14,
        pointSnowboardMale: 7,
        pointSnowboardFemale: 5,
      },
      {
        id: 19,
        pointSkiMale: 50,
        pointSkiFemale: 13,
        pointSnowboardMale: 6,
        pointSnowboardFemale: 5,
      },
      {
        id: 20,
        pointSkiMale: 48,
        pointSkiFemale: 12,
        pointSnowboardMale: 5,
        pointSnowboardFemale: 5,
      },
      {
        id: 21,
        pointSkiMale: 46,
        pointSkiFemale: 11,
        pointSnowboardMale: 4,
        pointSnowboardFemale: 5,
      },
      {
        id: 22,
        pointSkiMale: 44,
        pointSkiFemale: 10,
        pointSnowboardMale: 3,
        pointSnowboardFemale: 5,
      },
      {
        id: 23,
        pointSkiMale: 42,
        pointSkiFemale: 9,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 24,
        pointSkiMale: 40,
        pointSkiFemale: 8,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 25,
        pointSkiMale: 39,
        pointSkiFemale: 7,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 26,
        pointSkiMale: 37,
        pointSkiFemale: 6,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 27,
        pointSkiMale: 36,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 28,
        pointSkiMale: 34,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 29,
        pointSkiMale: 33,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 30,
        pointSkiMale: 31,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 31,
        pointSkiMale: 30,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 32,
        pointSkiMale: 28,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 33,
        pointSkiMale: 27,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 34,
        pointSkiMale: 26,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 35,
        pointSkiMale: 25,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 36,
        pointSkiMale: 24,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 37,
        pointSkiMale: 23,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 38,
        pointSkiMale: 22,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 39,
        pointSkiMale: 21,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 40,
        pointSkiMale: 20,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 41,
        pointSkiMale: 19,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 42,
        pointSkiMale: 19,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 43,
        pointSkiMale: 18,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 44,
        pointSkiMale: 18,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 45,
        pointSkiMale: 17,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 46,
        pointSkiMale: 17,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 47,
        pointSkiMale: 16,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 48,
        pointSkiMale: 16,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 49,
        pointSkiMale: 15,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 50,
        pointSkiMale: 15,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 51,
        pointSkiMale: 14,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 52,
        pointSkiMale: 14,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 53,
        pointSkiMale: 14,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 54,
        pointSkiMale: 13,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 55,
        pointSkiMale: 13,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 56,
        pointSkiMale: 13,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 57,
        pointSkiMale: 12,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 58,
        pointSkiMale: 12,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 59,
        pointSkiMale: 12,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 60,
        pointSkiMale: 11,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 61,
        pointSkiMale: 11,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 62,
        pointSkiMale: 11,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 63,
        pointSkiMale: 10,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 64,
        pointSkiMale: 10,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 65,
        pointSkiMale: 10,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 66,
        pointSkiMale: 9,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 67,
        pointSkiMale: 9,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 68,
        pointSkiMale: 9,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 69,
        pointSkiMale: 8,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 70,
        pointSkiMale: 8,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 71,
        pointSkiMale: 8,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 72,
        pointSkiMale: 7,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 73,
        pointSkiMale: 7,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 74,
        pointSkiMale: 7,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 75,
        pointSkiMale: 7,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 76,
        pointSkiMale: 6,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 77,
        pointSkiMale: 6,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 78,
        pointSkiMale: 6,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 79,
        pointSkiMale: 6,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 80,
        pointSkiMale: 5,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 81,
        pointSkiMale: 5,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 82,
        pointSkiMale: 5,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 83,
        pointSkiMale: 5,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 84,
        pointSkiMale: 5,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 85,
        pointSkiMale: 4,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 86,
        pointSkiMale: 4,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 87,
        pointSkiMale: 4,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 88,
        pointSkiMale: 4,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 89,
        pointSkiMale: 4,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 90,
        pointSkiMale: 3,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 91,
        pointSkiMale: 3,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 92,
        pointSkiMale: 3,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 93,
        pointSkiMale: 3,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 94,
        pointSkiMale: 3,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 95,
        pointSkiMale: 2,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 96,
        pointSkiMale: 2,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 97,
        pointSkiMale: 2,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 98,
        pointSkiMale: 2,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
      {
        id: 99,
        pointSkiMale: 2,
        pointSkiFemale: 5,
        pointSnowboardMale: 2,
        pointSnowboardFemale: 5,
      },
    ];

    const TEST_SPECIAL_POINTS = [
      {
        id: 'booby',
        point: 20,
      },
      {
        id: 'booby_maker',
        point: 15,
      },
    ];

    await Promise.all(
      TEST_POINTS.map((result) =>
        prisma.point.upsert({
          where: {
            id: result.id,
          },
          update: {
            ...result,
          },
          create: {
            ...result,
          },
        }),
      ),
    );
    await Promise.all(
      TEST_SPECIAL_POINTS.map((result) =>
        prisma.specialPoint.upsert({
          where: {
            id: result.id,
          },
          update: {
            ...result,
          },
          create: {
            ...result,
          },
        }),
      ),
    );
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
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:status1=dqで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: 'dq',
        status2: undefined,
      };
      const result = await updateStatus('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe('dq');
      expect(racer3!.time1).toBe(null);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:status2=nullで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: undefined,
        status2: null,
      };
      const result = await updateStatus('2', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:status2=dqで更新', async () => {
      const dto: UpdateStatusRequestDto = {
        status1: undefined,
        status2: 'dq',
      };
      const result = await updateStatus('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe('dq');
      expect(racer3!.time2).toBe(null);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
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
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:time1=123456で更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: 123456,
        time2: undefined,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe(null);
      expect(racer1!.time1).toBe(123456);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(123456);
      expect(racer1!.point).toBe(105);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:time2=nullで更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: undefined,
        time2: null,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:time2=123456で更新', async () => {
      const dto: UpdateTimeRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result = await updateTime('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe(null);
      expect(racer1!.time2).toBe(123456);
      expect(racer1!.bestTime).toBe(123456);
      expect(racer1!.point).toBe(105);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
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
