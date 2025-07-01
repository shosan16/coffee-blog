const path = require('path');

module.exports = {
  root: true,
  // 基本設定
  reportUnusedDisableDirectives: true, // 不要なeslint-disableコメントがあれば警告する

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

  extends: ['next/core-web-vitals'], // Next.js公式の推奨設定を適用

  // import resolverの設定を追加してnative bindingエラーを回避
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  // 共通ルール - すべてのファイルに適用
  plugins: ['import'], // importに関するルールを提供するプラグインを有効化
  rules: {
    // コード品質向上ルール
    'no-unused-vars': 'off', // 未使用変数の検出を無効（TypeScriptで上書きするため）
    'no-console': 'error', // console.log等の使用を禁止（本番環境での不要な出力を防ぐ）
    'no-debugger': 'error', // debugger文の使用を禁止（本番環境での停止を防ぐ）
    'no-alert': 'error', // alert/confirm/promptの使用を禁止（UX改善のため）
    'prefer-const': 'error', // 再代入されない変数はconstを使用（意図の明確化）
    'no-var': 'error', // varの使用を禁止（スコープの問題を回避）
    'object-shorthand': 'error', // オブジェクトのショートハンド記法を強制（可読性向上）
    'prefer-template': 'error', // 文字列結合よりテンプレートリテラルを推奨（可読性向上）
    'no-nested-ternary': 'error', // ネストした三項演算子を禁止（可読性向上）
    'no-return-assign': 'error', // return文での代入を禁止（意図しない副作用を防ぐ）
    'no-throw-literal': 'error', // リテラルをthrowすることを禁止（エラーハンドリングの統一）
    'prefer-promise-reject-errors': 'error', // Promise.rejectにErrorオブジェクトを強制（エラー情報の統一）
    'no-loop-func': 'error', // ループ内での関数作成を禁止（パフォーマンス改善）
    'no-inner-declarations': 'error', // ネストしたブロック内での関数/変数宣言を禁止（ホイスティング問題回避）

    // インポートの順番 - native bindingエラー回避のため一時的に無効
    'import/order': 'off',

    // DRY原則
    'no-duplicate-imports': 'error', // 同じモジュールの重複importを禁止
    'import/no-duplicates': 'off', // native bindingエラー回避のため一時的に無効

    // export規則の基本設定 - デフォルトではすべてのファイルで名前付きエクスポートを強制
    'import/no-default-export': 'error', // デフォルトエクスポートを禁止（明示的な命名を強制）
    'import/no-named-export': 'off', // 名前付きエクスポートを許可
    'import/no-named-default': 'error', // デフォルトエクスポートを名前付きでインポートすることを禁止
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
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/await-thenable': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/prefer-nullish-coalescing': 'off',
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'off',
        '@typescript-eslint/prefer-as-const': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },

    // TypeScriptファイル共通設定（.ts と .tsx の両方に適用）
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser', // TypeScript用パーサーを使用
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname, // tsconfig.jsonの基準ディレクトリを設定
        ecmaVersion: 2022, // ECMAScript 2022の構文を許可
        sourceType: 'module', // ES Modulesを使用
        ecmaFeatures: {
          jsx: true, // JSX構文を有効化
        },
      },
      plugins: ['@typescript-eslint', 'import'], // TypeScript用プラグインを有効化
      rules: {
        // より厳密なTypeScriptルール
        '@typescript-eslint/no-unused-vars': [
          // 未使用変数をエラーとして検出
          'error',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }, // アンダースコアで始まる変数は除外
        ],
        '@typescript-eslint/no-floating-promises': 'error', // awaitされていないPromiseを検出（async忘れ防止）
        '@typescript-eslint/await-thenable': 'error', // Promise以外にawaitを使用することを禁止
        '@typescript-eslint/no-misused-promises': 'error', // Promiseの誤用を防止（条件式での使用等）
        '@typescript-eslint/prefer-nullish-coalescing': 'error', // || の代わりに ?? の使用を推奨
        '@typescript-eslint/prefer-optional-chain': 'error', // && による連鎖の代わりに ?. の使用を推奨
        '@typescript-eslint/no-unnecessary-condition': 'warn', // 型チェックで自明な条件式を警告
        '@typescript-eslint/prefer-as-const': 'error', // リテラル型を保持するため as const の使用を推奨
        '@typescript-eslint/ban-ts-comment': [
          // TypeScriptコメントディレクティブの使用を制限
          'error',
          {
            'ts-expect-error': 'allow-with-description', // 説明付きなら @ts-expect-error を許可
            'ts-ignore': 'allow-with-description', // 説明付きなら @ts-ignore を許可
            'ts-nocheck': true, // @ts-nocheck を禁止
            'ts-check': false, // @ts-check は許可
            minimumDescriptionLength: 10, // 説明文の最小文字数を設定
          },
        ],

        // 高度なTypeScriptルール（段階的導入推奨）
        '@typescript-eslint/no-explicit-any': 'error', // any型の使用を禁止（型安全性向上）
        '@typescript-eslint/no-non-null-assertion': 'error', // ! 演算子の使用を禁止（null安全性向上）
        '@typescript-eslint/prefer-readonly': 'error', // 変更されないプロパティにreadonlyを推奨
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'], // interfaceの代わりにtypeの使用を強制

        // 命名規則
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable', // 変数の命名規則
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'], // キャメルケース、大文字、パスカルケースを許可
            leadingUnderscore: 'allow', // 先頭アンダースコアを許可
            trailingUnderscore: 'allow', // 末尾アンダースコアを許可
          },
          {
            selector: 'function', // 関数の命名規則
            format: ['camelCase', 'PascalCase'], // キャメルケース、パスカルケースを許可
            leadingUnderscore: 'forbid', // 先頭アンダースコアを禁止
          },
          {
            selector: 'typeLike', // 型の命名規則
            format: ['PascalCase'], // パスカルケースを強制
          },
          {
            selector: 'variable', // boolean変数の命名規則
            types: ['boolean'],
            format: ['camelCase'], // キャメルケースを強制
          },
          {
            selector: 'parameter', // booleanパラメータの命名規則
            types: ['boolean'],
            format: ['camelCase'], // キャメルケースを強制
            leadingUnderscore: 'allow', // 先頭アンダースコアを許可
          },
        ],
      },
    },

    // TypeScriptファイル（.ts）専用設定 - 戻り値型必須
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'error', // 関数の戻り値型の明示を必須
      },
    },

    // TypeScript + Reactファイル（.tsx）専用設定 - 戻り値型不要
    {
      files: ['**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off', // Reactコンポーネントでは戻り値型の明示を不要
      },
    },

    // React関連ルール
    {
      files: ['**/*.tsx', '**/*.jsx'],
      plugins: ['react', 'react-hooks'], // React用プラグインを有効化
      settings: {
        react: {
          version: 'detect', // Reactバージョンを自動検出（警告解消）
        },
      },
      rules: {
        'react-hooks/rules-of-hooks': 'error', // Hooksのルールに違反した使用を禁止
        'react-hooks/exhaustive-deps': 'warn', // useEffectの依存配列の不備を警告
        'react/prefer-stateless-function': 'error', // ステートレスコンポーネントの使用を推奨
        'react/jsx-no-useless-fragment': 'error', // 不要なReact.Fragmentの使用を禁止
        'react/no-array-index-key': 'error', // 配列インデックスをkeyとして使用することを禁止
        'react/function-component-definition': [
          // 関数コンポーネントの定義方法を統一
          'error',
          { namedComponents: 'function-declaration' }, // 名前付きコンポーネントは関数宣言を強制
        ],
      },
    },

    // データベースシードファイル用の設定 - console.logを許可
    {
      files: ['src/db/seed.ts'],
      rules: {
        'no-console': 'off', // シード処理では進行状況のログ出力を許可
      },
    },

    // デフォルトエクスポートを許可する例外ファイル
    {
      files: [
        // Next.jsのページファイル
        '**/app/**/page.{tsx}',
        '**/app/**/layout.{tsx}',
        '**/app/**/loading.{tsx}',
        '**/app/**/error.{tsx}',
        '**/app/**/not-found.{tsx}',
        '**/pages/**/*.{tsx}',
        // その他コンポーネントファイル
        '**/*.tsx',
        // Storybookのストーリーファイル
        '**/*.stories.{ts,tsx}',
      ],
      rules: {
        'import/no-default-export': 'off', // デフォルトエクスポートの禁止を解除
        'import/prefer-default-export': 'error', // デフォルトエクスポートの使用を推奨
      },
    },
  ],
};
