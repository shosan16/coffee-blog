import type { Meta, StoryObj } from '@storybook/react';

import type { RecipeDetailInfo } from '../../types/recipe-detail';

import RecipeDetailView from './RecipeDetailView';

const meta = {
  title: 'Features/Recipes/Detail/RecipeDetailView',
  component: RecipeDetailView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'レシピ詳細画面のメインビューコンポーネント。レスポンシブレイアウトで全情報を表示します。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    recipe: {
      description: 'レシピ詳細情報',
    },
  },
} satisfies Meta<typeof RecipeDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

// 完全なレシピデータ
const fullRecipe: RecipeDetailInfo = {
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
  publishedAt: '2025-06-20T10:30:00Z',
  createdAt: '2025-06-20T10:30:00Z',
  updatedAt: '2025-06-22T10:30:00Z',
  barista: {
    id: '1',
    name: '佐藤花子',
    affiliation: 'Specialty Coffee Shop ARIA',
    socialLinks: [
      {
        id: '1',
        platform: 'Instagram',
        url: 'https://instagram.com/coffee_hanako',
      },
      {
        id: '2',
        platform: 'Twitter',
        url: 'https://twitter.com/coffee_hanako',
      },
    ],
  },
  steps: [
    {
      id: '1',
      stepOrder: 1,
      timeSeconds: 30,
      description: 'ペーパーフィルターをV60ドリッパーにセット。コーヒー豆20gを投入。',
    },
    {
      id: '2',
      stepOrder: 2,
      timeSeconds: 45,
      description: '92℃のお湯を50ml注ぎ、30秒間蒸らす。',
    },
    {
      id: '3',
      stepOrder: 3,
      timeSeconds: 120,
      description: '残りのお湯250mlを3回に分けて注ぐ。',
    },
  ],
  equipment: [
    {
      id: '1',
      name: 'V60ドリッパー 02',
      brand: 'HARIO',
      description: '円錐形ドリッパーの代表格',
      affiliateLink: 'https://amazon.co.jp/hario-v60',
      equipmentType: {
        id: '1',
        name: 'ドリッパー',
        description: 'コーヒーを抽出するための器具',
      },
    },
    {
      id: '2',
      name: 'コーヒースケール',
      brand: 'Acaia',
      description: '精密な計量が可能',
      equipmentType: {
        id: '2',
        name: 'スケール',
        description: '重量を測定する器具',
      },
    },
  ],
  tags: [
    {
      id: '1',
      name: 'フルーティー',
      slug: 'fruity',
    },
    {
      id: '2',
      name: 'ライトロースト',
      slug: 'light-roast',
    },
    {
      id: '3',
      name: 'エチオピア',
      slug: 'ethiopia',
    },
  ],
};

// バリスタなしレシピ
const recipeWithoutBarista: RecipeDetailInfo = {
  ...fullRecipe,
  id: '2',
  title: 'シンプルドリップレシピ',
  summary: '基本的なドリップレシピ',
  barista: undefined,
};

// 最小限のレシピ
const minimalRecipe: RecipeDetailInfo = {
  id: '3',
  title: '最小限レシピ',
  roastLevel: 'MEDIUM',
  viewCount: 10,
  isPublished: true,
  createdAt: '2025-06-20T10:30:00Z',
  updatedAt: '2025-06-20T10:30:00Z',
  steps: [],
  equipment: [],
  tags: [],
};

