import { format, isValid } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useMemo } from 'react';

type DateInput = Date | string | null | undefined;

export type UseDateFormatReturn = {
  formatDate: (date: DateInput, formatPattern?: string) => string | null;
  formatDateTime: (date: DateInput) => string | null;
  formatRelativeDate: (date: DateInput) => string | null;
  isValidDate: (date: DateInput) => boolean;
  formatISODate: (isoString: string | null | undefined) => string | null;
};

/**
 * 日付フォーマット用カスタムフック
 *
 * レシピ詳細画面で使用される日付フォーマット処理を一元化する。
 * 公開日、更新日などの表示に使用される。
 */
export function useDateFormat(): UseDateFormatReturn {
  return useMemo(
    () => ({
      /**
       * 日付を日本語形式でフォーマット
       *
       * @param date - フォーマットする日付（Date、文字列、null/undefined）
       * @param formatPattern - フォーマットパターン（デフォルト: 'yyyy年M月d日'）
       * @returns フォーマット済みの日付文字列、無効な場合は null
       *
       * @example
       * formatDate(new Date('2024-01-15')) // "2024年1月15日"
       * formatDate('2024-01-15', 'yyyy/MM/dd') // "2024/01/15"
       * formatDate(null) // null
       */
      formatDate: (date: DateInput, formatPattern: string = 'yyyy年M月d日'): string | null => {
        if (!date) return null;

        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;

          if (!isValid(dateObj)) return null;

          return format(dateObj, formatPattern, { locale: ja });
        } catch {
          return null;
        }
      },

      /**
       * 日付を詳細形式でフォーマット（時分も含む）
       *
       * @param date - フォーマットする日付
       * @returns フォーマット済みの日付時刻文字列、無効な場合は null
       *
       * @example
       * formatDateTime(new Date('2024-01-15T14:30:00')) // "2024年1月15日 14:30"
       */
      formatDateTime: (date: DateInput): string | null => {
        if (!date) return null;

        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;

          if (!isValid(dateObj)) return null;

          return format(dateObj, 'yyyy年M月d日 HH:mm', { locale: ja });
        } catch {
          return null;
        }
      },

      /**
       * 相対的な日付表示（例：「3日前」「1週間前」）
       *
       * @param date - 基準とする日付
       * @returns 相対的な日付文字列、無効な場合は null
       *
       * @example
       * formatRelativeDate(new Date(Date.now() - 86400000)) // "1日前"
       * formatRelativeDate(new Date(Date.now() + 86400000)) // "明日"
       */
      formatRelativeDate: (date: DateInput): string | null => {
        if (!date) return null;

        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;

          if (!isValid(dateObj)) return null;

          const now = new Date();
          const diffInMs = now.getTime() - dateObj.getTime();
          const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

          if (diffInDays === 0) return '今日';
          if (diffInDays === -1) return '明日';
          if (diffInDays === 1) return '昨日';
          if (diffInDays > 0 && diffInDays <= 7) return `${diffInDays}日前`;
          if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)}日後`;
          if (diffInDays > 7 && diffInDays <= 30) return `${Math.floor(diffInDays / 7)}週間前`;
          if (diffInDays < -7 && diffInDays >= -30)
            return `${Math.floor(Math.abs(diffInDays) / 7)}週間後`;

          // それ以外は通常の日付表示
          return format(dateObj, 'yyyy年M月d日', { locale: ja });
        } catch {
          return null;
        }
      },

      /**
       * 日付が有効かどうかをチェック
       *
       * @param date - チェックする日付
       * @returns 有効な日付の場合 true
       */
      isValidDate: (date: DateInput): boolean => {
        if (!date) return false;

        try {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          return isValid(dateObj);
        } catch {
          return false;
        }
      },

      /**
       * ISO形式の日付文字列から日本語形式に変換
       *
       * @param isoString - ISO形式の日付文字列
       * @returns 日本語形式の日付文字列、無効な場合は null
       *
       * @example
       * formatISODate('2024-01-15T00:00:00.000Z') // "2024年1月15日"
       */
      formatISODate: (isoString: string | null | undefined): string | null => {
        if (!isoString) return null;

        try {
          const date = new Date(isoString);

          if (!isValid(date)) return null;

          return format(date, 'yyyy年M月d日', { locale: ja });
        } catch {
          return null;
        }
      },
    }),
    []
  );
}
