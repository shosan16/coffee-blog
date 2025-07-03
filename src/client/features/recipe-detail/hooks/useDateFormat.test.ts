import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useDateFormat } from './useDateFormat';

describe('useDateFormat', () => {
  // 固定の日付を設定してテストの一貫性を保つ
  const fixedDate = new Date('2024-01-15T14:30:00Z');
  // テスト用の日付文字列定数
  const TEST_DATE_STRING = '2024-01-15';

  beforeEach(() => {
    // Date.now()をモック化
    vi.setSystemTime(fixedDate);
  });

  describe('formatDate', () => {
    it('Dateオブジェクトを日本語形式でフォーマット', () => {
      // Arrange - 準備：日付とフック
      const date = new Date(TEST_DATE_STRING);
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：日付をフォーマット
      const formatted = result.current.formatDate(date);

      // Assert - 確認：日本語形式で表示されること
      expect(formatted).toBe('2024年1月15日');
    });

    it('文字列の日付を日本語形式でフォーマット', () => {
      // Arrange - 準備：文字列日付とフック
      const dateString = TEST_DATE_STRING;
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：文字列日付をフォーマット
      const formatted = result.current.formatDate(dateString);

      // Assert - 確認：日本語形式で表示されること
      expect(formatted).toBe('2024年1月15日');
    });

    it('カスタムフォーマットパターンでフォーマット', () => {
      // Arrange - 準備：日付とカスタムパターン
      const date = new Date(TEST_DATE_STRING);
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：カスタムパターンでフォーマット
      const formatted = result.current.formatDate(date, 'yyyy/MM/dd');

      // Assert - 確認：指定したパターンで表示されること
      expect(formatted).toBe('2024/01/15');
    });

    it('nullの場合はnullを返す', () => {
      // Arrange - 準備：null値とフック
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：null値をフォーマット
      const formatted = result.current.formatDate(null);

      // Assert - 確認：nullが返されること
      expect(formatted).toBeNull();
    });

    it('undefinedの場合はnullを返す', () => {
      // Arrange - 準備：undefined値とフック
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：undefined値をフォーマット
      const formatted = result.current.formatDate(undefined);

      // Assert - 確認：nullが返されること
      expect(formatted).toBeNull();
    });

    it('無効な日付文字列の場合はnullを返す', () => {
      // Arrange - 準備：無効な日付文字列とフック
      const invalidDate = 'invalid-date';
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：無効な日付をフォーマット
      const formatted = result.current.formatDate(invalidDate);

      // Assert - 確認：nullが返されること
      expect(formatted).toBeNull();
    });
  });

  describe('formatDateTime', () => {
    it('日付時刻を詳細形式でフォーマット', () => {
      // Arrange - 準備：日付時刻とフック
      const dateTime = new Date('2024-01-15T14:30:00');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：日付時刻をフォーマット
      const formatted = result.current.formatDateTime(dateTime);

      // Assert - 確認：時分も含む形式で表示されること
      expect(formatted).toBe('2024年1月15日 14:30');
    });

    it('文字列の日付時刻を詳細形式でフォーマット', () => {
      // Arrange - 準備：文字列日付時刻とフック（ローカルタイムゾーンを考慮）
      const dateTimeString = '2024-01-15T14:30:00';
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：文字列日付時刻をフォーマット
      const formatted = result.current.formatDateTime(dateTimeString);

      // Assert - 確認：時分も含む形式で表示されること
      expect(formatted).toBe('2024年1月15日 14:30');
    });
  });

  describe('formatRelativeDate', () => {
    it('今日の日付は"今日"と表示', () => {
      // Arrange - 準備：今日の日付とフック
      const today = new Date('2024-01-15T10:00:00Z');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：今日の日付をフォーマット
      const formatted = result.current.formatRelativeDate(today);

      // Assert - 確認："今日"と表示されること
      expect(formatted).toBe('今日');
    });

    it('昨日の日付は"昨日"と表示', () => {
      // Arrange - 準備：昨日の日付とフック
      const yesterday = new Date('2024-01-14T10:00:00Z');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：昨日の日付をフォーマット
      const formatted = result.current.formatRelativeDate(yesterday);

      // Assert - 確認："昨日"と表示されること
      expect(formatted).toBe('昨日');
    });

    it('明日の日付は"明日"と表示', () => {
      // Arrange - 準備：明日の日付とフック
      const tomorrow = new Date('2024-01-16T10:00:00Z');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：明日の日付をフォーマット
      const formatted = result.current.formatRelativeDate(tomorrow);

      // Assert - 確認："明日"と表示されること
      expect(formatted).toBe('明日');
    });

    it('3日前の日付は"3日前"と表示', () => {
      // Arrange - 準備：3日前の日付とフック
      const threeDaysAgo = new Date('2024-01-12T10:00:00Z');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：3日前の日付をフォーマット
      const formatted = result.current.formatRelativeDate(threeDaysAgo);

      // Assert - 確認："3日前"と表示されること
      expect(formatted).toBe('3日前');
    });

    it('30日以上前の日付は通常の日付形式で表示', () => {
      // Arrange - 準備：2ヶ月前の日付とフック
      const twoMonthsAgo = new Date('2023-11-15T10:00:00Z');
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：2ヶ月前の日付をフォーマット
      const formatted = result.current.formatRelativeDate(twoMonthsAgo);

      // Assert - 確認：通常の日付形式で表示されること
      expect(formatted).toBe('2023年11月15日');
    });
  });

  describe('isValidDate', () => {
    it('有効なDateオブジェクトの場合はtrue', () => {
      // Arrange - 準備：有効な日付とフック
      const validDate = new Date(TEST_DATE_STRING);
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：日付の有効性をチェック
      const isValid = result.current.isValidDate(validDate);

      // Assert - 確認：trueが返されること
      expect(isValid).toBe(true);
    });

    it('有効な日付文字列の場合はtrue', () => {
      // Arrange - 準備：有効な日付文字列とフック
      const validDateString = TEST_DATE_STRING;
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：日付文字列の有効性をチェック
      const isValid = result.current.isValidDate(validDateString);

      // Assert - 確認：trueが返されること
      expect(isValid).toBe(true);
    });

    it('無効な日付文字列の場合はfalse', () => {
      // Arrange - 準備：無効な日付文字列とフック
      const invalidDate = 'invalid-date';
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：無効な日付の有効性をチェック
      const isValid = result.current.isValidDate(invalidDate);

      // Assert - 確認：falseが返されること
      expect(isValid).toBe(false);
    });

    it('nullの場合はfalse', () => {
      // Arrange - 準備：null値とフック
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：null値の有効性をチェック
      const isValid = result.current.isValidDate(null);

      // Assert - 確認：falseが返されること
      expect(isValid).toBe(false);
    });
  });

  describe('formatISODate', () => {
    it('ISO形式の日付文字列を日本語形式でフォーマット', () => {
      // Arrange - 準備：ISO形式の日付文字列とフック
      const isoString = '2024-01-15T00:00:00.000Z';
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：ISO形式をフォーマット
      const formatted = result.current.formatISODate(isoString);

      // Assert - 確認：日本語形式で表示されること
      expect(formatted).toBe('2024年1月15日');
    });

    it('nullの場合はnullを返す', () => {
      // Arrange - 準備：null値とフック
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：null値をフォーマット
      const formatted = result.current.formatISODate(null);

      // Assert - 確認：nullが返されること
      expect(formatted).toBeNull();
    });

    it('無効なISO文字列の場合はnullを返す', () => {
      // Arrange - 準備：無効なISO文字列とフック
      const invalidISO = 'invalid-iso-string';
      const { result } = renderHook(() => useDateFormat());

      // Act - 実行：無効なISO文字列をフォーマット
      const formatted = result.current.formatISODate(invalidISO);

      // Assert - 確認：nullが返されること
      expect(formatted).toBeNull();
    });
  });

  describe('メモ化動作', () => {
    it('再レンダリング時に同じ関数インスタンスを返す', () => {
      // Arrange - 準備：初回レンダリング
      const { result, rerender } = renderHook(() => useDateFormat());
      const firstRender = result.current;

      // Act - 実行：再レンダリング
      rerender();
      const secondRender = result.current;

      // Assert - 確認：同じインスタンスが返されること（メモ化されていること）
      expect(firstRender).toBe(secondRender);
      expect(firstRender.formatDate).toBe(secondRender.formatDate);
      expect(firstRender.formatDateTime).toBe(secondRender.formatDateTime);
      expect(firstRender.formatRelativeDate).toBe(secondRender.formatRelativeDate);
      expect(firstRender.isValidDate).toBe(secondRender.isValidDate);
      expect(firstRender.formatISODate).toBe(secondRender.formatISODate);
    });
  });
});
