/**
 * 共通スケルトンコンポーネント
 *
 * 既存の重複するスケルトンコンポーネントを統一し、
 * パフォーマンスを改善するために作成された共通コンポーネント群。
 *
 * crypto.randomUUID()の代わりにインデックスベースのキー生成を使用し、
 * 効率的なスケルトンレンダリングを実現。
 */

export {
  SkeletonText,
  SkeletonButton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonForm,
  SkeletonList,
  RecipeFilterSkeleton,
  RecipeDetailSkeleton,
  RecipeListSkeleton,
  type SkeletonBaseProps,
  type SkeletonTextProps,
  type SkeletonButtonProps,
  type SkeletonAvatarProps,
  type SkeletonFormProps,
  type SkeletonListProps,
  type RecipeListSkeletonProps,
} from './SkeletonComponents';
