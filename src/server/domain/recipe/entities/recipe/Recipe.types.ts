/**
 * レシピステップ
 */
export type RecipeStep = {
  readonly stepOrder: number;
  readonly timeSeconds?: number;
  readonly description: string;
};
