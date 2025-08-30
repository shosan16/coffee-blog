import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import RecipeSteps from '@/client/features/recipe-detail/components/RecipeSteps';
import type { RecipeStepInfo } from '@/client/features/recipe-detail/types/recipe-detail';

describe('RecipeSteps', () => {
  beforeEach(() => {
    // 各テスト前にDOMを完全クリア
    cleanup();
    document.body.innerHTML = '';
  });
  describe('基本表示', () => {
    it('手順一覧を正しい順序で表示できること', () => {
      // Arrange - 準備：複数の手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: 'フィルターをドリッパーにセットし、コーヒー粉を投入',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 45,
          description: '92℃のお湯を少量注ぎ、30秒間蒸らす',
        },
        {
          id: '3',
          stepOrder: 3,
          timeSeconds: 120,
          description: '残りのお湯を3回に分けて注ぐ',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：手順が正しい順序で表示されることを検証
      expect(screen.getByText('抽出手順')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();

      expect(
        screen.getByText('フィルターをドリッパーにセットし、コーヒー粉を投入')
      ).toBeInTheDocument();
      expect(screen.getByText('92℃のお湯を少量注ぎ、30秒間蒸らす')).toBeInTheDocument();
      expect(screen.getByText('残りのお湯を3回に分けて注ぐ')).toBeInTheDocument();
    });

    it('時間付きの手順で時間表示が正しく表示されること', () => {
      // Arrange - 準備：時間付き手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '蒸らし手順',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 120,
          description: '抽出手順',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      const { container } = render(<RecipeSteps steps={steps} />);

      // Assert - 確認：時間表示が正しく表示されることを検証
      expect(container).toHaveTextContent('30秒');
      expect(container).toHaveTextContent('2分');
    });

    it('時間がない手順では時間表示をしないこと', () => {
      // Arrange - 準備：時間なし手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          description: 'コーヒー豆の香りを確認',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 60,
          description: '抽出開始',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      const { container } = render(<RecipeSteps steps={steps} />);

      // Assert - 確認：時間なし手順で時間表示がないことを検証
      expect(container).toHaveTextContent('コーヒー豆の香りを確認');
      expect(container).toHaveTextContent('1分');

      // Step表示の確認
      const stepElements = container.querySelectorAll('[class*="rounded-full"]');
      expect(stepElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('空の状態', () => {
    it('手順が空の場合、適切なメッセージを表示すること', () => {
      // Arrange - 準備：空の手順配列を設定
      const steps: RecipeStepInfo[] = [];

      // Act - 実行：空の手順でレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：空状態のメッセージが表示されることを検証
      expect(screen.getByText('抽出手順')).toBeInTheDocument();
      expect(screen.getByText('手順が登録されていません')).toBeInTheDocument();
    });
  });

  describe('時間表示フォーマット', () => {
    it('秒数を適切にフォーマットできること', () => {
      // Arrange - 準備：様々な時間の手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 15,
          description: '15秒手順',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 60,
          description: '1分手順',
        },
        {
          id: '3',
          stepOrder: 3,
          timeSeconds: 90,
          description: '1分30秒手順',
        },
        {
          id: '4',
          stepOrder: 4,
          timeSeconds: 180,
          description: '3分手順',
        },
        {
          id: '5',
          stepOrder: 5,
          timeSeconds: 195,
          description: '3分15秒手順',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      const { container } = render(<RecipeSteps steps={steps} />);

      // Assert - 確認：時間フォーマットが正しく表示されることを検証
      expect(container).toHaveTextContent('15秒');
      expect(container).toHaveTextContent('1分');
      expect(container).toHaveTextContent('1分30秒');
      expect(container).toHaveTextContent('3分');
      expect(container).toHaveTextContent('3分15秒');
    });

    it('0秒の場合、時間表示をしないこと', () => {
      // Arrange - 準備：0秒の手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 0,
          description: '0秒手順',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：0秒の場合は時間表示がないことを検証
      expect(screen.getByText('0秒手順')).toBeInTheDocument();
      expect(screen.queryByText('0秒')).not.toBeInTheDocument();
    });
  });

  describe('タイムライン表示', () => {
    it('複数手順でタイムライン構造が正しく表示されること', () => {
      // Arrange - 準備：タイムライン確認用手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '第1ステップ',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 60,
          description: '第2ステップ',
        },
        {
          id: '3',
          stepOrder: 3,
          timeSeconds: 90,
          description: '第3ステップ',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：各ステップが表示されることを検証
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
      expect(screen.getByText('第1ステップ')).toBeInTheDocument();
      expect(screen.getByText('第2ステップ')).toBeInTheDocument();
      expect(screen.getByText('第3ステップ')).toBeInTheDocument();
    });
  });

  describe('長い説明文', () => {
    it('長い説明文を正しく表示できること', () => {
      // Arrange - 準備：長い説明文の手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 120,
          description:
            'この手順は非常に詳細で、コーヒーの抽出において最も重要なポイントの一つです。水温、注ぎ方、タイミングすべてが完璧なコーヒーを作るための鍵となります。ゆっくりと丁寧に作業を進めてください。',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：長い説明文が正しく表示されることを検証
      expect(screen.getByText(/この手順は非常に詳細で/)).toBeInTheDocument();
      expect(screen.getByText(/ゆっくりと丁寧に作業を進めてください/)).toBeInTheDocument();
    });
  });

  describe('特殊文字・エッジケース', () => {
    it('特殊文字を含む説明文を正しく表示できること', () => {
      // Arrange - 準備：特殊文字含み手順データを設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 45,
          description: '92℃のお湯を500ml注ぐ（±2℃の範囲で調整）',
        },
        {
          id: '2',
          stepOrder: 2,
          description: 'コーヒー豆15g〜20gを使用（お好みで調整）',
        },
      ];

      // Act - 実行：レシピ手順をレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：特殊文字が正しく表示されることを検証
      expect(screen.getByText('92℃のお湯を500ml注ぐ（±2℃の範囲で調整）')).toBeInTheDocument();
      expect(screen.getByText('コーヒー豆15g〜20gを使用（お好みで調整）')).toBeInTheDocument();
    });
  });

  describe('総抽出時間表示', () => {
    it('brewingTimeが提供された場合、総抽出時間を正しく表示すること', () => {
      // Arrange - 準備：手順データと総抽出時間を設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '蒸らし',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 120,
          description: '抽出',
        },
      ];
      const brewingTime = 180; // 3分

      // Act - 実行：総抽出時間付きでレンダリング
      render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：総抽出時間が正しく表示されることを検証
      expect(screen.getByText('総抽出時間: 3分0秒')).toBeInTheDocument();
      expect(screen.getByText('抽出手順')).toBeInTheDocument();
    });

    it('brewingTimeが未定義の場合、総抽出時間を表示しないこと', () => {
      // Arrange - 準備：手順データのみ設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '蒸らし',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 120,
          description: '抽出',
        },
      ];

      // Act - 実行：総抽出時間なしでレンダリング
      render(<RecipeSteps steps={steps} />);

      // Assert - 確認：総抽出時間が表示されないことを検証
      expect(screen.queryByText(/総抽出時間/)).not.toBeInTheDocument();
      expect(screen.getByText('抽出手順')).toBeInTheDocument();
    });

    it('brewingTimeが0の場合、総抽出時間を表示しないこと', () => {
      // Arrange - 準備：手順データと0秒の総抽出時間を設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '準備',
        },
      ];
      const brewingTime = 0;

      // Act - 実行：0秒の総抽出時間でレンダリング
      render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：総抽出時間が表示されないことを検証
      expect(screen.queryByText(/総抽出時間/)).not.toBeInTheDocument();
    });

    it('brewingTimeが複雑な時間の場合、正しくフォーマットされること', () => {
      // Arrange - 準備：手順データと複雑な総抽出時間を設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 45,
          description: '前処理',
        },
      ];
      const brewingTime = 255; // 4分15秒

      // Act - 実行：複雑な総抽出時間でレンダリング
      render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：複雑な時間が正しくフォーマットされることを検証
      expect(screen.getByText('総抽出時間: 4分15秒')).toBeInTheDocument();
    });

    it('brewingTimeが1分未満の場合、正しくフォーマットされること', () => {
      // Arrange - 準備：手順データと1分未満の総抽出時間を設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '短時間手順',
        },
      ];
      const brewingTime = 45; // 45秒

      // Act - 実行：1分未満の総抽出時間でレンダリング
      render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：1分未満の時間が正しくフォーマットされることを検証
      expect(screen.getByText('総抽出時間: 0分45秒')).toBeInTheDocument();
    });

    it('brewingTimeとstepsの時間表示が両方表示されること', () => {
      // Arrange - 準備：時間付き手順データと総抽出時間を設定
      const steps: RecipeStepInfo[] = [
        {
          id: '1',
          stepOrder: 1,
          timeSeconds: 30,
          description: '蒸らし手順',
        },
        {
          id: '2',
          stepOrder: 2,
          timeSeconds: 90,
          description: '抽出手順',
        },
      ];
      const brewingTime = 150; // 2分30秒

      // Act - 実行：両方の時間表示でレンダリング
      const { container } = render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：総抽出時間とステップ時間の両方が表示されることを検証
      expect(screen.getByText('総抽出時間: 2分30秒')).toBeInTheDocument();
      expect(container).toHaveTextContent('30秒');
      expect(container).toHaveTextContent('1分30秒');
    });

    it('空の手順でbrewingTimeが提供された場合でも総抽出時間を表示しないこと', () => {
      // Arrange - 準備：空の手順データと総抽出時間を設定
      const steps: RecipeStepInfo[] = [];
      const brewingTime = 120;

      // Act - 実行：空手順で総抽出時間付きレンダリング
      render(<RecipeSteps steps={steps} brewingTime={brewingTime} />);

      // Assert - 確認：空状態では総抽出時間を表示しないことを検証
      expect(screen.queryByText(/総抽出時間/)).not.toBeInTheDocument();
      expect(screen.getByText('手順が登録されていません')).toBeInTheDocument();
    });
  });
});
