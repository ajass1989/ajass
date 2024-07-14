import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { generateTestData } from '../generateTestData';
import { UpdateResultRequestDto, updateResult } from './updateResult';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });
  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateResult', () => {
    test('正常系:status1=nullで更新', async () => {
      const dto: UpdateResultRequestDto = {
        status1: null,
        status2: undefined,
      };
      const result = await updateResult('2', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);
    });

    test('正常系:status1=dqで更新', async () => {
      const dto: UpdateResultRequestDto = {
        status1: 'dq',
        status2: undefined,
      };
      const result = await updateResult('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe('dq');
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('正常系:status2=nullで更新', async () => {
      const dto: UpdateResultRequestDto = {
        status1: undefined,
        status2: null,
      };
      const result = await updateResult('2', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer2 = result.result!.find((r) => r.id === '2');
      expect(racer2!.id).toBe('2');
      expect(racer2!.status1).toBe(null);
      expect(racer2!.time1).toBe(null);
      expect(racer2!.status2).toBe(null);
      expect(racer2!.time2).toBe(null);
      expect(racer2!.bestTime).toBe(null);
      expect(racer2!.point).toBe(0);
    });

    test('正常系:status2=dqで更新', async () => {
      const dto: UpdateResultRequestDto = {
        status1: undefined,
        status2: 'dq',
      };
      const result = await updateResult('3', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer3 = result.result!.find((r) => r.id === '3');
      expect(racer3!.id).toBe('3');
      expect(racer3!.status1).toBe(null);
      expect(racer3!.time1).toBe(123456);
      expect(racer3!.status2).toBe('dq');
      expect(racer3!.time2).toBe(123456);
      expect(racer3!.bestTime).toBe(123456);
      expect(racer3!.point).toBe(130);
    });

    test('準正常系:存在しないid', async () => {
      const dto: UpdateResultRequestDto = {
        status1: 'dq',
        status2: undefined,
      };
      const result = await updateResult('unknown', dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });

    test('正常系:time1=nullで更新', async () => {
      const dto: UpdateResultRequestDto = {
        time1: null,
        time2: undefined,
      };
      const result = await updateResult('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);
    });

    test('正常系:time1=123456で更新', async () => {
      const dto: UpdateResultRequestDto = {
        time1: 123456,
        time2: undefined,
      };
      const result = await updateResult('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(123456);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);
    });

    test('正常系:time2=nullで更新', async () => {
      const dto: UpdateResultRequestDto = {
        time1: undefined,
        time2: null,
      };
      const result = await updateResult('1', dto);
      expect(result.success).toBeTruthy();

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);
    });

    test('正常系:time2=123456で更新', async () => {
      const dto: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result = await updateResult('1', dto);
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(18);

      const racer1 = result.result!.find((r) => r.id === '1');
      expect(racer1!.id).toBe('1');
      expect(racer1!.status1).toBe('dq');
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe('dq');
      expect(racer1!.time2).toBe(123456);
      expect(racer1!.bestTime).toBe(null);
      expect(racer1!.point).toBe(0);
    });

    test('正常系:3レコード更新', async () => {
      const dto1: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result1 = await updateResult('1', dto1);
      expect(result1.success).toBeTruthy();
      expect(result1.result!.length).toBe(18);

      const racer11 = result1.result!.find((r) => r.id === '1');
      expect(racer11!.id).toBe('1');
      expect(racer11!.status1).toBe('dq');
      expect(racer11!.time1).toBe(null);
      expect(racer11!.status2).toBe('dq');
      expect(racer11!.time2).toBe(123456);
      expect(racer11!.bestTime).toBe(null);
      expect(racer11!.point).toBe(0);

      const dto2: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123450,
      };
      const result2 = await updateResult('2', dto2);
      expect(result2.success).toBeTruthy();
      expect(result2.result!.length).toBe(18);

      const racer22 = result2.result!.find((r) => r.id === '2');
      expect(racer22!.id).toBe('2');
      expect(racer22!.status1).toBe(null);
      expect(racer22!.time1).toBe(null);
      expect(racer22!.status2).toBe(null);
      expect(racer22!.time2).toBe(123450);
      expect(racer22!.bestTime).toBe(123450);
      expect(racer22!.point).toBe(130);

      const dto3: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123440,
      };
      const result3 = await updateResult('3', dto3);
      expect(result3.success).toBeTruthy();
      expect(result3.result!.length).toBe(18);

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
      const dto: UpdateResultRequestDto = {
        time1: 123456,
        time2: 123456,
      };
      const result = await updateResult('unknown', dto);
      expect(result.success).toBeFalsy();
      expect(result.error).toBe(
        '保存に失敗しました。指定したキーが見つかりません。',
      );
    });
  });
});
