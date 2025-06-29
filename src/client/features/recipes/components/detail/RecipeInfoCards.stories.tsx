import type { Meta, StoryObj } from '@storybook/react';

import RecipeInfoCards from './RecipeInfoCards';
import type { RecipeDetailInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/RecipeInfoCards',
  component: RecipeInfoCards,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'レシピの基本情報をカード形式で表示するコンポーネント。焙煎度、豆重量、水温などの詳細情報を含みます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    recipe: {
      description: 'レシピ詳細情報（基本情報表示用）',
    },
  },
} satisfies Meta<typeof RecipeInfoCards>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なレシピデータ作成ヘルパー
const createRecipeInfo = (overrides: Partial<RecipeDetailInfo> = {}): RecipeDetailInfo => ({
  id: '1',
  title: 'エチオピア イルガチェフェ V60レシピ',
  roastLevel: 'LIGHT_MEDIUM',
  grindSize: 'MEDIUM_FINE',
  beanWeight: 20,
  waterTemp: 92,
  waterAmount: 300,
  brewingTime: 180,
  viewCount: 1250,
  isPublished: true,
  createdAt: '2025-06-20T10:30:00Z',
  updatedAt: '2025-06-22T10:30:00Z',
  steps: [],
  equipment: [],
  tags: [],
  ...overrides,
});

export const Default: Story = {
  args: {
    recipe: createRecipeInfo(),
  },
};

export const FullInformation: Story = {
  name: '完全な情報',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'MEDIUM_DARK',
      grindSize: 'FINE',
      beanWeight: 25,
      waterTemp: 95,
      waterAmount: 400,
      brewingTime: 240,
      summary: '詳細な抽出条件を含むプロフェッショナルレシピ',
      remarks: '各パラメータは厳密に管理してください',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'すべての抽出パラメータが設定されている完全な情報の表示例。',
      },
    },
  },
};

export const MinimalInformation: Story = {
  name: '最小情報',
  args: {
    recipe: createRecipeInfo({
      grindSize: undefined,
      beanWeight: undefined,
      waterTemp: undefined,
      waterAmount: undefined,
      brewingTime: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '焙煎度のみが設定された最小構成の表示例。',
      },
    },
  },
};

export const PartialInformation: Story = {
  name: '部分的な情報',
  args: {
    recipe: createRecipeInfo({
      grindSize: undefined,
      waterTemp: 90,
      waterAmount: undefined,
      brewingTime: 200,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '一部の情報のみが設定されている場合の表示例。',
      },
    },
  },
};

export const VariousRoastLevels: Story = {
  name: '様々な焙煎度',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'LIGHT',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'ライトローストの表示例。他の焙煎度も確認してください。',
      },
    },
  },
};

export const DarkRoast: Story = {
  name: 'ダークロースト',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'DARK',
      grindSize: 'COARSE',
      beanWeight: 30,
      waterTemp: 88,
      waterAmount: 500,
      brewingTime: 300,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'ダークローストの抽出条件例。低温長時間抽出のパラメータ。',
      },
    },
  },
};

export const FineGrind: Story = {
  name: '極細挽き',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'MEDIUM',
      grindSize: 'EXTRA_FINE',
      beanWeight: 18,
      waterTemp: 85,
      waterAmount: 250,
      brewingTime: 120,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'エスプレッソ用極細挽きの表示例。短時間抽出のパラメータ。',
      },
    },
  },
};

export const CoarseGrind: Story = {
  name: '粗挽き',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'LIGHT_MEDIUM',
      grindSize: 'EXTRA_COARSE',
      beanWeight: 35,
      waterTemp: 95,
      waterAmount: 600,
      brewingTime: 480,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'フレンチプレス用粗挽きの表示例。長時間抽出のパラメータ。',
      },
    },
  },
};

export const HighTemperature: Story = {
  name: '高温抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'LIGHT',
      grindSize: 'MEDIUM',
      beanWeight: 22,
      waterTemp: 96,
      waterAmount: 350,
      brewingTime: 200,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '高温での抽出条件例。ライトローストに適した温度設定。',
      },
    },
  },
};

export const LowTemperature: Story = {
  name: '低温抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'DARK',
      grindSize: 'MEDIUM_COARSE',
      beanWeight: 28,
      waterTemp: 82,
      waterAmount: 400,
      brewingTime: 360,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '低温での抽出条件例。ダークローストに適した温度設定。',
      },
    },
  },
};

export const QuickBrew: Story = {
  name: '短時間抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'MEDIUM',
      grindSize: 'FINE',
      beanWeight: 15,
      waterTemp: 94,
      waterAmount: 200,
      brewingTime: 60,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '1分での短時間抽出例。急いでいる時のレシピを想定。',
      },
    },
  },
};

export const SlowBrew: Story = {
  name: '長時間抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'LIGHT_MEDIUM',
      grindSize: 'COARSE',
      beanWeight: 40,
      waterTemp: 90,
      waterAmount: 700,
      brewingTime: 600,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '10分の長時間抽出例。コールドブリューやフレンチプレスを想定。',
      },
    },
  },
};

export const HighRatio: Story = {
  name: '高濃度抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'MEDIUM_DARK',
      grindSize: 'MEDIUM_FINE',
      beanWeight: 30,
      waterTemp: 93,
      waterAmount: 200,
      brewingTime: 150,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '豆と水の比率が高い濃厚な抽出例。エスプレッソ系を想定。',
      },
    },
  },
};

export const LowRatio: Story = {
  name: '低濃度抽出',
  args: {
    recipe: createRecipeInfo({
      roastLevel: 'LIGHT',
      grindSize: 'MEDIUM',
      beanWeight: 15,
      waterTemp: 91,
      waterAmount: 500,
      brewingTime: 250,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '豆と水の比率が低いライトな抽出例。アメリカンコーヒーを想定。',
      },
    },
  },
};
