import Link from 'next/link';

import type { Recipe } from '@/client/features/recipe-list/types/recipe';
import { getRoastLevelColor, getRoastLevelLabel } from '@/client/shared/constants/coffee-beans';

import RecipeTagList from './components/RecipeTagList';

type RecipeCardProps = {
  recipe: Recipe;
};

/**
 * レシピカードコンポーネント
 *
 * mock/recipe-card.html のデザインを参考にした新しいレイアウト。
 * - 左サイドラインで焙煎度を表現
 * - タイトル（2行固定）と焙煎度バッジ
 * - タグリスト（2行＋オーバーフロー）
 * - 投稿者名
 */
export default function RecipeCard({ recipe }: RecipeCardProps) {
  const sideLineColor = getRoastLevelColor(recipe.roastLevel);
  const roastLabel = getRoastLevelLabel(recipe.roastLevel);
  // RecipeTagSummary[] から表示用の string[] に変換
  const tagNames = recipe.tags.map((tag) => tag.name);

  return (
    <Link href={`/recipes/${recipe.id}`} className="block h-full">
      <article
        className="relative flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 pl-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        data-testid="recipe-card"
      >
        {/* 左サイドライン */}
        <div
          className="absolute top-0 left-0 h-full w-1.5 rounded-l-xl"
          style={{ backgroundColor: sideLineColor }}
          data-testid="roast-sideline"
          data-roast-color={sideLineColor}
        />

        {/* ヘッダー: タイトル + 焙煎度バッジ */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[2.8em] flex-1 text-[15px] leading-snug font-medium text-gray-800">
            {recipe.title}
          </h3>
          {/* 焙煎度バッジ */}
          {roastLabel && (
            <span
              className="shrink-0 rounded px-2.5 py-1 text-[10px] font-medium whitespace-nowrap text-white"
              style={{ backgroundColor: sideLineColor }}
              data-roast-color={sideLineColor}
            >
              {roastLabel}
            </span>
          )}
        </div>

        {/* タグリスト */}
        <RecipeTagList tags={tagNames} />

        {/* 投稿者情報 */}
        {recipe.baristaName && (
          <div className="mt-3 border-t border-gray-200 pt-2.5" data-testid="author-info">
            <p className="text-xs text-gray-400">{recipe.baristaName}</p>
          </div>
        )}
      </article>
    </Link>
  );
}
