/**
 * レシピタグ要約型
 *
 * レシピ一覧表示に必要な最小限のタグ情報
 */
export type RecipeTagSummary = {
  id: string;
  name: string;
  slug: string;
};

/**
 * レシピ一覧表示用の型定義
 * Prisma enumへの依存を排除し、API境界の型として柔軟性を確保
 */
export type Recipe = {
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  /** 焙煎レベル（文字列表現） */
  roastLevel: string;
  tags: RecipeTagSummary[];
  baristaName: string | null;
};
