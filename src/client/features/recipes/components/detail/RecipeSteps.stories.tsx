import type { Meta, StoryObj } from '@storybook/react';

import RecipeSteps from './RecipeSteps';
import type { RecipeStepInfo } from '../../types/recipe-detail';

const meta = {
  title: 'Features/Recipes/Detail/RecipeSteps',
  component: RecipeSteps,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'レシピの手順をタイムライン形式で表示するコンポーネント。時間表示と説明文を含みます。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    steps: {
      description: 'レシピ手順の配列',
    },
  },
} satisfies Meta<typeof RecipeSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的な手順データ
const basicSteps: RecipeStepInfo[] = [
  {
    id: '1',
    stepOrder: 1,
    timeSeconds: 30,
    description: 'フィルターをドリッパーにセットし、コーヒー粉20gを投入',
  },
  {
    id: '2',
    stepOrder: 2,
    timeSeconds: 45,
    description: '92℃のお湯を50ml注ぎ、30秒間蒸らす',
  },
  {
    id: '3',
    stepOrder: 3,
    timeSeconds: 120,
    description: '残りのお湯250mlを3回に分けて注ぐ',
  },
];

// 時間なし手順を含むデータ
const mixedSteps: RecipeStepInfo[] = [
  {
    id: '1',
    stepOrder: 1,
    description: 'コーヒー豆の香りを確認し、挽き具合をチェック',
  },
  {
    id: '2',
    stepOrder: 2,
    timeSeconds: 60,
    description: 'ドリッパーとサーバーを温める',
  },
  {
    id: '3',
    stepOrder: 3,
    timeSeconds: 180,
    description: '抽出開始：最初の30秒で蒸らし、その後ゆっくりと注湯',
  },
];

// 詳細な手順データ
const detailedSteps: RecipeStepInfo[] = [
  {
    id: '1',
    stepOrder: 1,
    timeSeconds: 15,
    description:
      'ペーパーフィルターをV60ドリッパーにセット。フィルターの継ぎ目を互い違いに折り、ドリッパーにしっかりと密着させる',
  },
  {
    id: '2',
    stepOrder: 2,
    timeSeconds: 30,
    description: 'コーヒー豆20g（中細挽き）をフィルターに投入。軽く振って表面を平らにする',
  },
  {
    id: '3',
    stepOrder: 3,
    timeSeconds: 45,
    description:
      '92℃のお湯を50ml注ぎ、粉全体を湿らせる。この時、中心から外側に向かって「の」の字を描くように注ぐ',
  },
  {
    id: '4',
    stepOrder: 4,
    timeSeconds: 75,
    description: '30秒間蒸らし。コーヒー粉が膨らみ、ガスが抜ける様子を観察',
  },
  {
    id: '5',
    stepOrder: 5,
    timeSeconds: 135,
    description: '2回目の注湯：100mlのお湯を60秒かけてゆっくりと注ぐ。湯面を一定に保つ',
  },
  {
    id: '6',
    stepOrder: 6,
    timeSeconds: 195,
    description: '3回目の注湯：残り150mlのお湯を60秒かけて注ぐ。最後まで一定のペースを保つ',
  },
  {
    id: '7',
    stepOrder: 7,
    timeSeconds: 240,
    description: 'ドリップ完了。サーバーを軽く回してコーヒーを混ぜ、カップに注いで完成',
  },
];

// 長時間の手順データ
const longTimeSteps: RecipeStepInfo[] = [
  {
    id: '1',
    stepOrder: 1,
    timeSeconds: 300, // 5分
    description: 'コーヒー豆をお湯で温めて、余熱を行う',
  },
  {
    id: '2',
    stepOrder: 2,
    timeSeconds: 900, // 15分
    description: 'フレンチプレスで抽出。お湯を注いでから15分間待つ',
  },
  {
    id: '3',
    stepOrder: 3,
    timeSeconds: 960, // 16分
    description: 'プランジャーをゆっくりと押し下げて抽出完了',
  },
];

// 特殊文字を含む手順
const specialCharacterSteps: RecipeStepInfo[] = [
  {
    id: '1',
    stepOrder: 1,
    timeSeconds: 30,
    description: '水温は92℃±2℃の範囲で調整してください（重要！）',
  },
  {
    id: '2',
    stepOrder: 2,
    timeSeconds: 60,
    description: 'コーヒー豆15g〜20gを使用。お好みで調整可能★',
  },
  {
    id: '3',
    stepOrder: 3,
    timeSeconds: 120,
    description: '注湯パターン：「中央→外側→中央」を3回繰り返す ☕',
  },
];

export const Default: Story = {
  args: {
    steps: basicSteps,
  },
};

export const Empty: Story = {
  name: '空の手順',
  args: {
    steps: [],
  },
  parameters: {
    docs: {
      description: {
        story: '手順が登録されていない場合の表示例。',
      },
    },
  },
};

export const WithoutTime: Story = {
  name: '時間なし手順含む',
  args: {
    steps: mixedSteps,
  },
  parameters: {
    docs: {
      description: {
        story: '時間指定がない手順を含む例。準備段階などで使用。',
      },
    },
  },
};

export const DetailedSteps: Story = {
  name: '詳細な手順',
  args: {
    steps: detailedSteps,
  },
  parameters: {
    docs: {
      description: {
        story: '詳細な説明文を含む手順の表示例。初心者向けレシピを想定。',
      },
    },
  },
};

export const LongTimeSteps: Story = {
  name: '長時間手順',
  args: {
    steps: longTimeSteps,
  },
  parameters: {
    docs: {
      description: {
        story: '長時間の手順を含む例。フレンチプレスなどの抽出方法を想定。',
      },
    },
  },
};

export const WithSpecialCharacters: Story = {
  name: '特殊文字含む',
  args: {
    steps: specialCharacterSteps,
  },
  parameters: {
    docs: {
      description: {
        story: '特殊文字や記号、絵文字を含む手順の表示例。',
      },
    },
  },
};

export const SingleStep: Story = {
  name: '単一手順',
  args: {
    steps: [
      {
        id: '1',
        stepOrder: 1,
        timeSeconds: 180,
        description: 'シンプルな一工程でのコーヒー抽出。お湯を注いで3分待つだけ。',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '単一の手順のみの表示例。',
      },
    },
  },
};

export const VariousTimeFormats: Story = {
  name: '様々な時間フォーマット',
  args: {
    steps: [
      {
        id: '1',
        stepOrder: 1,
        timeSeconds: 15,
        description: '15秒の短時間手順',
      },
      {
        id: '2',
        stepOrder: 2,
        timeSeconds: 60,
        description: '1分ちょうどの手順',
      },
      {
        id: '3',
        stepOrder: 3,
        timeSeconds: 90,
        description: '1分30秒の手順',
      },
      {
        id: '4',
        stepOrder: 4,
        timeSeconds: 195,
        description: '3分15秒の手順',
      },
      {
        id: '5',
        stepOrder: 5,
        timeSeconds: 3600,
        description: '1時間の手順（エイジング等）',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '様々な時間フォーマットの表示確認。',
      },
    },
  },
};
