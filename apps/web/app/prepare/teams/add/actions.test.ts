import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { addTeam } from './actions';

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

  describe('addTeam', () => {
    test('正常系', async () => {
      const result = await addTeam({
        fullname: 'チーム2',
        shortname: 'チーム2',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeTruthy();
      expect(result.result!.fullname).toBe('チーム2');
      expect(result.result!.shortname).toBe('チーム2');
      expect(result.result!.orderMale).toBe(2);
      expect(result.result!.orderFemale).toBe(2);
    });

    test('準正常系:重複したチーム名', async () => {
      const result = await addTeam({
        fullname: 'チーム1',
        shortname: 'チーム2',
        eventId: '2023',
        orderMale: 2,
        orderFemale: 2,
      });
      expect(result.success).toBeFalsy();
      expect(result.error).toBe('保存に失敗しました。キーが重複しています。');
    });
  });
});
