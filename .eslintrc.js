const path = require('path');

module.exports = {
  root: true,
  // 基本設定
  reportUnusedDisableDirectives: true,

  // 無視するファイルやディレクトリを指定
  ignorePatterns: [
    'node_modules/**',
    'dist/**',
    'build/**',
    'out/**',
    '*.lock',
    'package-lock.json',
    'package.json',
    'src/shared/components/ui/**',
  ],

  // Next.jsの推奨設定を取り込む
  extends: ['next/core-web-vitals'],

  // 共通ルール - すべてのファイルに適用
  plugins: ['import'],
  rules: {
    // インポートの順番（シンプル化）
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

    // export規則の基本設定 - デフォルトではすべてのファイルで名前付きエクスポートを強制
    'import/no-default-export': 'error',
    'import/no-named-export': 'off',
    'import/no-named-default': 'error',
  },

  // 個別設定（overrides）
  overrides: [
    // JavaScript と JSON ファイル用の設定
    {
      files: ['**/*.js', '**/*.jsx', '**/*.json', '**/*.mjs', '**/*.cjs'],
      // TypeScript関連のルールを明示的に無効化
      rules: {
        '@typescript-eslint/prefer-readonly': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },

    // TypeScriptファイル用の設定
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['@typescript-eslint', 'import'],
      rules: {
        // TypeScript関連
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/prefer-readonly': 'error',

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
          // 簡略化されたbooleanパラメータ命名規則
          {
            selector: 'parameter',
            types: ['boolean'],
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
        ],
      },
    },

    // React関連ルール
    {
      files: ['**/*.tsx', '**/*.jsx'],
      plugins: ['react', 'react-hooks'],
      settings: {
        react: {
          version: 'detect', // React バージョンの警告を解消
        },
      },
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/prefer-stateless-function': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/no-array-index-key': 'error',
        'react/function-component-definition': [
          'error',
          { namedComponents: 'function-declaration' },
        ],
      },
    },

    // デフォルトエクスポートを許可する例外ファイル
    {
      files: [
        // Next.jsのページファイル
        '**/app/**/page.{tsx,jsx}',
        '**/app/**/layout.{tsx,jsx}',
        '**/app/**/loading.{tsx,jsx}',
        '**/app/**/error.{tsx,jsx}',
        '**/app/**/not-found.{tsx,jsx}',
        '**/pages/**/*.{tsx,jsx}',
        // コンポーネントファイル
        '**/components/**/*.{ts,tsx}',
        // その他UIファイル
        '**/*.tsx',
      ],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
};
