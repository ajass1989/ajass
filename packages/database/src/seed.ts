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
    special: 'junior',
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
    special: 'junior',
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
    special: 'junior',
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
    special: 'junior',
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
    special: 'junior',
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
    special: 'junior',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'senior',
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
    special: 'senior',
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
    special: 'senior',
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
    special: 'senior',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
    special: 'normal',
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
            id: racer.id,
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
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
