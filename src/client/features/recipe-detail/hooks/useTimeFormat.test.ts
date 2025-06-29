import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useTimeFormat } from './useTimeFormat';

describe('useTimeFormat', () => {
  describe('formatSeconds', () => {
    it('秒のみの場合は秒表示', () => {
      // Arrange - 準備：30秒のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：30秒をフォーマット
      const formatted = result.current.formatSeconds(30);

      // Assert - 確認：30秒と表示されること
      expect(formatted).toBe('30秒');
    });

    it('ちょうど1分の場合は分のみ表示', () => {
      // Arrange - 準備：60秒（1分）のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：60秒をフォーマット
      const formatted = result.current.formatSeconds(60);

      // Assert - 確認：1分と表示されること
      expect(formatted).toBe('1分');
    });

    it('分と秒の組み合わせの場合は両方表示', () => {
      // Arrange - 準備：90秒（1分30秒）のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：90秒をフォーマット
      const formatted = result.current.formatSeconds(90);

      // Assert - 確認：1分30秒と表示されること
      expect(formatted).toBe('1分30秒');
    });

    it('複数分の場合も正しく表示', () => {
      // Arrange - 準備：3分45秒（225秒）のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：225秒をフォーマット
      const formatted = result.current.formatSeconds(225);

      // Assert - 確認：3分45秒と表示されること
      expect(formatted).toBe('3分45秒');
    });

    it('0秒の場合は0秒と表示', () => {
      // Arrange - 準備：0秒のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：0秒をフォーマット
      const formatted = result.current.formatSeconds(0);

      // Assert - 確認：0秒と表示されること
      expect(formatted).toBe('0秒');
    });
  });

  describe('splitMinutesAndSeconds', () => {
    it('秒のみの場合は正しく分解', () => {
      // Arrange - 準備：30秒のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：30秒を分と秒に分解
      const split = result.current.splitMinutesAndSeconds(30);

      // Assert - 確認：0分30秒に分解されること
      expect(split).toEqual({ minutes: 0, seconds: 30 });
    });

    it('分と秒の組み合わせの場合は正しく分解', () => {
      // Arrange - 準備：90秒（1分30秒）のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：90秒を分と秒に分解
      const split = result.current.splitMinutesAndSeconds(90);

      // Assert - 確認：1分30秒に分解されること
      expect(split).toEqual({ minutes: 1, seconds: 30 });
    });

    it('ちょうど分の場合は秒が0', () => {
      // Arrange - 準備：120秒（2分）のデータを用意
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：120秒を分と秒に分解
      const split = result.current.splitMinutesAndSeconds(120);

      // Assert - 確認：2分0秒に分解されること
      expect(split).toEqual({ minutes: 2, seconds: 0 });
    });
  });

  describe('formatTimeRange', () => {
    it('秒のみの範囲を正しくフォーマット', () => {
      // Arrange - 準備：10秒から30秒の範囲
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：時間範囲をフォーマット
      const formatted = result.current.formatTimeRange(10, 30);

      // Assert - 確認：正しい範囲表示
      expect(formatted).toBe('10秒 - 30秒');
    });

    it('分を含む範囲を正しくフォーマット', () => {
      // Arrange - 準備：30秒から1分30秒の範囲
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：時間範囲をフォーマット
      const formatted = result.current.formatTimeRange(30, 90);

      // Assert - 確認：正しい範囲表示
      expect(formatted).toBe('30秒 - 1分30秒');
    });

    it('複雑な分秒の組み合わせ範囲を正しくフォーマット', () => {
      // Arrange - 準備：1分15秒から3分45秒の範囲
      const { result } = renderHook(() => useTimeFormat());

      // Act - 実行：時間範囲をフォーマット
      const formatted = result.current.formatTimeRange(75, 225);

      // Assert - 確認：正しい範囲表示
      expect(formatted).toBe('1分15秒 - 3分45秒');
    });
  });

  describe('メモ化動作', () => {
    it('再レンダリング時に同じ関数インスタンスを返す', () => {
      // Arrange - 準備：初回レンダリング
      const { result, rerender } = renderHook(() => useTimeFormat());
      const firstRender = result.current;

      // Act - 実行：再レンダリング
      rerender();
      const secondRender = result.current;

      // Assert - 確認：同じインスタンスが返されること（メモ化されていること）
      expect(firstRender).toBe(secondRender);
      expect(firstRender.formatSeconds).toBe(secondRender.formatSeconds);
      expect(firstRender.splitMinutesAndSeconds).toBe(secondRender.splitMinutesAndSeconds);
      expect(firstRender.formatTimeRange).toBe(secondRender.formatTimeRange);
    });
  });
});
