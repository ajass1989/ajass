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

    await prisma.point.deleteMany({});
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

    test('正常系:3レコード更新', async () => {
      const dto1: UpdateTimeRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result1 = await updateTime('1', dto1);
      expect(result1.success).toBeTruthy();
      expect(result1.result!.length).toBe(3);

      const racer11 = result1.result!.find((r) => r.id === '1');
      expect(racer11!.id).toBe('1');
      expect(racer11!.status1).toBe('dq');
      expect(racer11!.time1).toBe(null);
      expect(racer11!.status2).toBe(null);
      expect(racer11!.time2).toBe(123456);
      expect(racer11!.bestTime).toBe(123456);
      expect(racer11!.point).toBe(105);

      const racer12 = result1.result!.find((r) => r.id === '2');
      expect(racer12!.id).toBe('2');
      expect(racer12!.status1).toBe(null);
      expect(racer12!.time1).toBe(null);
      expect(racer12!.status2).toBe(null);
      expect(racer12!.time2).toBe(null);
      expect(racer12!.bestTime).toBe(null);
      expect(racer12!.point).toBe(0);

      const racer13 = result1.result!.find((r) => r.id === '3');
      expect(racer13!.id).toBe('3');
      expect(racer13!.status1).toBe(null);
      expect(racer13!.time1).toBe(123456);
      expect(racer13!.status2).toBe(null);
      expect(racer13!.time2).toBe(123456);
      expect(racer13!.bestTime).toBe(123456);
      expect(racer13!.point).toBe(130);

      const dto2: UpdateTimeRequestDto = {
        time1: undefined,
        time2: 123450,
      };
      const result2 = await updateTime('2', dto2);
      expect(result2.success).toBeTruthy();
      expect(result2.result!.length).toBe(3);

      const racer21 = result2.result!.find((r) => r.id === '1');
      expect(racer21!.id).toBe('1');
      expect(racer21!.status1).toBe('dq');
      expect(racer21!.time1).toBe(null);
      expect(racer21!.status2).toBe(null);
      expect(racer21!.time2).toBe(123456);
      expect(racer21!.bestTime).toBe(123456);
      expect(racer21!.point).toBe(105);

      const racer22 = result2.result!.find((r) => r.id === '2');
      expect(racer22!.id).toBe('2');
      expect(racer22!.status1).toBe(null);
      expect(racer22!.time1).toBe(null);
      expect(racer22!.status2).toBe(null);
      expect(racer22!.time2).toBe(123450);
      expect(racer22!.bestTime).toBe(123450);
      expect(racer22!.point).toBe(130);

      const racer23 = result2.result!.find((r) => r.id === '3');
      expect(racer23!.id).toBe('3');
      expect(racer23!.status1).toBe(null);
      expect(racer23!.time1).toBe(123456);
      expect(racer23!.status2).toBe(null);
      expect(racer23!.time2).toBe(123456);
      expect(racer23!.bestTime).toBe(123456);
      expect(racer23!.point).toBe(105);

      const dto3: UpdateTimeRequestDto = {
        time1: undefined,
        time2: 123440,
      };
      const result3 = await updateTime('3', dto3);
      expect(result3.success).toBeTruthy();
      expect(result3.result!.length).toBe(3);

      const racer31 = result3.result!.find((r) => r.id === '1');
      expect(racer31!.id).toBe('1');
      expect(racer31!.status1).toBe('dq');
      expect(racer31!.time1).toBe(null);
      expect(racer31!.status2).toBe(null);
      expect(racer31!.time2).toBe(123456);
      expect(racer31!.bestTime).toBe(123456);
      expect(racer31!.point).toBe(105);

      const racer32 = result3.result!.find((r) => r.id === '2');
      expect(racer32!.id).toBe('2');
      expect(racer32!.status1).toBe(null);
      expect(racer32!.time1).toBe(null);
      expect(racer32!.status2).toBe(null);
      expect(racer32!.time2).toBe(123450);
      expect(racer32!.bestTime).toBe(123450);
      expect(racer32!.point).toBe(105);

      const racer33 = result3.result!.find((r) => r.id === '3');
      expect(racer33!.id).toBe('3');
      expect(racer33!.status1).toBe(null);
      expect(racer33!.time1).toBe(123456);
      expect(racer33!.status2).toBe(null);
      expect(racer33!.time2).toBe(123440);
      expect(racer33!.bestTime).toBe(123440);
      expect(racer33!.point).toBe(130);
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