// 詳細な情報を含むレシピ
const detailedRecipe: RecipeDetailInfo = {
  id: '4',
  title: 'プロフェッショナル向け高品質エチオピア・イルガチェフェ・ナチュラル製法 V60抽出レシピ',
  summary:
    'World Brewers Cup チャンピオンが開発した、エチオピア・イルガチェフェ・ナチュラル製法豆専用の高品質抽出レシピ。フルーティーで華やかな酸味と、複雑で深みのある香りを最大限に引き出します。',
  remarks:
    '※このレシピは、エチオピア・イルガチェフェ・ナチュラル製法の豆専用です。他の豆では異なる結果となる可能性があります。水質（硬度50-100mg/L推奨）、室温（20-25℃）、湿度（40-60%）も味に大きく影響しますので、環境にも注意してください。豆は焙煎後7-14日以内のものを使用し、抽出直前に挽くことを強く推奨します。',
  roastLevel: 'LIGHT',
  grindSize: 'MEDIUM_FINE',
  beanWeight: 22,
  waterTemp: 93,
  waterAmount: 350,
  brewingTime: 240,
  viewCount: 5420,
  isPublished: true,
  publishedAt: '2025-05-15T09:00:00Z',
  createdAt: '2025-05-15T09:00:00Z',
  updatedAt: '2025-06-25T14:30:00Z',
  barista: {
    id: '2',
    name: 'James Anderson',
    affiliation: 'World Coffee Research Institute & Blue Bottle Coffee Head Roaster',
    socialLinks: [
      {
        id: '3',
        platform: 'Instagram',
        url: 'https://instagram.com/james_coffee_research',
      },
      {
        id: '4',
        platform: 'Twitter',
        url: 'https://twitter.com/james_coffee',
      },
      {
        id: '5',
        platform: 'YouTube',
        url: 'https://youtube.com/@james_coffee_channel',
      },
      {
        id: '6',
        platform: 'LinkedIn',
        url: 'https://linkedin.com/in/james-coffee-research',
      },
    ],
  },
  steps: [
    {
      id: '1',
      stepOrder: 1,
      timeSeconds: 15,
      description:
        'ペーパーフィルターをV60ドリッパーにセット。フィルターの継ぎ目を互い違いに折り、ドリッパーにしっかりと密着させる。',
    },
    {
      id: '2',
      stepOrder: 2,
      timeSeconds: 30,
      description:
        'エチオピア・イルガチェフェ・ナチュラル製法のコーヒー豆22g（中細挽き）をフィルターに投入。軽く振って表面を平らにする。',
    },
    {
      id: '3',
      stepOrder: 3,
      timeSeconds: 45,
      description:
        '93℃のお湯を60ml注ぎ、粉全体を湿らせる。中心から外側に向かって「の」の字を描くように注ぐ。',
    },
    {
      id: '4',
      stepOrder: 4,
      timeSeconds: 75,
      description:
        '30秒間蒸らし。コーヒー粉が膨らみ、CO2ガスが抜ける様子を観察。良質な豆であればしっかりと膨らみます。',
    },
    {
      id: '5',
      stepOrder: 5,
      timeSeconds: 135,
      description:
        '2回目の注湯：120mlのお湯を60秒かけてゆっくりと注ぐ。湯面を一定に保ち、タイマーを確認しながら一定のペースを保つ。',
    },
    {
      id: '6',
      stepOrder: 6,
      timeSeconds: 195,
      description:
        '3回目の注湯：残り170mlのお湯を60秒かけて注ぐ。最後まで一定のペースを保ち、粉の層を崩さないよう注意。',
    },
    {
      id: '7',
      stepOrder: 7,
      timeSeconds: 240,
      description:
        'ドリップ完了（総抽出時間4分）。サーバーを軽く回してコーヒーを混ぜ、温めたカップに注いで完成。香りを楽しんでからお飲みください。',
    },
  ],
  equipment: [
    {
      id: '3',
      name: 'V60ドリッパー 02 セラミック',
      brand: 'HARIO',
      description:
        'セラミック製V60ドリッパー。熱伝導性が良く、温度が安定します。プロ仕様の高品質モデル。',
      affiliateLink: 'https://amazon.co.jp/hario-v60-ceramic',
      equipmentType: {
        id: '1',
        name: 'ドリッパー',
        description: 'コーヒーを抽出するための器具',
      },
    },
    {
      id: '4',
      name: 'Pearl Scale',
      brand: 'Acaia',
      description:
        '0.1g単位での精密計量が可能なプロフェッショナルスケール。タイマー機能、フロー機能付き。',
      affiliateLink: 'https://amazon.co.jp/acaia-pearl-scale',
      equipmentType: {
        id: '2',
        name: 'スケール',
        description: '重量を測定する器具',
      },
    },
    {
      id: '5',
      name: 'V60専用ペーパーフィルター 02 ホワイト',
      brand: 'HARIO',
      description: 'V60専用の漂白ペーパーフィルター。紙の匂いが少なく、クリーンな味わいを実現。',
      affiliateLink: 'https://amazon.co.jp/hario-v60-filters',
      equipmentType: {
        id: '3',
        name: 'フィルター',
        description: 'コーヒーを濾過する紙',
      },
    },
    {
      id: '6',
      name: 'V60レンジサーバー 600',
      brand: 'HARIO',
      description: '耐熱ガラス製のコーヒーサーバー。600ml容量で2-4杯分に対応。',
      affiliateLink: 'https://amazon.co.jp/hario-v60-server',
      equipmentType: {
        id: '4',
        name: 'サーバー',
        description: 'コーヒーを受けるガラス容器',
      },
    },
    {
      id: '7',
      name: 'ドリップケトル ヴォーノ',
      brand: 'Kalita',
      description: '細口で注湯コントロールがしやすいステンレス製ケトル。700ml容量。',
      affiliateLink: 'https://amazon.co.jp/kalita-bono-kettle',
      equipmentType: {
        id: '5',
        name: 'ケトル',
        description: 'お湯を注ぐための器具',
      },
    },
  ],
  tags: [
    {
      id: '4',
      name: 'プロフェッショナル',
      slug: 'professional',
    },
    {
      id: '5',
      name: 'World Brewers Cup',
      slug: 'world-brewers-cup',
    },
    {
      id: '6',
      name: 'エチオピア',
      slug: 'ethiopia',
    },
    {
      id: '7',
      name: 'イルガチェフェ',
      slug: 'yirgacheffe',
    },
    {
      id: '8',
      name: 'ナチュラル製法',
      slug: 'natural-process',
    },
    {
      id: '9',
      name: 'ライトロースト',
      slug: 'light-roast',
    },
    {
      id: '10',
      name: 'フルーティー',
      slug: 'fruity',
    },
  ],
};

