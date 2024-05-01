import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TEST_EVENTS = [
  {
    id: '2023',
    name: '第35回 全国設計事務所スキー大会',
    date: new Date(2023, 1, 5),
    location: '軽井沢プリンスホテルスキー場 パラレルコース',
    race: '大回転（2本:ベストタイム）',
    setter: 'タクトスキーラボ 椎木 稔',
    management:
      'INA新建築研究所、構造計画研究所、日本設計、安井建築設計事務所、リーゼンスラローム',
  },
];

const TEST_TEAMS = [
  {
    id: 'aaa',
    fullname: '会社A',
    shortname: 'AAA',
    eventId: '2023',
    orderMale: 1,
    orderFemale: 2,
  },
  {
    id: 'bbb',
    fullname: '会社B',
    shortname: 'BBB',
    eventId: '2023',
    orderMale: 2,
    orderFemale: 3,
  },
  {
    id: 'ccc',
    fullname: '会社C',
    shortname: 'CCC',
    eventId: '2023',
    orderMale: 3,
    orderFemale: 1,
  },
];

const TEST_RACERS = [
  // ジュニア
  {
    id: 'male-junior-1',
    name: '男子ジュニア1',
    kana: 'だんしじゅにあ1',
    category: 'ski',
    bib: 1,
    gender: 'm',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: true,
    age: 10,
  },
  {
    id: 'female-junior-2',
    name: '女子ジュニア2',
    kana: 'じょしじゅにあ2',
    category: 'snowboard',
    bib: 2,
    gender: 'f',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: false,
    age: 15,
  },
  {
    id: 'male-junior-3',
    name: '男子ジュニア3',
    kana: 'だんしじゅにあ3',
    category: 'ski',
    bib: 3,
    gender: 'm',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: true,
    age: 13,
  },
  {
    id: 'male-junior-4',
    name: '男子ジュニア4',
    kana: 'だんしじゅにあ4',
    category: 'ski',
    bib: 4,
    gender: 'm',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: true,
    age: 14,
  },
  {
    id: 'female-junior-5',
    name: '女子ジュニア5',
    kana: 'じょしじゅにあ5',
    category: 'snowboard',
    bib: 5,
    gender: 'f',
    seed: 2,
    teamId: 'bbb',
    isFirstTime: false,
    age: 15,
  },
  {
    id: 'male-junior-6',
    name: '男子ジュニア6',
    kana: 'だんしじゅにあ6',
    category: 'ski',
    bib: 6,
    gender: 'm',
    seed: 2,
    teamId: 'ccc',
    isFirstTime: true,
    age: 13,
  },
  // スノボ女子
  {
    id: 'female-snowboard-11',
    name: '女子スノボ11',
    kana: 'じょしすのぼ11',
    category: 'snowboard',
    bib: 11,
    gender: 'f',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: false,
    age: 20,
  },
  {
    id: 'female-snowboard-12',
    name: '女子スノボ12',
    kana: 'じょしすのぼ12',
    category: 'snowboard',
    bib: 12,
    gender: 'f',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: true,
    age: 21,
  },
  {
    id: 'female-snowboard-13',
    name: '女子スノボ13',
    kana: 'じょしすのぼ13',
    category: 'snowboard',
    bib: 13,
    gender: 'f',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: false,
    age: 22,
  },
  {
    id: 'female-snowboard-14',
    name: '女子スノボ14',
    kana: 'じょしすのぼ14',
    category: 'snowboard',
    bib: 14,
    gender: 'f',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: false,
    age: 23,
  },
  {
    id: 'female-snowboard-15',
    name: '女子スノボ15',
    kana: 'じょしすのぼ15',
    category: 'snowboard',
    bib: 15,
    gender: 'f',
    seed: 2,
    teamId: 'bbb',
    isFirstTime: true,
    age: 24,
  },
  {
    id: 'female-snowboard-16',
    name: '女子スノボ16',
    kana: 'じょしすのぼ16',
    category: 'snowboard',
    bib: 16,
    gender: 'f',
    seed: 2,
    teamId: 'ccc',
    isFirstTime: false,
    age: 25,
  },
  // 男子スノボ
  {
    id: 'male-snowboard-21',
    name: '男子スノボ21',
    kana: 'だんしすのぼ21',
    category: 'snowboard',
    bib: 21,
    gender: 'm',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: false,
    age: 48,
  },
  {
    id: 'male-snowboard-22',
    name: '男子スノボ22',
    kana: 'だんしすのぼ22',
    category: 'snowboard',
    bib: 22,
    gender: 'm',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: false,
    age: 49,
  },
  {
    id: 'male-snowboard-23',
    name: '男子スノボ23',
    kana: 'だんしすのぼ23',
    category: 'snowboard',
    bib: 23,
    gender: 'm',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: false,
    age: 50,
  },
  {
    id: 'male-snowboard-24',
    name: '男子スノボ24',
    kana: 'だんしすのぼ24',
    category: 'snowboard',
    bib: 24,
    gender: 'm',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: false,
    age: 51,
  },
  {
    id: 'male-snowboard-25',
    name: '男子スノボ25',
    kana: 'だんしすのぼ25',
    category: 'snowboard',
    bib: 25,
    gender: 'm',
    seed: 2,
    teamId: 'bbb',
    isFirstTime: false,
    age: 52,
  },
  {
    id: 'male-snowboard-26',
    name: '男子スノボ26',
    kana: 'だんしすのぼ26',
    category: 'snowboard',
    bib: 26,
    gender: 'm',
    seed: 2,
    teamId: 'ccc',
    isFirstTime: false,
    age: 53,
  },
  // 女子シニア
  {
    id: 'female-senior-31',
    name: '女子シニアスキー31',
    kana: 'じょししにあすきー31',
    category: 'ski',
    bib: 31,
    gender: 'f',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: false,
    age: 67,
  },
  {
    id: 'female-senior-32',
    name: '女子シニアスキー32',
    kana: 'じょししにあすきー32',
    category: 'snowboard',
    bib: 32,
    gender: 'f',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: false,
    age: 68,
  },
  // 男子シニア
  {
    id: 'male-senior-33',
    name: '男子シニアスキー33',
    kana: 'だんししにあすきー33',
    category: 'ski',
    bib: 33,
    gender: 'm',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: false,
    age: 64,
  },
  {
    id: 'male-senior-34',
    name: '男子シニアスキー34',
    kana: 'だんししにあすきー34',
    category: 'snowboard',
    bib: 34,
    gender: 'm',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: false,
    age: 64,
  },
  // 女子スキー
  {
    id: 'female-41',
    name: '女子スキー41',
    kana: 'じょしすきー41',
    category: 'ski',
    bib: 41,
    gender: 'f',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: false,
    age: 46,
  },
  {
    id: 'female-42',
    name: '女子スキー42',
    kana: 'じょしすきー42',
    category: 'ski',
    bib: 42,
    gender: 'f',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: false,
    age: 40,
  },
  {
    id: 'female-43',
    name: '女子スキー43',
    kana: 'じょしすきー43',
    category: 'ski',
    bib: 43,
    gender: 'f',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: false,
    age: 35,
  },
  {
    id: 'female-44',
    name: '女子スキー44',
    kana: 'じょしすきー44',
    category: 'ski',
    bib: 44,
    gender: 'f',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: false,
    age: 30,
  },
  {
    id: 'female-45',
    name: '女子スキー45',
    kana: 'じょしすきー45',
    category: 'ski',
    bib: 45,
    gender: 'f',
    seed: 2,
    teamId: 'bbb',
    isFirstTime: false,
    age: 25,
  },
  {
    id: 'female-46',
    name: '女子スキー46',
    kana: 'じょしすきー46',
    category: 'ski',
    bib: 46,
    gender: 'f',
    seed: 2,
    teamId: 'ccc',
    isFirstTime: false,
    age: 20,
  },
  // 男子スキー
  {
    id: 'male-51',
    name: '男子スキー51',
    kana: 'だんしすきー51',
    category: 'ski',
    bib: 51,
    gender: 'm',
    seed: 1,
    teamId: 'aaa',
    isFirstTime: false,
    age: 46,
  },
  {
    id: 'male-52',
    name: '男子スキー52',
    kana: 'だんしすきー52',
    category: 'ski',
    bib: 52,
    gender: 'm',
    seed: 1,
    teamId: 'bbb',
    isFirstTime: false,
    age: 40,
  },
  {
    id: 'male-53',
    name: '男子スキー53',
    kana: 'だんしすきー53',
    category: 'ski',
    bib: 53,
    gender: 'm',
    seed: 1,
    teamId: 'ccc',
    isFirstTime: false,
    age: 35,
  },
  {
    id: 'male-54',
    name: '男子スキー54',
    kana: 'だんしすきー54',
    category: 'ski',
    bib: 54,
    gender: 'm',
    seed: 2,
    teamId: 'aaa',
    isFirstTime: false,
    age: 30,
  },
  {
    id: 'male-55',
    name: '男子スキー55',
    kana: 'だんしすきー55',
    category: 'ski',
    bib: 55,
    gender: 'm',
    seed: 2,
    teamId: 'bbb',
    isFirstTime: false,
    age: 25,
  },
  {
    id: 'male-56',
    name: '男子スキー56',
    kana: 'だんしすきー56',
    category: 'ski',
    bib: 56,
    gender: 'm',
    seed: 2,
    teamId: 'ccc',
    isFirstTime: false,
    age: 20,
  },
];

const TEST_RESULTS = [
  {
    id: 'male-junior-1-1',
    set: 1,
    time: 100,
    status: null,
    racerId: 'male-junior-1',
  },
];

(async () => {
  try {
    await Promise.all(
      TEST_EVENTS.map((event) =>
        prisma.event.upsert({
          where: {
            id: event.id,
          },
          update: {
            ...event,
          },
          create: {
            ...event,
          },
        }),
      ),
    );

    await Promise.all(
      TEST_TEAMS.map((team) =>
        prisma.team.upsert({
          where: {
            fullname: team.fullname!,
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
    await Promise.all(
      TEST_RACERS.map((racer) =>
        prisma.racer.upsert({
          where: {
            bib: racer.bib!,
          },
          update: {
            ...racer,
          },
          create: {
            ...racer,
          },
        }),
      ),
    );
    await Promise.all(
      TEST_RESULTS.map((result) =>
        prisma.result.upsert({
          where: {
            set_racerId: {
              set: result.set!,
              racerId: result.racerId!,
            },
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
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
