import { describe, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseCSV, validateData } from './csvReader';

describe('parseCSV', () => {
  test('entry-正常系', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-正常系.csv'),
    );
    const parsed = await parseCSV(content.toString());
    expect(parsed.length).toBe(17);
    expect(parsed[0].name).toBe('女子スノボ1');
    expect(parsed[0].kana).toBe('じょし　すのぼ1');
    expect(parsed[0].age).toBe(51);
    expect(parsed[0].gender).toBe('f');
    expect(parsed[0].snowboardFemale).toBe(true);
    expect(parsed[0].snowboardMale).toBe(false);
    expect(parsed[0].skiFemale).toBe(false);
    expect(parsed[0].skiMale).toBe(false);
    expect(parsed[0].junior).toBe(false);
    expect(parsed[0].senior).toBe(false);
    expect(parsed[0].other).toBe(false);
    expect(parsed[0].seed).toBe(1);
    expect(parsed[0].isFirstTime).toBe(false);
    expect(parsed[15].name).toBe('シニア男子スノボ4');
    expect(parsed[15].kana).toBe('しにあだんし　すのぼ4');
    expect(parsed[15].age).toBe(63);
    expect(parsed[15].gender).toBe('m');
    expect(parsed[15].snowboardFemale).toBe(false);
    expect(parsed[15].snowboardMale).toBe(true);
    expect(parsed[15].skiFemale).toBe(false);
    expect(parsed[15].skiMale).toBe(false);
    expect(parsed[15].junior).toBe(false);
    expect(parsed[15].senior).toBe(true);
    expect(parsed[15].other).toBe(false);
    expect(parsed[15].seed).toBe(4);
    expect(parsed[15].isFirstTime).toBe(true);
  });

  test('entry-異常系-長さ不足', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-異常系-長さ不足.csv'),
    );
    expect(async () => {
      await parseCSV(content.toString());
    }).rejects.toThrow(
      'Invalid Record Length: columns length is 12, got 13 on line 2',
    );
  });

  test('entry-異常系-型誤り', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-異常系-型誤り.csv'),
    );
    const parsed = await parseCSV(content.toString());
    expect(parsed.length).toBe(17);
    expect(parsed[0].name).toBe('女子スノボ1');
    expect(parsed[0].age).toBe(NaN);
  });
});

describe('validateData', () => {
  test('entry-正常系', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-正常系.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(errors.length).toBe(0);
  });

  test('entry-準正常系-必須項目空', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-準正常系-必須項目空.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(errors.includes('行 2: 選手名が指定されていません')).toBeTruthy();
    expect(errors.includes('行 3: ふりがなが指定されていません')).toBeTruthy();
    expect(
      errors.includes('行 6: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 7: 競技参加者の種目別シードが指定されていません'),
    ).toBeTruthy();
  });

  test('entry-準正常系-性別誤り', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-準正常系-性別誤り.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(
      errors.includes('行 2: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 4: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 6: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 8: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 10: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 12: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 14: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 16: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
  });

  test('entry-準正常系-年齢誤り', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-準正常系-年齢誤り.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(
      errors.includes('行 10: ジュニアは15歳以下である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 11: ジュニアは15歳以下である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 14: シニアは60歳以上である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 15: シニアは60歳以上である必要があります'),
    ).toBeTruthy();
  });

  test('entry-準正常系-シード誤り', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-準正常系-シード誤り.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(
      errors.includes('女子スノボの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('男子スノボの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('女子スキーの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('男子スキーの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('ジュニアの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('シニアの種目別シードが一意でありません'),
    ).toBeTruthy();
  });

  test('entry-準正常系-種目誤り', async () => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../../test/entry-準正常系-種目誤り.csv'),
    );
    const parsed = await parseCSV(content.toString());
    const errors = validateData(parsed);
    expect(
      errors.includes('行 2: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 2: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 4: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 4: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 6: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 6: 女子選手は男子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 8: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 10: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 13: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 13: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('行 16: ジュニアは15歳以下である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 17: 競技または応援いずれか1つを指定してください'),
    ).toBeTruthy();
    expect(
      errors.includes('行 17: ジュニアは15歳以下である必要があります'),
    ).toBeTruthy();
    expect(
      errors.includes('行 17: 男子選手は女子の種目に登録することはできません'),
    ).toBeTruthy();
    expect(
      errors.includes('男子スノボの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('女子スキーの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('男子スキーの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('ジュニアの種目別シードが一意でありません'),
    ).toBeTruthy();
    expect(
      errors.includes('シニアの種目別シードが一意でありません'),
    ).toBeTruthy();
  });
});
