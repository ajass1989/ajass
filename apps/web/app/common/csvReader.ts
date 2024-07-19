// import { parse } from 'csv-parse/browser/esm';
import { parse } from 'csv-parse';

// 共通のCSV属性
export interface CsvCommonType {
  [key: string]: string | boolean | number | undefined;
}

// CSVのユーザー属性
export type CsvRacerType = CsvCommonType & {
  name: string;
  kana: string;
  age?: number;
  gender: string;
  snowboardFemale: boolean;
  snowboardMale: boolean;
  junior: boolean;
  skiFemale: boolean;
  senior: boolean;
  skiMale: boolean;
  other: boolean;
  seed: number;
  isFirstTime: boolean;
};

// CSVデータをパースする関数
export const parseCSV = (content: string): Promise<CsvRacerType[]> => {
  return new Promise((resolve, reject) => {
    const records: CsvRacerType[] = [];
    const parser = parse({
      delimiter: ',',
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true, // BOM付きUTF-8
    });
    parser.on('readable', () => {
      let record;
      while ((record = parser.read()) !== null) {
        records.push({
          name: record['選手名'].toString(),
          kana: record['ふりがな'].toString(),
          age: record['年齢']
            ? Number.parseInt(record['年齢'].toString())
            : undefined,
          gender: record['性別'].toLowerCase(),
          snowboardFemale: record['女子スノボ'] ? true : false,
          snowboardMale: record['男子スノボ'] ? true : false,
          junior: record['ジュニア'] ? true : false,
          skiFemale: record['女子スキー'] ? true : false,
          senior: record['シニア'] ? true : false,
          skiMale: record['男子スキー'] ? true : false,
          other: record['応援'] ? true : false,
          seed: Number.parseInt(record['種目別シード'].toString()),
          isFirstTime: record['初レース参加'] ? true : false,
        });
      }
    });

    // 形式エラー
    parser.on('error', (err) => {
      reject(err);
    });

    // パース終了
    parser.on('end', () => {
      resolve(records);
    });

    // 指定されたコンテンツをパーサーに書き込み、解析を開始する
    parser.write(content);
    // パーサーにデータの書き込みが完了したことを通知し、解析処理を終了する
    parser.end();
  });
};

export const validateData = (data: CsvRacerType[]): string[] => {
  const errors: string[] = [];

  data.forEach((record, index) => {
    // 選手名の確認
    if (!record.name) {
      errors.push(`行 ${index + 2}: 選手名が指定されていません`);
    }
    // ふりがなの確認
    if (!record.kana) {
      errors.push(`行 ${index + 2}: ふりがなが指定されていません`);
    }
    // ジュニアの場合、15歳以下
    if (record.junior && record.age! > 15) {
      errors.push(`行 ${index + 2}: ジュニアは15歳以下である必要があります`);
    }
    // シニアの場合、60歳以上
    if (record.senior && record.age! < 60) {
      errors.push(`行 ${index + 2}: シニアは60歳以上である必要があります`);
    }
    // 男子と女子の整合性
    if (record.gender === 'f' && (record.skiMale || record.snowboardMale)) {
      errors.push(
        `行 ${index + 2}: 女子選手は男子の種目に登録することはできません`,
      );
    }
    if (record.gender === 'm' && (record.skiFemale || record.snowboardFemale)) {
      errors.push(
        `行 ${index + 2}: 男子選手は女子の種目に登録することはできません`,
      );
    }
  });
  return errors;
};
