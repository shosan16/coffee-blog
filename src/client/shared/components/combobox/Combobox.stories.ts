import type { Meta, StoryObj } from '@storybook/react';

import Combobox from './Combobox';

const mockOptions = [
  { value: 'コーヒーミル', label: 'コーヒーミル' },
  { value: 'ドリッパー', label: 'ドリッパー' },
  { value: 'ペーパーフィルター', label: 'ペーパーフィルター' },
  { value: 'スケール', label: 'スケール' },
  { value: 'ケトル', label: 'ケトル' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Shared/Components/Combobox',
  component: Combobox,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'cafe-light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: '選択肢の配列',
      control: { type: 'object' },
    },
    placeholder: {
      description: 'プレースホルダーテキスト',
      control: { type: 'text' },
    },
    value: {
      description: '選択された値',
      control: { type: 'text' },
    },
    disabled: {
      description: '無効状態',
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: mockOptions,
    placeholder: '選択してください',
  },
};

export const WithSelectedValue: Story = {
  args: {
    options: mockOptions,
    placeholder: '選択してください',
    value: 'ドリッパー',
  },
};

export const Disabled: Story = {
  args: {
    options: mockOptions,
    placeholder: '選択してください',
    disabled: true,
  },
};

export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: 'オプションがありません',
  },
};
