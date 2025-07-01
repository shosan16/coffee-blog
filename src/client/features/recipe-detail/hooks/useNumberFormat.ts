import { useMemo } from 'react';

export type UseNumberFormatReturn = {
  formatWithCommas: (num: number) => string;
  formatWeight: (weight: number, showUnit?: boolean) => string;
  formatTemperature: (temperature: number, showUnit?: boolean) => string;
  formatViewCount: (viewCount: number, showUnit?: boolean) => string;
  formatPercentage: (value: number, isDecimal?: boolean, decimalPlaces?: number) => string;
  formatDecimal: (num: number, decimalPlaces?: number) => string;
  formatRange: (min: number, max: number, unit?: string) => string;
  formatRatio: (value1: number, value2: number, simplify?: boolean) => string;
};

/**
 * 数値フォーマット用カスタムフック
 *
 * レシピ詳細画面で使用される数値フォーマット処理を一元化する。
 * ビュー数、重量、温度、時間などの表示に使用される。
 */
export function useNumberFormat(): UseNumberFormatReturn {
  return useMemo(
    () => ({
      /**
       * 数値をカンマ区切りでフォーマット
       *
       * @param num - フォーマットする数値
       * @returns カンマ区切りの数値文字列
       *
       * @example
       * formatWithCommas(1234) // "1,234"
       * formatWithCommas(1234567) // "1,234,567"
       */
      formatWithCommas: (num: number): string => {
        return num.toLocaleString('ja-JP');
      },

      /**
       * グラム単位での重量表示
       *
       * @param weight - 重量（グラム）
       * @param showUnit - 単位を表示するかどうか（デフォルト: true）
       * @returns フォーマット済みの重量文字列
       *
       * @example
       * formatWeight(15) // "15g"
       * formatWeight(15, false) // "15"
       * formatWeight(1000) // "1,000g"
       */
      formatWeight: (weight: number, showUnit: boolean = true): string => {
        const formatted = weight.toLocaleString('ja-JP');
        return showUnit ? `${formatted}g` : formatted;
      },

      /**
       * 温度表示（摂氏）
       *
       * @param temperature - 温度（摂氏）
       * @param showUnit - 単位を表示するかどうか（デフォルト: true）
       * @returns フォーマット済みの温度文字列
       *
       * @example
       * formatTemperature(93) // "93°C"
       * formatTemperature(93, false) // "93"
       */
      formatTemperature: (temperature: number, showUnit: boolean = true): string => {
        const formatted = temperature.toLocaleString('ja-JP');
        return showUnit ? `${formatted}°C` : formatted;
      },

      /**
       * ビュー数表示（適切な単位で表示）
       *
       * @param viewCount - ビュー数
       * @param showUnit - 単位を表示するかどうか（デフォルト: true）
       * @returns フォーマット済みのビュー数文字列
       *
       * @example
       * formatViewCount(1234) // "1,234回"
       * formatViewCount(1234, false) // "1,234"
       * formatViewCount(0) // "0回"
       */
      formatViewCount: (viewCount: number, showUnit: boolean = true): string => {
        const formatted = viewCount.toLocaleString('ja-JP');
        return showUnit ? `${formatted}回` : formatted;
      },

      /**
       * パーセンテージ表示
       *
       * @param value - 値（0-1の範囲、または0-100の範囲）
       * @param isDecimal - 0-1の範囲の値かどうか（デフォルト: false）
       * @param decimalPlaces - 小数点以下の桁数（デフォルト: 1）
       * @returns フォーマット済みのパーセンテージ文字列
       *
       * @example
       * formatPercentage(0.85, true) // "85.0%"
       * formatPercentage(85) // "85.0%"
       * formatPercentage(85.5, false, 1) // "85.5%"
       */
      formatPercentage: (
        value: number,
        isDecimal: boolean = false,
        decimalPlaces: number = 1
      ): string => {
        const percentage = isDecimal ? value * 100 : value;
        return `${percentage.toFixed(decimalPlaces)}%`;
      },

      /**
       * 小数点以下を適切に丸めて表示
       *
       * @param num - フォーマットする数値
       * @param decimalPlaces - 小数点以下の桁数（デフォルト: 1）
       * @returns フォーマット済みの数値文字列
       *
       * @example
       * formatDecimal(3.14159, 2) // "3.14"
       * formatDecimal(3.0, 1) // "3.0"
       * formatDecimal(3) // "3.0"
       */
      formatDecimal: (num: number, decimalPlaces: number = 1): string => {
        return num.toFixed(decimalPlaces);
      },

      /**
       * 範囲表示（最小値 - 最大値）
       *
       * @param min - 最小値
       * @param max - 最大値
       * @param unit - 単位（オプション）
       * @returns フォーマット済みの範囲文字列
       *
       * @example
       * formatRange(15, 20, 'g') // "15g - 20g"
       * formatRange(15, 20) // "15 - 20"
       * formatRange(1500, 2000, 'ml') // "1,500ml - 2,000ml"
       */
      formatRange: (min: number, max: number, unit?: string): string => {
        const formattedMin = min.toLocaleString('ja-JP');
        const formattedMax = max.toLocaleString('ja-JP');

        if (unit) {
          return `${formattedMin}${unit} - ${formattedMax}${unit}`;
        }

        return `${formattedMin} - ${formattedMax}`;
      },

      /**
       * 比率表示（X:Y形式）
       *
       * @param value1 - 第1の値
       * @param value2 - 第2の値
       * @param simplify - 比率を簡約するかどうか（デフォルト: true）
       * @returns フォーマット済みの比率文字列
       *
       * @example
       * formatRatio(15, 250) // "3:50" (簡約後)
       * formatRatio(15, 250, false) // "15:250"
       * formatRatio(1, 16) // "1:16"
       */
      formatRatio: (value1: number, value2: number, simplify: boolean = true): string => {
        if (!simplify) {
          return `${value1.toLocaleString('ja-JP')}:${value2.toLocaleString('ja-JP')}`;
        }

        // 最大公約数を求めて簡約
        const gcd = (a: number, b: number): number => {
          return b === 0 ? a : gcd(b, a % b);
        };

        const divisor = gcd(value1, value2);
        const simplifiedValue1 = value1 / divisor;
        const simplifiedValue2 = value2 / divisor;

        return `${simplifiedValue1.toLocaleString('ja-JP')}:${simplifiedValue2.toLocaleString('ja-JP')}`;
      },
    }),
    []
  );
}
