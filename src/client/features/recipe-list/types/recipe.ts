import type { RoastLevel, GrindSize } from '@prisma/client';

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
 * レシピ要約型（一覧表示用）
 *
 * レシピ一覧ページで表示する要約情報
 * 詳細ページで必要な情報（手順、バリスタ情報等）は含まない
 */
export type Recipe = {
  id: string;
  title: string;
  summary: string;
  equipment: string[];
  roastLevel: RoastLevel;
  grindSize: GrindSize | null;
  beanWeight: number;
  waterTemp: number;
  waterAmount: number;
  tags: RecipeTagSummary[];
  baristaName: string | null;
};
