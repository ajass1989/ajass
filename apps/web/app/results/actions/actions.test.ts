import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { listRacersWithSummaryPoint, listTeamsWithPoint } from './actions';
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
        point: 100,
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
        point: 80,
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
        point: 60,
      },
    });
    await prisma.racer.upsert({
      where: { id: '11' },
      update: {},
      create: {
        id: '11',
        name: 'racer11',
        kana: 'レーサー11',
        category: 'ski',
        bib: 11,
        gender: 'm',
        seed: 11,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 150,
      },
    });
    await prisma.racer.upsert({
      where: { id: '12' },
      update: {},
      create: {
        id: '12',
        name: 'racer12',
        kana: 'レーサー12',
        category: 'ski',
        bib: 12,
        gender: 'm',
        seed: 12,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 130,
      },
    });
    await prisma.racer.upsert({
      where: { id: '13' },
      update: {},
      create: {
        id: '13',
        name: 'racer13',
        kana: 'レーサー13',
        category: 'ski',
        bib: 13,
        gender: 'm',
        seed: 13,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 110,
      },
    });
    await prisma.racer.upsert({
      where: { id: '14' },
      update: {},
      create: {
        id: '14',
        name: 'racer14',
        kana: 'レーサー14',
        category: 'ski',
        bib: 14,
        gender: 'm',
        seed: 14,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 90,
      },
    });
    await prisma.racer.upsert({
      where: { id: '15' },
      update: {},
      create: {
        id: '15',
        name: 'racer15',
        kana: 'レーサー15',
        category: 'ski',
        bib: 15,
        gender: 'm',
        seed: 15,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 70,
      },
    });
    await prisma.racer.upsert({
      where: { id: '16' },
      update: {},
      create: {
        id: '16',
        name: 'racer16',
        kana: 'レーサー16',
        category: 'ski',
        bib: 16,
        gender: 'm',
        seed: 16,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 50,
      },
    });
    // snowboard/f
    await prisma.racer.upsert({
      where: { id: '21' },
      update: {},
      create: {
        id: '21',
        name: 'racer21',
        kana: 'レーサー21',
        category: 'snowboard',
        bib: 21,
        gender: 'f',
        seed: 21,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 80,
      },
    });
    await prisma.racer.upsert({
      where: { id: '22' },
      update: {},
      create: {
        id: '22',
        name: 'racer22',
        kana: 'レーサー22',
        category: 'snowboard',
        bib: 22,
        gender: 'f',
        seed: 22,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 60,
      },
    });
    // snowboard/m
    await prisma.racer.upsert({
      where: { id: '31' },
      update: {},
      create: {
        id: '31',
        name: 'racer31',
        kana: 'レーサー31',
        category: 'snowboard',
        bib: 31,
        gender: 'm',
        seed: 31,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 230,
      },
    });
    await prisma.racer.upsert({
      where: { id: '32' },
      update: {},
      create: {
        id: '32',
        name: 'racer32',
        kana: 'レーサー32',
        category: 'snowboard',
        bib: 32,
        gender: 'm',
        seed: 32,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 210,
      },
    });
    await prisma.racer.upsert({
      where: { id: '33' },
      update: {},
      create: {
        id: '33',
        name: 'racer33',
        kana: 'レーサー33',
        category: 'snowboard',
        bib: 33,
        gender: 'm',
        seed: 33,
        teamId: '1',
        special: 'normal',
        isFirstTime: false,
        age: 20,
        status1: 'dq',
        time1: null,
        status2: 'dq',
        time2: null,
        bestTime: null,
        point: 190,
      },
    });
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('listTeamsWithPoint', () => {
    test('正常系', async () => {
      const result = await listTeamsWithPoint();
      expect(result.length).toBe(1);
      expect(result[0].point).toBe(1250);
    });
  });

  describe('listRacersWithSummaryPoint', () => {
    test('正常系', async () => {
      const result = await listRacersWithSummaryPoint();
      expect(result.length).toBe(14);
      // expect(result[0].teamId).toBe('1');
      // expect(result[0].point).toBe(240);
    });
  });
});
