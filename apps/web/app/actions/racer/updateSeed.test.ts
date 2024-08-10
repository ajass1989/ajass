import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { prisma } from '@repo/database';
import { updateSeed } from './updateSeed';
import { generateTestData } from '../generateTestData';

describe('actions', () => {
  beforeEach(async () => {
    await generateTestData(prisma);
  });

  afterEach(() => {
    prisma.$disconnect();
  });

  describe('updateSeed:special=normal', () => {
    test('正常系:下に移動1->2', async () => {
      const result = await updateSeed('1', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('1');
    });

    test('正常系:下に移動2->3', async () => {
      const result = await updateSeed('2', '3');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('2');
    });

    test('正常系:下に移動1->3', async () => {
      const result = await updateSeed('1', '3');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('3');
      expect(result.result![2].id).toBe('1');
    });

    test('正常系:上に移動3->2', async () => {
      const result = await updateSeed('3', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('2');
    });

    test('正常系:上に移動2->1', async () => {
      const result = await updateSeed('2', '1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('2');
      expect(result.result![1].id).toBe('1');
    });

    test('正常系:上に移動3->1', async () => {
      const result = await updateSeed('3', '1');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(3);
      expect(result.result![0].id).toBe('3');
      expect(result.result![1].id).toBe('1');
      expect(result.result![2].id).toBe('2');
    });

    test('正常系:移動なし', async () => {
      const result = await updateSeed('2', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(0);
    });
  });

  describe('updateSeed:special=junior', () => {
    test('正常系:下に移動41->42', async () => {
      const result = await updateSeed('41', '42');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('42');
      expect(result.result![1].id).toBe('41');
    });

    test('正常系:上に移動42->41', async () => {
      const result = await updateSeed('42', '41');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(2);
      expect(result.result![0].id).toBe('42');
      expect(result.result![1].id).toBe('41');
    });

    test('正常系:移動なし', async () => {
      const result = await updateSeed('2', '2');
      expect(result.success).toBeTruthy();
      expect(result.result!.length).toBe(0);
    });
  });
});
