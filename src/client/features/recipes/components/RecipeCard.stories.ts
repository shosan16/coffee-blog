import type { Meta, StoryObj } from '@storybook/react';
import RecipeCard from './RecipeCard';
import { Recipe } from '../types/recipe';

const mockRecipe: Recipe = {
  id: '1',
  title: 'ネルドリップでタンザニア豆の香りを最大限に引き出す',
  summary: 'エチオピア産の豆を使ったペーパードリップのレシピです。',
  roastLevel: 'MEDIUM_DARK',
  grindSize: 'EXTRA_FINE',
  beanWeight: 22,
  waterTemp: 85,
  waterAmount: 352,
  equipment: ['フェロー オデ'],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const meta: Meta<typeof RecipeCard> = {
  title: 'Features/Recipes/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'cafe-light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    recipe: {
      description: 'レシピオブジェクト',
      control: { type: 'object' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recipe: mockRecipe,
  },
};

export const LightRoast: Story = {
  args: {
    recipe: {
      ...mockRecipe,
      title: 'ライトローストエチオピア豆のフルーティーな味わい',
      roastLevel: 'LIGHT_MEDIUM',
      grindSize: 'EXTRA_COARSE',
      beanWeight: 17,
      waterTemp: 96,
      waterAmount: 289,
      equipment: ['ナイトフォール K0', 'エアロプレス フィルター'],
    },
  },
};

export const DarkRoast: Story = {
  args: {
    recipe: {
      ...mockRecipe,
      title: 'ブラジル産深煎り豆の濃厚レシピ',
      roastLevel: 'DARK',
      grindSize: 'MEDIUM_COARSE',
      beanWeight: 20,
      waterTemp: 88,
      waterAmount: 240,
      equipment: ['HARIO V60', '1Zpresso K-Plus', 'CHEMEX フィルター'],
    },
  },
};

export const NoEquipment: Story = {
  args: {
    recipe: {
      ...mockRecipe,
      title: 'シンプルなハンドドリップ',
      equipment: [],
    },
  },
};
