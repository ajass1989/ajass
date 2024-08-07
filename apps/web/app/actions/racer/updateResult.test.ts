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
      expect(racer3!.time1).toBe(null);
      expect(racer3!.status2).toBe(null);
      expect(racer3!.time2).toBe(null);
      expect(racer3!.bestTime).toBe(null);
      expect(racer3!.point).toBe(0);
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
      expect(racer3!.time1).toBe(null);
      expect(racer3!.status2).toBe('dq');
      expect(racer3!.time2).toBe(null);
      expect(racer3!.bestTime).toBe(null);
      expect(racer3!.point).toBe(0);
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
      expect(racer1!.status1).toBe(null);
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe(null);
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
      expect(racer1!.status1).toBe(null);
      expect(racer1!.time1).toBe(123456);
      expect(racer1!.status2).toBe(null);
      expect(racer1!.time2).toBe(null);
      expect(racer1!.bestTime).toBe(123456);
      expect(racer1!.point).toBe(130);
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
      expect(racer1!.status1).toBe(null);
      expect(racer1!.time1).toBe(null);
      expect(racer1!.status2).toBe(null);
      expect(racer1!.time2).toBe(123456);
      expect(racer1!.bestTime).toBe(123456);
      expect(racer1!.point).toBe(130);
    });

    test('正常系:3レコード更新:女子スキー', async () => {
      const dto1: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result1 = await updateResult('1', dto1);
      expect(result1.success).toBeTruthy();
      expect(result1.result!.length).toBe(18);

      const racer11 = result1.result!.find((r) => r.id === '1');
      expect(racer11!.id).toBe('1');
      expect(racer11!.status1).toBe(null);
      expect(racer11!.time1).toBe(null);
      expect(racer11!.status2).toBe(null);
      expect(racer11!.time2).toBe(123456);
      expect(racer11!.bestTime).toBe(123456);
      expect(racer11!.point).toBe(130);
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
      expect(racer13!.time1).toBe(null);
      expect(racer13!.status2).toBe(null);
      expect(racer13!.time2).toBe(null);
      expect(racer13!.bestTime).toBe(null);
      expect(racer13!.point).toBe(0);

      const dto2: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123450,
      };
      const result2 = await updateResult('2', dto2);
      expect(result2.success).toBeTruthy();
      expect(result2.result!.length).toBe(18);

      const racer21 = result2.result!.find((r) => r.id === '1');
      expect(racer21!.id).toBe('1');
      expect(racer21!.status1).toBe(null);
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
      expect(racer23!.time1).toBe(null);
      expect(racer23!.status2).toBe(null);
      expect(racer23!.time2).toBe(null);
      expect(racer23!.bestTime).toBe(null);
      expect(racer23!.point).toBe(0);

      const dto3: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123440,
      };
      const result3 = await updateResult('3', dto3);
      expect(result3.success).toBeTruthy();
      expect(result3.result!.length).toBe(18);

      const racer31 = result3.result!.find((r) => r.id === '1');
      expect(racer31!.id).toBe('1');
      expect(racer31!.status1).toBe(null);
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
      expect(racer33!.time1).toBe(null);
      expect(racer33!.status2).toBe(null);
      expect(racer33!.time2).toBe(123440);
      expect(racer33!.bestTime).toBe(123440);
      expect(racer33!.point).toBe(130);
    });

    test('正常系:3レコード更新:男子スキー', async () => {
      const dto1: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123456,
      };
      const result11 = await updateResult('11', dto1);
      expect(result11.success).toBeTruthy();
      expect(result11.result!.length).toBe(18);

      const racer111 = result11.result!.find((r) => r.id === '11');
      expect(racer111!.id).toBe('11');
      expect(racer111!.status1).toBe(null);
      expect(racer111!.time1).toBe(null);
      expect(racer111!.status2).toBe(null);
      expect(racer111!.time2).toBe(123456);
      expect(racer111!.bestTime).toBe(123456);
      expect(racer111!.point).toBe(130);
      const racer112 = result11.result!.find((r) => r.id === '12');
      expect(racer112!.id).toBe('12');
      expect(racer112!.status1).toBe(null);
      expect(racer112!.time1).toBe(null);
      expect(racer112!.status2).toBe(null);
      expect(racer112!.time2).toBe(null);
      expect(racer112!.bestTime).toBe(null);
      expect(racer112!.point).toBe(0);
      const racer113 = result11.result!.find((r) => r.id === '13');
      expect(racer113!.id).toBe('13');
      expect(racer113!.status1).toBe(null);
      expect(racer113!.time1).toBe(null);
      expect(racer113!.status2).toBe(null);
      expect(racer113!.time2).toBe(null);
      expect(racer113!.bestTime).toBe(null);
      expect(racer113!.point).toBe(0);

      const dto2: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123450,
      };
      const result12 = await updateResult('12', dto2);
      expect(result12.success).toBeTruthy();
      expect(result12.result!.length).toBe(18);

      const racer121 = result12.result!.find((r) => r.id === '11');
      expect(racer121!.id).toBe('11');
      expect(racer121!.status1).toBe(null);
      expect(racer121!.time1).toBe(null);
      expect(racer121!.status2).toBe(null);
      expect(racer121!.time2).toBe(123456);
      expect(racer121!.bestTime).toBe(123456);
      expect(racer121!.point).toBe(120);
      const racer122 = result12.result!.find((r) => r.id === '12');
      expect(racer122!.id).toBe('12');
      expect(racer122!.status1).toBe(null);
      expect(racer122!.time1).toBe(null);
      expect(racer122!.status2).toBe(null);
      expect(racer122!.time2).toBe(123450);
      expect(racer122!.bestTime).toBe(123450);
      expect(racer122!.point).toBe(130);
      const racer123 = result12.result!.find((r) => r.id === '13');
      expect(racer123!.id).toBe('13');
      expect(racer123!.status1).toBe(null);
      expect(racer123!.time1).toBe(null);
      expect(racer123!.status2).toBe(null);
      expect(racer123!.time2).toBe(null);
      expect(racer123!.bestTime).toBe(null);
      expect(racer123!.point).toBe(0);

      const dto3: UpdateResultRequestDto = {
        time1: undefined,
        time2: 123440,
      };
      const result13 = await updateResult('13', dto3);
      expect(result13.success).toBeTruthy();
      expect(result13.result!.length).toBe(18);

      const racer131 = result13.result!.find((r) => r.id === '11');
      expect(racer131!.id).toBe('11');
      expect(racer131!.status1).toBe(null);
      expect(racer131!.time1).toBe(null);
      expect(racer131!.status2).toBe(null);
      expect(racer131!.time2).toBe(123456);
      expect(racer131!.bestTime).toBe(123456);
      expect(racer131!.point).toBe(120);
      const racer132 = result13.result!.find((r) => r.id === '12');
      expect(racer132!.id).toBe('12');
      expect(racer132!.status1).toBe(null);
      expect(racer132!.time1).toBe(null);
      expect(racer132!.status2).toBe(null);
      expect(racer132!.time2).toBe(123450);
      expect(racer132!.bestTime).toBe(123450);
      expect(racer132!.point).toBe(120);
      const racer133 = result13.result!.find((r) => r.id === '13');
      expect(racer133!.id).toBe('13');
      expect(racer133!.status1).toBe(null);
      expect(racer133!.time1).toBe(null);
      expect(racer133!.status2).toBe(null);
      expect(racer133!.time2).toBe(123440);
      expect(racer133!.bestTime).toBe(123440);
      expect(racer133!.point).toBe(130);
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
