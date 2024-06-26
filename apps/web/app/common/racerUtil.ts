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

export const renderResult = (status: string | null, time: number | null) => {
  return status || renderTime(time);
};

export const parseTime = (formatTime?: string) => {
  if (formatTime === '') return null;
  if (!formatTime) return undefined;
  const parts = formatTime.split(':');
  let ms = 0;
  if (parts.length === 2) {
    const [min, sec] = parts;
    ms += dayjs.duration({ minutes: parseInt(min) }).asMilliseconds();
    ms += dayjs.duration({ seconds: parseFloat(sec) }).asMilliseconds();
  } else if (parts.length === 1) {
    const [sec] = parts;
    ms += dayjs.duration({ seconds: parseFloat(sec) }).asMilliseconds();
  } else {
    return undefined;
  }
  return ms;
};

// 種目のフォーマット
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
      summary += gender == 'f' ? '女子' : '男子';
      summary += category == 'ski' ? 'スキー' : 'スノボ';
      break;
  }
  return summary;
};

export const summaryWithoutSpecial = (
  gender: GenderType,
  category: CategoryType,
) => {
  let summary = '';
  summary += gender == 'f' ? '女子' : '男子';
  summary += category == 'ski' ? 'スキー' : 'スノボ';
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

export const getRowStyleByPoint = (
  gender: GenderType,
  category: CategoryType,
  special: SpecialType,
  pointGetter: boolean,
) => {
  if (!pointGetter) {
    return { backgroundColor: bgColorDefault };
  }
  return getRowStyle(gender, category, special);
};
