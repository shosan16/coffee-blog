import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useNumberFormat } from '@/client/features/recipe-detail/hooks/useNumberFormat';

describe('useNumberFormat', () => {
  describe('formatWithCommas', () => {
    it('4桁の数値をカンマ区切りでフォーマット', () => {
      // Arrange - 準備：4桁の数値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：カンマ区切りフォーマット
      const formatted = result.current.formatWithCommas(1234);

      // Assert - 確認：カンマが挿入されること
      expect(formatted).toBe('1,234');
    });

    it('7桁の数値をカンマ区切りでフォーマット', () => {
      // Arrange - 準備：7桁の数値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：カンマ区切りフォーマット
      const formatted = result.current.formatWithCommas(1234567);

      // Assert - 確認：適切にカンマが挿入されること
      expect(formatted).toBe('1,234,567');
    });

    it('3桁未満の数値はそのまま表示', () => {
      // Arrange - 準備：3桁未満の数値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：カンマ区切りフォーマット
      const formatted = result.current.formatWithCommas(123);

      // Assert - 確認：カンマが挿入されないこと
      expect(formatted).toBe('123');
    });
  });

  describe('formatWeight', () => {
    it('デフォルトで単位付きで重量をフォーマット', () => {
      // Arrange - 準備：重量とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：重量フォーマット
      const formatted = result.current.formatWeight(15);

      // Assert - 確認：単位付きで表示されること
      expect(formatted).toBe('15g');
    });

    it('単位なしで重量をフォーマット', () => {
      // Arrange - 準備：重量とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：単位なし重量フォーマット
      const formatted = result.current.formatWeight(15, false);

      // Assert - 確認：単位なしで表示されること
      expect(formatted).toBe('15');
    });

    it('大きな重量値をカンマ区切りでフォーマット', () => {
      // Arrange - 準備：大きな重量値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：大きな重量フォーマット
      const formatted = result.current.formatWeight(1000);

      // Assert - 確認：カンマ区切りで表示されること
      expect(formatted).toBe('1,000g');
    });
  });

  describe('formatTemperature', () => {
    it('デフォルトで単位付きで温度をフォーマット', () => {
      // Arrange - 準備：温度とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：温度フォーマット
      const formatted = result.current.formatTemperature(93);

      // Assert - 確認：摂氏単位付きで表示されること
      expect(formatted).toBe('93°C');
    });

    it('単位なしで温度をフォーマット', () => {
      // Arrange - 準備：温度とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：単位なし温度フォーマット
      const formatted = result.current.formatTemperature(93, false);

      // Assert - 確認：単位なしで表示されること
      expect(formatted).toBe('93');
    });
  });

  describe('formatViewCount', () => {
    it('デフォルトで単位付きでビュー数をフォーマット', () => {
      // Arrange - 準備：ビュー数とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：ビュー数フォーマット
      const formatted = result.current.formatViewCount(1234);

      // Assert - 確認：回数単位付きで表示されること
      expect(formatted).toBe('1,234回');
    });

    it('単位なしでビュー数をフォーマット', () => {
      // Arrange - 準備：ビュー数とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：単位なしビュー数フォーマット
      const formatted = result.current.formatViewCount(1234, false);

      // Assert - 確認：単位なしで表示されること
      expect(formatted).toBe('1,234');
    });

    it('0のビュー数も正しくフォーマット', () => {
      // Arrange - 準備：0のビュー数とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：0ビュー数フォーマット
      const formatted = result.current.formatViewCount(0);

      // Assert - 確認：0回と表示されること
      expect(formatted).toBe('0回');
    });
  });

  describe('formatPercentage', () => {
    it('0-1の範囲の値をパーセンテージに変換', () => {
      // Arrange - 準備：小数値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：小数値をパーセンテージフォーマット
      const formatted = result.current.formatPercentage(0.85, true);

      // Assert - 確認：パーセンテージ表示されること
      expect(formatted).toBe('85.0%');
    });

    it('0-100の範囲の値をそのままパーセンテージ表示', () => {
      // Arrange - 準備：パーセント値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：パーセント値フォーマット
      const formatted = result.current.formatPercentage(85);

      // Assert - 確認：パーセンテージ表示されること
      expect(formatted).toBe('85.0%');
    });

    it('小数点以下の桁数を指定してフォーマット', () => {
      // Arrange - 準備：小数点ありの値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：小数点2桁でフォーマット
      const formatted = result.current.formatPercentage(85.555, false, 2);

      // Assert - 確認：指定桁数で表示されること
      expect(formatted).toBe('85.56%');
    });
  });

  describe('formatDecimal', () => {
    it('デフォルトで小数点1桁でフォーマット', () => {
      // Arrange - 準備：π値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：小数点フォーマット
      const formatted = result.current.formatDecimal(3.14159);

      // Assert - 確認：小数点1桁で表示されること
      expect(formatted).toBe('3.1');
    });

    it('指定桁数でフォーマット', () => {
      // Arrange - 準備：π値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：小数点2桁でフォーマット
      const formatted = result.current.formatDecimal(3.14159, 2);

      // Assert - 確認：小数点2桁で表示されること
      expect(formatted).toBe('3.14');
    });

    it('整数も指定桁数の小数点で表示', () => {
      // Arrange - 準備：整数値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：整数の小数点フォーマット
      const formatted = result.current.formatDecimal(3);

      // Assert - 確認：.0付きで表示されること
      expect(formatted).toBe('3.0');
    });
  });

  describe('formatRange', () => {
    it('単位付きで範囲をフォーマット', () => {
      // Arrange - 準備：範囲値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：単位付き範囲フォーマット
      const formatted = result.current.formatRange(15, 20, 'g');

      // Assert - 確認：単位付き範囲で表示されること
      expect(formatted).toBe('15g - 20g');
    });

    it('単位なしで範囲をフォーマット', () => {
      // Arrange - 準備：範囲値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：単位なし範囲フォーマット
      const formatted = result.current.formatRange(15, 20);

      // Assert - 確認：単位なし範囲で表示されること
      expect(formatted).toBe('15 - 20');
    });

    it('大きな値の範囲をカンマ区切りでフォーマット', () => {
      // Arrange - 準備：大きな範囲値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：大きな値範囲フォーマット
      const formatted = result.current.formatRange(1500, 2000, 'ml');

      // Assert - 確認：カンマ区切り範囲で表示されること
      expect(formatted).toBe('1,500ml - 2,000ml');
    });
  });

  describe('formatRatio', () => {
    it('デフォルトで比率を簡約してフォーマット', () => {
      // Arrange - 準備：比率値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：比率フォーマット
      const formatted = result.current.formatRatio(15, 250);

      // Assert - 確認：簡約された比率で表示されること
      expect(formatted).toBe('3:50');
    });

    it('簡約せずに比率をフォーマット', () => {
      // Arrange - 準備：比率値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：簡約なし比率フォーマット
      const formatted = result.current.formatRatio(15, 250, false);

      // Assert - 確認：元の値で表示されること
      expect(formatted).toBe('15:250');
    });

    it('既に簡約済みの比率はそのまま表示', () => {
      // Arrange - 準備：簡約済み比率値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：簡約済み比率フォーマット
      const formatted = result.current.formatRatio(1, 16);

      // Assert - 確認：そのまま表示されること
      expect(formatted).toBe('1:16');
    });

    it('大きな値の比率をカンマ区切りでフォーマット', () => {
      // Arrange - 準備：大きな比率値とフック
      const { result } = renderHook(() => useNumberFormat());

      // Act - 実行：大きな値比率フォーマット（簡約なし）
      const formatted = result.current.formatRatio(1000, 16000, false);

      // Assert - 確認：カンマ区切りで表示されること
      expect(formatted).toBe('1,000:16,000');
    });
  });

  describe('メモ化動作', () => {
    it('再レンダリング時に同じ関数インスタンスを返す', () => {
      // Arrange - 準備：初回レンダリング
      const { result, rerender } = renderHook(() => useNumberFormat());
      const firstRender = result.current;

      // Act - 実行：再レンダリング
      rerender();
      const secondRender = result.current;

      // Assert - 確認：同じインスタンスが返されること（メモ化されていること）
      expect(firstRender).toBe(secondRender);
      expect(firstRender.formatWithCommas).toBe(secondRender.formatWithCommas);
      expect(firstRender.formatWeight).toBe(secondRender.formatWeight);
      expect(firstRender.formatTemperature).toBe(secondRender.formatTemperature);
      expect(firstRender.formatViewCount).toBe(secondRender.formatViewCount);
      expect(firstRender.formatPercentage).toBe(secondRender.formatPercentage);
      expect(firstRender.formatDecimal).toBe(secondRender.formatDecimal);
      expect(firstRender.formatRange).toBe(secondRender.formatRange);
      expect(firstRender.formatRatio).toBe(secondRender.formatRatio);
    });
  });
});
