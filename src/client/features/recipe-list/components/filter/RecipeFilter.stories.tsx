import type { Meta, StoryObj } from '@storybook/react';
import { X, Filter, RotateCcw } from 'lucide-react';
import React from 'react';

import { Button } from '@/client/shared/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/shared/shadcn/card';

type MockData = {
  isLoading?: boolean;
  hasChanges?: boolean;
  activeFilterCount?: number;
  pendingFilterCount?: number;
  filters?: {
    roastLevel?: string[];
    equipment?: string[];
  };
};

// モックされたRecipeFilterコンポーネント
function MockRecipeFilter({
  className = '',
  mockData = {},
}: {
  className?: string;
  mockData?: MockData;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const isLoading = mockData.isLoading ?? false;
  const hasChanges = mockData.hasChanges ?? false;
  const activeFilterCount = mockData.activeFilterCount ?? 0;
  const pendingFilterCount = mockData.pendingFilterCount ?? 0;

  const handleApplyFilters = () => {
    // eslint-disable-next-line no-console
    console.log('applyFilters called');
  };

  const handleResetFilters = () => {
    // eslint-disable-next-line no-console
    console.log('resetFilters called');
  };

  return (
    <div className={className}>
      {/* フィルター開閉ボタン（モバイル用） */}
      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>フィルター</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </div>
          <X className={`h-4 w-4 transition-transform ${isOpen ? '' : 'rotate-45'}`} />
        </Button>
      </div>

      {/* フィルターコンテンツ */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">フィルター条件</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 読み込み中のオーバーレイ */}
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* アクティブフィルター表示 */}
            {activeFilterCount > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">適用中のフィルター</h3>
                <div className="flex flex-wrap gap-2">
                  {mockData.filters?.roastLevel?.map((level: string) => (
                    <span
                      key={level}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                    >
                      {level}
                      <button className="text-blue-600 hover:text-blue-800">×</button>
                    </span>
                  ))}
                  {mockData.filters?.equipment?.map((item: string) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800"
                    >
                      {item}
                      <button className="text-green-600 hover:text-green-800">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* モックフィルター内容 */}
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">抽出器具</h3>
                <div className="text-sm text-gray-500">器具フィルター（モック）</div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium text-gray-700">抽出条件</h3>
                <div className="text-sm text-gray-500">条件フィルター（モック）</div>
              </div>
            </div>

            {/* 絞り込みボタン */}
            <div className="border-t pt-4">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  disabled={isLoading || (activeFilterCount === 0 && pendingFilterCount === 0)}
                  className={`px-6 transition-all duration-200 ${
                    activeFilterCount > 0 || pendingFilterCount > 0
                      ? 'border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50'
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  <RotateCcw
                    className={`mr-2 h-4 w-4 transition-transform duration-200 ${
                      isLoading ? 'animate-spin' : ''
                    }`}
                  />
                  リセット
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  disabled={isLoading || !hasChanges}
                  variant={hasChanges ? 'default' : 'secondary'}
                  className={`flex-1 transition-all duration-200 ${
                    hasChanges
                      ? 'transform bg-blue-600 text-white shadow-md hover:scale-[1.02] hover:bg-blue-700'
                      : 'cursor-not-allowed bg-gray-100 text-gray-500'
                  } ${isLoading ? 'animate-pulse' : ''}`}
                >
                  <Filter
                    className={`mr-2 h-4 w-4 transition-transform duration-200 ${hasChanges ? 'scale-110' : ''}`}
                  />
                  絞り込む
                  {pendingFilterCount > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs transition-all duration-200 ${
                        hasChanges
                          ? 'animate-bounce bg-white/20 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {pendingFilterCount}
                    </span>
                  )}
                </Button>
              </div>
              {hasChanges && (
                <div className="mt-3 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium text-blue-700">
                    変更があります。
                    <br />
                    絞り込むボタンを押して適用してください。
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const meta: Meta<typeof MockRecipeFilter> = {
  title: 'Features/Recipes/RecipeFilter',
  component: MockRecipeFilter,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'cafe-light',
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mockData: {},
  },
};

export const WithActiveFilters: Story = {
  args: {
    mockData: {
      activeFilterCount: 3,
      filters: {
        roastLevel: ['MEDIUM_DARK'],
        equipment: ['V60', 'ペーパーフィルター'],
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'アクティブなフィルターがある状態',
      },
    },
  },
};

export const WithChanges: Story = {
  args: {
    mockData: {
      hasChanges: true,
      pendingFilterCount: 2,
    },
  },
  parameters: {
    docs: {
      description: {
        story: '変更があって適用待ちの状態',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    mockData: {
      isLoading: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'ローディング中の状態',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    mockData: {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイル表示でのフィルター',
      },
    },
  },
};

export const Tablet: Story = {
  args: {
    mockData: {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'タブレット表示でのフィルター',
      },
    },
  },
};
