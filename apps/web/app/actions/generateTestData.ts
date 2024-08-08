import { PrismaClient } from '@prisma/client';

export async function generateTestData(prisma: PrismaClient) {
  await prisma.event.deleteMany({});
  // await prisma.team.deleteMany({});
  // await prisma.racer.deleteMany({});
  // await prisma.point.deleteMany({});
  // await prisma.specialPoint.deleteMany({});

  await prisma.event.upsert({
    where: { id: '2023' },
    update: {
      name: '大会1',
      date: new Date('2023-02-05'),
      location: '軽井沢プリンスホテルスキー場 パラレルコース',
      race: '大回転（2本:ベストタイム）',
      setter: 'セッター太郎',
      management: '幹事会社A, 幹事会社B',
    },
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

  const TEST_TEAMS = [
    {
      id: '1',
      fullname: 'チーム1',
      shortname: 'チーム1',
      eventId: '2023',
      orderMale: 1,
      orderFemale: 1,
    },
    {
      id: '2',
      fullname: 'チーム2',
      shortname: 'チーム2',
      eventId: '2023',
      orderMale: 2,
      orderFemale: 2,
    },
  ];
  await Promise.all(
    TEST_TEAMS.map(
      async (team) =>
        await prisma.team.upsert({
          where: {
            id: team.id,
          },
          update: {
            ...team,
          },
          create: {
            ...team,
          },
        }),
    ),
  );

  const TEST_RACERS = [
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      point: 0,
      specialPoint: 0,
    },
    {
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
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
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
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
      id: '41',
      name: 'racer41',
      kana: 'レーサー41',
      category: 'ski',
      bib: 41,
      gender: 'm',
      seed: 41,
      teamId: '1',
      special: 'junior',
      isFirstTime: true,
      age: 10,
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
      id: '42',
      name: 'racer42',
      kana: 'レーサー42',
      category: 'snowboard',
      bib: 42,
      gender: 'f',
      seed: 42,
      teamId: '1',
      special: 'junior',
      isFirstTime: false,
      age: 14,
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
      id: '51',
      name: 'racer51',
      kana: 'レーサー51',
      category: 'ski',
      bib: 51,
      gender: 'f',
      seed: 51,
      teamId: '1',
      special: 'senior',
      isFirstTime: true,
      age: 65,
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
    {
      id: '52',
      name: 'racer52',
      kana: 'レーサー52',
      category: 'snowboard',
      bib: 52,
      gender: 'f',
      seed: 52,
      teamId: '1',
      special: 'senior',
      isFirstTime: false,
      age: 75,
      status1: null,
      time1: null,
      status2: null,
      time2: null,
      bestTime: null,
      point: 0,
      specialPoint: 0,
    },
  ];
  await Promise.all(
    TEST_RACERS.map(
      async (result) =>
        await prisma.racer.upsert({
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
  await Promise.all(
    TEST_POINTS.map(
      async (result) =>
        await prisma.point.upsert({
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
    TEST_SPECIAL_POINTS.map(
      async (result) =>
        await prisma.specialPoint.upsert({
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
}
