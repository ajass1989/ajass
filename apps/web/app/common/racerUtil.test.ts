import { describe, expect, test } from 'vitest';
import { parseTime, renderTime, summary } from './racerUtil';
import { CategoryType, GenderType, SpecialType } from './types';

describe('renderTime', () => {
  test('正常系:time=1秒', () => {
    const actual = renderTime(1000);
    expect(actual).toBe('00:01.00');
  });

  test('正常系:time=1分', () => {
    const actual = renderTime(60000);
    expect(actual).toBe('01:00.00');
  });

  test('正常系:time=1分23秒', () => {
    const actual = renderTime(83000);
    expect(actual).toBe('01:23.00');
  });

  test('正常系:time=1分23秒45', () => {
    const actual = renderTime(83450);
    expect(actual).toBe('01:23.45');
  });

  test('準正常系:time=null', () => {
    const actual = renderTime(null);
    expect(actual).toBe('');
  });
});

describe('parseTime', () => {
  const testCases = [
    { time: '00:01.00', expected: 1000 },
    { time: '01:00.00', expected: 60000 },
    { time: '01:23.00', expected: 83000 },
    { time: '01:23.45', expected: 83450 },
    { time: '01:24.350', expected: 84350 },
    { time: '01:59.999', expected: 119999 },
    { time: '01:59.99', expected: 119990 },
    { time: '01:59.9', expected: 119900 },
    { time: '01:59', expected: 119000 },
    { time: '01:24.35', expected: 84350 },
    { time: '99:59.999', expected: 5999999 },
    { time: '00:00.01', expected: 10 },
    { time: '1:24.35', expected: 84350 },
    { time: '24.35', expected: 24350 },
    { time: '4.35', expected: 4350 },
    { time: '0.35', expected: 350 },
    { time: '0.1', expected: 100 },
    { time: '', expected: undefined },
    { time: undefined, expected: undefined },
  ];

  test('正常系', () => {
    testCases.forEach((testCase) => {
      const actual = parseTime(testCase.time);
      expect(actual).toBe(testCase.expected);
    });
  });
});

describe('summary', () => {
  const testCases = [
    { special: 'senior', gender: 'm', category: 'ski', expected: 'シニア' },
    {
      special: 'senior',
      gender: 'm',
      category: 'snowboard',
      expected: 'シニア',
    },
    { special: 'senior', gender: 'f', category: 'ski', expected: 'シニア' },
    {
      special: 'senior',
      gender: 'f',
      category: 'snowboard',
      expected: 'シニア',
    },
    { special: 'junior', gender: 'f', category: 'ski', expected: 'ジュニア' },
    {
      special: 'junior',
      gender: 'f',
      category: 'snowboard',
      expected: 'ジュニア',
    },
    { special: 'normal', gender: 'm', category: 'ski', expected: '男子スキー' },
    {
      special: 'normal',
      gender: 'm',
      category: 'snowboard',
      expected: '男子スノボ',
    },
    { special: 'normal', gender: 'f', category: 'ski', expected: '女子スキー' },
    {
      special: 'normal',
      gender: 'f',
      category: 'snowboard',
      expected: '女子スノボ',
    },
  ];

  test('正常系', () => {
    testCases.forEach((testCase) => {
      const actual = summary(
        testCase.special as SpecialType,
        testCase.gender as GenderType,
        testCase.category as CategoryType,
      );
      expect(actual).toBe(testCase.expected);
    });
  });
});