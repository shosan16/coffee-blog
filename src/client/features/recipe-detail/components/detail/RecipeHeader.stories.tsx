import type { Meta, StoryObj } from '@storybook/react';

import RecipeHeader from './RecipeHeader';
import type { RecipeDetailInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/RecipeHeader',
  component: RecipeHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'レシピ詳細ページのヘッダーコンポーネント。タイトル、概要、備考を表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    recipe: {
      description: 'レシピ詳細情報（ヘッダー表示用）',
    },
  },
} satisfies Meta<typeof RecipeHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なレシピデータ（ヘッダー用の最小限情報）
const createRecipeHeader = (overrides: Partial<RecipeDetailInfo> = {}): RecipeDetailInfo => ({
  id: '1',
  title: 'エチオピア イルガチェフェ V60レシピ',
  summary: 'フルーティーで華やかな酸味が特徴のエチオピア豆を、V60で最大限に引き出すレシピ',
  remarks: '特に蒸らし時間に注意してください。豆の膨らみを確認してから次の工程に進みましょう。',
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
    recipe: createRecipeHeader(),
  },
};

export const WithoutSummary: Story = {
  name: '概要なし',
  args: {
    recipe: createRecipeHeader({
      summary: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '概要が設定されていない場合の表示例。',
      },
    },
  },
};

export const WithoutRemarks: Story = {
  name: '備考なし',
  args: {
    recipe: createRecipeHeader({
      remarks: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '備考が設定されていない場合の表示例。',
      },
    },
  },
};

export const MinimalInfo: Story = {
  name: '最小情報',
  args: {
    recipe: createRecipeHeader({
      summary: undefined,
      remarks: undefined,
    }),
  },
  parameters: {
    docs: {
      description: {
        story: 'タイトルのみの最小構成。概要も備考もない状態。',
      },
    },
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    recipe: createRecipeHeader({
      title:
        'エチオピア・イルガチェフェ・ゲデオ地区・コチャレ農園・ナチュラル製法・スペシャルティグレード・ハンドピック選別豆を使用した究極のV60抽出レシピ（上級者向け・World Brewers Cup優勝レシピ）',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '非常に長いタイトルの表示例。テキストの折り返しとレイアウトの確認。',
      },
    },
  },
};

export const LongSummary: Story = {
  name: '長い概要',
  args: {
    recipe: createRecipeHeader({
      summary:
        'このレシピは、エチオピア・イルガチェフェ地区の高品質なコーヒー豆を使用したV60抽出方法です。特に注目すべきは、豆本来のフルーティーで華やかな酸味を最大限に引き出すための緻密な温度管理と抽出時間の調整です。初心者の方でも失敗しないよう、各工程を詳細に説明し、重要なポイントには特に注意を促しています。また、使用する器具の選び方から、豆の挽き方、お湯の注ぎ方まで、プロフェッショナルなバリスタの技術を家庭でも再現できるよう工夫されたレシピです。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '長い概要文の表示例。詳細な説明が含まれる場合を想定。',
      },
    },
  },
};

export const LongRemarks: Story = {
  name: '長い備考',
  args: {
    recipe: createRecipeHeader({
      remarks:
        'このレシピを実行する際の重要な注意事項をいくつか記載します。まず、水質について：硬度50-100mg/Lの軟水〜中硬水を使用してください。水道水の場合は一度沸騰させてカルキを抜いてから使用することを推奨します。次に、豆について：焙煎後7-14日以内の新鮮な豆を使用し、抽出直前に挽くことが重要です。室温や湿度も味に影響するため、室温20-25℃、湿度40-60%の環境での抽出を推奨します。また、使用する器具は事前に温めておくことで、抽出温度の安定性が向上します。最後に、このレシピはエチオピア・イルガチェフェ専用に調整されているため、他の産地の豆では異なる結果となる可能性があることをご理解ください。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '長い備考文の表示例。詳細な注意事項が含まれる場合を想定。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字含む',
  args: {
    recipe: createRecipeHeader({
      title: 'Chemex® 8-Cup "Perfect Pour" レシピ',
      summary:
        '特許取得済みの濾過システムを使用した、FDA認定・BPA-フリーのChemex®での抽出方法（90℃±2℃推奨）',
      remarks:
        '※重要: 必ずChemex®専用フィルターを使用してください。他社製品では正しい抽出ができません。水温は90℃±2℃の範囲で調整し、室温（20-25℃）・湿度（40-60%）にも注意してください。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号を含む情報の表示例。商標記号、度数記号、括弧などを含む。',
      },
    },
  },
};

export const MultilineContent: Story = {
  name: '複数行コンテンツ',
  args: {
    recipe: createRecipeHeader({
      summary:
        '以下の特徴を持つレシピです：\n\n• フルーティーな酸味\n• 華やかな香り\n• クリーンな後味\n• 初心者でも失敗しにくい',
      remarks:
        '注意事項：\n\n1. 水温は92℃を維持\n2. 蒸らし時間は必ず30秒\n3. 注湯速度は一定に保つ\n4. 豆は抽出直前に挽く\n\n上記を守ることで最高の一杯が楽しめます。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '改行を含む複数行コンテンツの表示例。リスト形式の情報を含む。',
      },
    },
  },
};

export const ShortTitle: Story = {
  name: '短いタイトル',
  args: {
    recipe: createRecipeHeader({
      title: 'V60レシピ',
      summary: 'シンプルなV60抽出',
      remarks: '基本を大切に。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '短いタイトルと簡潔な内容の表示例。',
      },
    },
  },
};

export const JapaneseAndEnglish: Story = {
  name: '日英混合',
  args: {
    recipe: createRecipeHeader({
      title: 'Ethiopian Yirgacheffe V60 Recipe by Tokyo Coffee Master',
      summary:
        'World-class Ethiopian coffee extraction recipe. エチオピア産最高品質豆を使用したプロフェッショナルレシピです。',
      remarks:
        'Important: Use 92°C water temperature. 重要：水温は92℃を厳守してください。Equipment must be pre-heated. 器具は必ず予熱してください。',
    }),
  },
  parameters: {
    docs: {
      description: {
        story: '日本語と英語が混在する内容の表示例。国際的なレシピを想定。',
      },
    },
  },
};
