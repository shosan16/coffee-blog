import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

/**
 * 基本的なスケルトンコンポーネントのプロパティ
 */
export type SkeletonBaseProps = {
  className?: string;
};

/**
 * 基本スケルトンテキスト
 */
export type SkeletonTextProps = SkeletonBaseProps & {
  width?: string;
  height?: string;
};

export function SkeletonText({
  className = '',
  width = 'w-full',
  height = 'h-4',
}: SkeletonTextProps) {
  return <div className={`${height} ${width} bg-muted animate-pulse rounded ${className}`} />;
}

/**
 * ボタンスケルトン
 */
export type SkeletonButtonProps = SkeletonBaseProps & {
  width?: string;
  height?: string;
};

export function SkeletonButton({
  className = '',
  width = 'w-20',
  height = 'h-10',
}: SkeletonButtonProps) {
  return <div className={`${height} ${width} bg-muted animate-pulse rounded ${className}`} />;
}

/**
 * アバタースケルトン
 */
export type SkeletonAvatarProps = SkeletonBaseProps & {
  size?: string;
};

export function SkeletonAvatar({ className = '', size = 'h-10 w-10' }: SkeletonAvatarProps) {
  return <div className={`${size} bg-muted animate-pulse rounded-full ${className}`} />;
}

/**
 * カードスケルトン
 */
export function SkeletonCard({ className = '' }: SkeletonBaseProps) {
  return (
    <Card className={`border-border bg-card shadow-sm ${className}`}>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <SkeletonText width="w-3/4" height="h-6" />
          <SkeletonText width="w-full" height="h-4" />
          <SkeletonText width="w-2/3" height="h-4" />
        </div>
        <div className="space-y-2">
          <SkeletonText width="w-1/2" height="h-4" />
          <SkeletonText width="w-3/4" height="h-4" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * フォームスケルトン
 */
export type SkeletonFormProps = SkeletonBaseProps & {
  fields?: number;
};

export function SkeletonForm({ className = '', fields = 5 }: SkeletonFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={`skeleton-field-${index}`} className="space-y-2" data-testid="skeleton-field">
          <SkeletonText width="w-20" height="h-4" />
          <SkeletonText width="w-full" height="h-10" />
        </div>
      ))}
    </div>
  );
}

/**
 * リストスケルトン
 */
export type SkeletonListProps = SkeletonBaseProps & {
  items?: number;
};

export function SkeletonList({ className = '', items = 3 }: SkeletonListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }, (_, index) => (
        <div key={`skeleton-item-${index}`} className="flex gap-4" data-testid="skeleton-item">
          <SkeletonAvatar />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-32" height="h-5" />
            <SkeletonText width="w-full" height="h-4" />
            <SkeletonText width="w-2/3" height="h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * レシピフィルタースケルトン
 */
export function RecipeFilterSkeleton({ className = '' }: SkeletonBaseProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">フィルター条件</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 器具フィルタースケルトン */}
        <div className="space-y-4">
          <SkeletonText width="w-16" height="h-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={`equipment-${index}`} className="flex items-center space-x-2">
                <SkeletonText width="w-4" height="h-4" />
                <SkeletonText width="w-24" height="h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* 抽出条件フィルタースケルトン */}
        <div className="space-y-6">
          <SkeletonText width="w-20" height="h-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={`condition-${index}`} className="space-y-3">
                <SkeletonText width="w-12" height="h-3" />
                <SkeletonText width="w-full" height="h-10" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * レシピ詳細スケルトン
 */
export function RecipeDetailSkeleton({ className = '' }: SkeletonBaseProps) {
  return (
    <div className={`bg-background min-h-screen ${className}`}>
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ヘッダー部分のスケルトン */}
          <Card className="border-border bg-card shadow-sm" data-testid="recipe-header-skeleton">
            <CardContent className="space-y-4 p-8">
              <SkeletonText width="w-3/4" height="h-8" />
              <SkeletonText width="w-full" height="h-4" />
              <SkeletonText width="w-2/3" height="h-4" />
            </CardContent>
          </Card>

          {/* レイアウト: デスクトップ2カラム、モバイル1カラム */}
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* メインコンテンツのスケルトン */}
            <div className="min-w-0 flex-1 space-y-8" data-testid="recipe-main-skeleton">
              {/* 基本情報カードのスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div key={`info-${index}`} className="space-y-2">
                        <SkeletonText width="w-20" height="h-4" />
                        <SkeletonText width="w-16" height="h-6" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 手順のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-6 p-6">
                  <SkeletonText width="w-24" height="h-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 4 }, (_, index) => (
                      <div key={`step-${index}`} className="flex gap-4">
                        <SkeletonAvatar size="h-12 w-12" />
                        <div className="flex-1 space-y-2">
                          <SkeletonText width="w-20" height="h-4" />
                          <SkeletonText width="w-full" height="h-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 器具のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <SkeletonText width="w-32" height="h-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, index) => (
                      <div key={`equipment-${index}`} className="flex gap-4">
                        <SkeletonAvatar />
                        <div className="flex-1 space-y-2">
                          <SkeletonText width="w-32" height="h-5" />
                          <SkeletonText width="w-24" height="h-4" />
                          <SkeletonText width="w-full" height="h-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* サイドバーのスケルトン */}
            <aside
              className="w-full flex-shrink-0 space-y-6 lg:w-80"
              data-testid="recipe-sidebar-skeleton"
            >
              {/* バリスタ情報のスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <SkeletonText width="w-20" height="h-6" />
                  <div className="space-y-2">
                    <SkeletonText width="w-32" height="h-6" />
                    <SkeletonText width="w-40" height="h-4" />
                  </div>
                  <div className="space-y-2">
                    <SkeletonText width="w-16" height="h-4" />
                    <div className="space-y-2">
                      {Array.from({ length: 2 }, (_, index) => (
                        <SkeletonText key={`social-${index}`} width="w-full" height="h-10" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* タグのスケルトン */}
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <SkeletonText width="w-16" height="h-6" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div
                        key={`tag-${index}`}
                        className="bg-muted h-6 w-20 animate-pulse rounded-full"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * レシピリストスケルトン
 */
export type RecipeListSkeletonProps = SkeletonBaseProps & {
  count?: number;
};

export function RecipeListSkeleton({ className = '', count = 8 }: RecipeListSkeletonProps) {
  return (
    <div className={`grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 ${className}`}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`recipe-card-${index}`}
          className="animate-pulse"
          data-testid="recipe-card-skeleton"
        >
          <div className="space-y-4 rounded-xl border border-black bg-white p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <SkeletonText width="w-3/4" height="h-4" />
                <SkeletonText width="w-full" height="h-3" />
                <SkeletonText width="w-2/3" height="h-3" />
              </div>
              <SkeletonAvatar size="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <SkeletonText width="w-full" height="h-12" />
              <SkeletonText width="w-full" height="h-12" />
              <SkeletonText width="w-full" height="h-12" />
            </div>
            <div className="flex gap-2">
              <SkeletonText width="w-16" height="h-6" />
              <SkeletonText width="w-12" height="h-6" />
            </div>
            <SkeletonText width="w-full" height="h-8" />
          </div>
        </div>
      ))}
    </div>
  );
}
