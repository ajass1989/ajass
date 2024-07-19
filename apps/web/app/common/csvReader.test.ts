import { describe, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCSV, validateData } from './csvReader';

describe('parseCSV', () => {
  test('正常系', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-normal.csv'),
    );
    const parsed = await parseCSV(content.toString());
    expect(parsed.length).toBe(17);
    expect(parsed[0].name).toBe('田中　太郎');
    expect(parsed[0].kana).toBe('たなか　たろう');
    expect(parsed[1].age).toBe(51);
    expect(parsed[1].gender).toBe('f');
    expect(parsed[2].snowboardFemale).toBe(false);
    expect(parsed[2].snowboardMale).toBe(false);
    expect(parsed[2].junior).toBe(true);
    expect(parsed[2].skiFemale).toBe(false);
    expect(parsed[2].skiMale).toBe(false);
    expect(parsed[2].seed).toBe(1);
    expect(parsed[2].isFirstTime).toBeFalsy();
  });

  test('異常系-形式不正', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-invalid-format.csv'),
    );
    expect(async () => {
      await parseCSV(content.toString());
    }).rejects.toThrow(
      'Invalid Record Length: columns length is 11, got 10 on line 2',
    );
  });
});

describe('validateData', () => {
  test('正常系', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-normal.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(errors.length).toBe(0);
  });

  test('異常系-値不正', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-invalid-values.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(errors.includes('行 2: 選手名が指定されていません')).toBeTruthy();
    expect(errors.includes('行 3: ふりがなが指定されていません')).toBeTruthy();
    expect(
      errors.includes('行 4: ジュニアは15歳以下である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 5: シニアは60歳以上である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 6: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 7: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 8: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 9: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
  });
});