export const Default: Story = {
  args: {
    recipe: fullRecipe,
  },
};

export const WithoutBarista: Story = {
  name: 'バリスタなし',
  args: {
    recipe: recipeWithoutBarista,
  },
  parameters: {
    docs: {
      description: {
        story: 'バリスタ情報がないレシピの表示例。サイドバーにバリスタカードが表示されません。',
      },
    },
  },
};

export const MinimalRecipe: Story = {
  name: '最小限レシピ',
  args: {
    recipe: minimalRecipe,
  },
  parameters: {
    docs: {
      description: {
        story: '必須フィールドのみの最小構成レシピ。手順、器具、タグが空の状態。',
      },
    },
  },
};

export const DetailedRecipe: Story = {
  name: '詳細レシピ',
  args: {
    recipe: detailedRecipe,
  },
  parameters: {
    docs: {
      description: {
        story: '詳細な情報を含むプロフェッショナル向けレシピ。長い説明文や多数の器具を含む。',
      },
    },
  },
};

export const LongTitle: Story = {
  name: '長いタイトル',
  args: {
    recipe: {
      ...fullRecipe,
      id: '5',
      title:
        'エチオピア・イルガチェフェ・ゲデオ地区・コチャレ農園・ナチュラル製法・スペシャルティグレード・ハンドピック選別豆を使用した究極のV60抽出レシピ（上級者向け）',
    },
  },
  parameters: {
    docs: {
      description: {
        story: '非常に長いタイトルの表示例。テキストの折り返しとレイアウトの確認。',
      },
    },
  },
};

export const MobileView: Story = {
  name: 'モバイル表示',
  args: {
    recipe: fullRecipe,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'モバイルデバイスでの表示例。1カラムレイアウトになります。',
      },
    },
  },
};

export const TabletView: Story = {
  name: 'タブレット表示',
  args: {
    recipe: fullRecipe,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'タブレットデバイスでの表示例。レスポンシブレイアウトの確認。',
      },
    },
  },
};
