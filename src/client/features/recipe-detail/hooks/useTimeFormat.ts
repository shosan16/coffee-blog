import { useMemo } from 'react';

export type UseTimeFormatReturn = {
  formatSeconds: (seconds: number) => string;
  splitMinutesAndSeconds: (seconds: number) => { minutes: number; seconds: number };
  formatTimeRange: (startSeconds: number, endSeconds: number) => string;
  formatTimeAsMinuteColon: (seconds: number) => string;
  formatTimeRangeWithDuration: (startSeconds: number, endSeconds: number) => string;
};

/**
 * 秒数を「N分N秒」形式に変換する内部ヘルパー関数
 *
 * @param seconds - 変換する秒数
 * @returns フォーマット済みの時間文字列
 */
function formatSecondsToJapanese(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${seconds}秒`;
  } else if (remainingSeconds === 0) {
    return `${minutes}分`;
  } else {
    return `${minutes}分${remainingSeconds}秒`;
  }
}

/**
 * 秒数を「m:ss」形式に変換する内部ヘルパー関数
 *
 * @param seconds - 変換する秒数
 * @returns m:ss形式の時間文字列
 */
function formatSecondsToMinuteColon(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * 時間フォーマット用カスタムフック
 *
 * レシピ詳細画面で使用される様々な時間フォーマット処理を一元化する。
 * 秒数を分かりやすい時間表記に変換したり、分秒形式に分解したりする。
 */
export function useTimeFormat(): UseTimeFormatReturn {
  return useMemo(
    () => ({
      /**
       * 秒数を分かりやすい時間表記に変換
       *
       * @param seconds - 変換する秒数
       * @returns フォーマット済みの時間文字列
       *
       * @example
       * formatSeconds(30) // "30秒"
       * formatSeconds(60) // "1分"
       * formatSeconds(90) // "1分30秒"
       */
      formatSeconds: formatSecondsToJapanese,

      /**
       * 秒数を分と秒に分解
       *
       * @param seconds - 分解する秒数
       * @returns 分と秒の値を含むオブジェクト
       *
       * @example
       * splitMinutesAndSeconds(90) // { minutes: 1, seconds: 30 }
       * splitMinutesAndSeconds(30) // { minutes: 0, seconds: 30 }
       */
      splitMinutesAndSeconds: (seconds: number) => ({
        minutes: Math.floor(seconds / 60),
        seconds: seconds % 60,
      }),

      /**
       * 時間範囲の表示用フォーマット
       *
       * @param startSeconds - 開始時間（秒）
       * @param endSeconds - 終了時間（秒）
       * @returns フォーマット済みの時間範囲文字列
       *
       * @example
       * formatTimeRange(30, 90) // "30秒 - 1分30秒"
       */
      formatTimeRange: (startSeconds: number, endSeconds: number): string => {
        return `${formatSecondsToJapanese(startSeconds)} - ${formatSecondsToJapanese(endSeconds)}`;
      },

      /**
       * 秒数を「m:ss」形式に変換
       *
       * @param seconds - 変換する秒数
       * @returns m:ss形式の時間文字列
       *
       * @example
       * formatTimeAsMinuteColon(0) // "0:00"
       * formatTimeAsMinuteColon(20) // "0:20"
       * formatTimeAsMinuteColon(90) // "1:30"
       */
      formatTimeAsMinuteColon: formatSecondsToMinuteColon,

      /**
       * 時間範囲を経過時間付きでフォーマット
       *
       * @param startSeconds - 開始時間（秒）
       * @param endSeconds - 終了時間（秒）
       * @returns 「m:ss - m:ss（経過時間）」形式の文字列
       *
       * @example
       * formatTimeRangeWithDuration(0, 20) // "0:00 - 0:20（20秒）"
       * formatTimeRangeWithDuration(50, 110) // "0:50 - 1:50（1分）"
       */
      formatTimeRangeWithDuration: (startSeconds: number, endSeconds: number): string => {
        const duration = endSeconds - startSeconds;
        return `${formatSecondsToMinuteColon(startSeconds)} - ${formatSecondsToMinuteColon(endSeconds)}（${formatSecondsToJapanese(duration)}）`;
      },
    }),
    []
  );
}
