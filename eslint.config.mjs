// eslint.config.js の修正版
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import importPlugin from 'eslint-plugin-import';
import typescriptEslintParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 無視するファイルやディレクトリを指定
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', 'out/**', '*.lock'],
  },

  // ESLintのルールを指定
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'prettier' // Prettierと競合するルールを無効化
  ),

  // TypeScriptファイル用の型情報を設定
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // 命名規則
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['camelCase'],
        },
        // 自作のブール型変数にはプレフィックスを推奨（警告レベル）
        {
          selector: 'parameter',
          types: ['boolean'],
          format: ['camelCase'],
          prefix: ['is', 'has', 'can', 'should', 'will', 'did'],
          leadingUnderscore: 'allow',
          filter: {
            regex: '^(isLoading|error|data)$',
            match: false
          },
        },
      ],

      // インポートの順番
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // DRY原則
      'no-duplicate-imports': 'error',
      'import/no-duplicates': 'error',

      // TypeScript関連
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',

      // React関連
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prefer-stateless-function': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/no-array-index-key': 'error',

      // コンポーネント定義
      'react/function-component-definition': ['error', { namedComponents: 'function-declaration' }],
    },
  },
];

export default eslintConfig;