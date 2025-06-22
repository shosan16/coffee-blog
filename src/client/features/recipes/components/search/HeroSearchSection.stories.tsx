import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

type MockData = {
  pendingSearchValue?: string;
  resultCount?: number;
};

// モックされたHeroSearchSectionコンポーネント
function MockHeroSearchSection({
  initialResultCount,
  mockData = {},
}: {
  initialResultCount?: number;
  mockData?: MockData;
}) {
  const [searchValue, setSearchValue] = React.useState(mockData.pendingSearchValue ?? '');
  const resultCount = mockData.resultCount ?? initialResultCount;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // eslint-disable-next-line no-console
    console.log('updateSearchValue called with:', value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // eslint-disable-next-line no-console
      console.log('applySearch called');
    }
  };

  const handleSearchClick = () => {
    // eslint-disable-next-line no-console
    console.log('applySearch called');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-amber-800 via-orange-800 to-amber-900 py-20 text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* メインタイトル */}
          <div className="mb-6 h-16 w-16 text-amber-100">☕</div>
          <h1 className="mb-4 text-5xl font-bold tracking-tight">Coffee Recipe Collection</h1>
          <p className="mb-8 max-w-2xl text-xl text-stone-100">
            プロのバリスタが考案した最高のコーヒーレシピで
            <br />
            おうちカフェを極上の体験に
          </p>

          {/* 検索ボックス */}
          <div className="w-full max-w-2xl space-y-4">
            <div onKeyDown={handleKeyDown}>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="レシピを検索... （例：エスプレッソ、ドリップ）"
                className="h-14 w-full rounded-lg border-0 bg-white/95 px-4 text-lg text-gray-900 shadow-2xl backdrop-blur-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                aria-label="コーヒーレシピを検索"
              />
            </div>

            {/* 検索ボタン */}
            <div className="hidden sm:block">
              <button
                type="button"
                onClick={handleSearchClick}
                className="rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-amber-900 focus:outline-none"
              >
                レシピを検索
              </button>
            </div>

            {/* 結果数表示 */}
            {resultCount !== undefined && (
              <div className="text-center text-sm text-amber-100">
                {resultCount}件のレシピが見つかりました
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof MockHeroSearchSection> = {
  title: 'Features/Recipes/HeroSearchSection',
  component: MockHeroSearchSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    initialResultCount: {
      description: '初期検索結果数',
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialResultCount: 44,
  },
};

export const NoResults: Story = {
  args: {
    initialResultCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story: '検索結果が0件の状態',
      },
    },
  },
};

export const ManyResults: Story = {
  args: {
    initialResultCount: 150,
  },
  parameters: {
    docs: {
      description: {
        story: '検索結果が多数ある状態',
      },
    },
  },
};

export const WithSearchValue: Story = {
  args: {
    initialResultCount: 12,
    mockData: {
      pendingSearchValue: 'エスプレッソ',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '検索キーワードが入力されている状態',
      },
    },
  },
};

export const WithoutInitialCount: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: '初期結果数が設定されていない状態',
      },
    },
  },
};
