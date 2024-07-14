import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { CategoryType, GenderType, SpecialType } from './types';
import {
  bgColorDefault,
  bgColorJunior,
  bgColorSenior,
  bgColorSkiFemale,
  bgColorSkiMale,
  bgColorSnowboardFemale,
  bgColorSnowboardMale,
} from './colors';

dayjs.extend(duration);

/**
 * タイムの描画
 * @param time タイム
 * @returns 描画用のタイム
 */
export const renderTime = (time: number | null) => {
  if (!time) {
    return '';
  }
  const timeDuration = dayjs.duration(time, 'milliseconds');
  const minutes = timeDuration.minutes().toString().padStart(2, '0');
  const seconds = timeDuration.seconds().toString().padStart(2, '0');
  const milliseconds = (timeDuration.milliseconds() / 10)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
};

/**
 * 結果の描画（タイム＋状態）
 * @param status 状態
 * @param time タイム
 * @returns 描画用の結果
 */
export const renderResult = (status: string | null, time: number | null) => {
  return status || renderTime(time);
};

/**
 * タイムのパース
 * @param formatTime 6桁の数字
 * @returns タイム（ミリ秒）
 */
export const parseTime = (formatTime?: string) => {
  if (formatTime === '') return null;
  if (!formatTime) return undefined;

  const min = formatTime.substring(0, 2);
  const sec = formatTime.substring(2, 4);
  let ms = 0;
  ms += dayjs.duration({ minutes: parseInt(min) }).asMilliseconds();
  ms += dayjs.duration({ seconds: parseInt(sec) }).asMilliseconds();
  ms += parseInt(formatTime.substring(4, 6)) * 10;
  return ms;
};

/**
 * 種目のフォーマット
 * @param special 特別枠（シニア、ジュニア）
 * @param gender 性別（男性、女性）
 * @param category 競技（スキー、スノボ）
 * @returns 描画用の種目
 */
export const summary = (
  special: SpecialType,
  gender: GenderType,
  category: CategoryType,
) => {
  let summary = '';
  switch (special) {
    case 'senior':
      summary += 'シニア';
      break;
    case 'junior':
      summary += 'ジュニア';
      break;
    case 'normal':
      summary += category == 'ski' ? 'スキー' : 'スノボ';
      summary += gender == 'f' ? '女子' : '男子';
      break;
  }
  return summary;
};

/**
 * 特別枠なしの種目のフォーマット
 * @param gender 性別（男性、女性）
 * @param category 競技（スキー、スノボ）
 * @returns 描画用の種目
 */
export const summaryWithoutSpecial = (
  gender: GenderType,
  category: CategoryType,
) => {
  let summary = '';
  summary += category == 'ski' ? 'スキー' : 'スノボ';
  summary += gender == 'f' ? '女子' : '男子';
  return summary;
};

/**
 * 行スタイルを取得
 * @param record
 * @returns
 */
export const getRowStyle = (
  gender: GenderType,
  category: CategoryType,
  special: SpecialType,
) => {
  if (special == 'junior') {
    return { backgroundColor: bgColorJunior };
  }
  if (special == 'senior') {
    return { backgroundColor: bgColorSenior };
  }
  if (gender == 'f' && category == 'ski') {
    return { backgroundColor: bgColorSkiFemale };
  }
  if (gender == 'm' && category == 'ski') {
    return { backgroundColor: bgColorSkiMale };
  }
  if (gender == 'f' && category == 'snowboard') {
    return { backgroundColor: bgColorSnowboardFemale };
  }
  if (gender == 'm' && category == 'snowboard') {
    return { backgroundColor: bgColorSnowboardMale };
  }
  return { backgroundColor: bgColorDefault };
};

/**
 * 特別枠無しの行スタイルを取得
 * @param record
 * @returns
 */
export const getRowStyleWithoutSpecial = (
  gender: GenderType,
  category: CategoryType,
) => {
  if (gender == 'f' && category == 'ski') {
    return { backgroundColor: bgColorSkiFemale };
  }
  if (gender == 'm' && category == 'ski') {
    return { backgroundColor: bgColorSkiMale };
  }
  if (gender == 'f' && category == 'snowboard') {
    return { backgroundColor: bgColorSnowboardFemale };
  }
  if (gender == 'm' && category == 'snowboard') {
    return { backgroundColor: bgColorSnowboardMale };
  }
  return { backgroundColor: bgColorDefault };
};

/**
 *
 * @param gender
 * @param category
 * @param special
 * @param pointGetter
 * @returns
 */
export const getRowStyleByPoint = (
  gender: GenderType,
  category: CategoryType,
  pointGetter: boolean,
) => {
  if (!pointGetter) {
    return { backgroundColor: bgColorDefault };
  }
  return getRowStyleWithoutSpecial(gender, category);
};
