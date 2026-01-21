import type { Recipe } from './recipe';

/**
 * レシピカード表示用の拡張型
 * Phase 1 では tags と authorName はダミーデータから生成
 */
export type RecipeCardDisplay = Recipe & {
  /** レシピに関連するタグ（味わい、特徴など） */
  tags: string[];
  /** 投稿者名 */
  authorName: string;
};
