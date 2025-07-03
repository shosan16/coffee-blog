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
    '.next/**',
    '.vercel/**',
    'coverage/**',
    '*.lock',
    'package-lock.json',
    'package.json',
    'src/shared/components/ui/**',
    'storybook-static/**',
    '.storybook/dist/**',
    '**/*.d.ts',
    '*.log',
    '.env*',
    'prisma/migrations/**',
  ],

  extends: [
    'next/core-web-vitals', // Next.js公式の推奨設定を適用
    // SonarJS推奨設定を追加（コード品質・複雑度・重複検出を強化）
    'plugin:sonarjs/recommended-legacy',
    // Prettierとの競合を解決（最後に配置することが重要）
    'prettier',
  ],

  // import resolverの設定を追加してnative bindingエラーを回避
  settings: {
    'import/resolver': {
      // TypeScript設定追加（型情報を考慮したimport解決）
      typescript: {
        alwaysTryTypes: true, // 型定義ファイルを常に探索
        project: './tsconfig.json', // TypeScript設定ファイルを指定
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },

  // 共通ルール - すべてのファイルに適用
  plugins: [
    'import', // importに関するルールを提供するプラグインを有効化
    // SonarJSプラグインを追加（コード品質向上・複雑度制御・重複検出）
    'sonarjs',
  ],
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

    // SonarJS ルール（基本的なコード品質・複雑度制御）
    'sonarjs/cognitive-complexity': ['error', 15], // 認知的複雑度を15以下に制限
    'sonarjs/max-switch-cases': ['error', 15], // switch文のcase数を15個以下に制限
    'sonarjs/no-duplicate-string': ['error', { threshold: 5 }], // マジックストリング対策
    'sonarjs/no-identical-functions': 'error', // DRY原則の強制
    'sonarjs/no-duplicated-branches': 'error', // 論理的整合性の保持
    'sonarjs/prefer-immediate-return': 'warn', // 直接returnの推奨

    // 不要・過度に厳格なSonarJSルールを無効化
    'sonarjs/concise-regex': 'off', // 正規表現の短縮記法強制（可読性を損なう場合がある）
    'sonarjs/no-nested-functions': 'off', // ネスト関数制限（テストやコールバックで有用）
    'sonarjs/no-useless-catch': 'off', // catch句の強制（ログ出力等で有用）
    'sonarjs/no-selector-parameter': 'off', // boolean引数の制限（React状態管理で一般的）
    'sonarjs/no-nested-conditional': 'off', // ネスト三項演算子の制限（条件式の簡潔性を損なう）
    'sonarjs/no-invariant-returns': 'off', // 常に同一戻り値の制限（定数関数で有用）
    'sonarjs/no-hardcoded-passwords': 'off', // ハードコードパスワード検出（開発・テスト環境で必要）
    'sonarjs/deprecation': 'warn', // 非推奨API使用を警告に変更
    'sonarjs/pseudo-random': 'off', // 疑似乱数使用の制限（ログID生成等で安全）
    'sonarjs/redundant-type-aliases': 'off', // 冗長型エイリアス制限（ドメインモデリングで有用）
    // Import ルール（結合度制御・依存関係管理）
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js組み込みモジュール
          'external', // node_modulesからのimport
          'internal', // プロジェクト内の絶対パス
          'parent', // 親ディレクトリからの相対パス
          'sibling', // 同一ディレクトリからの相対パス
          'index', // index.jsファイル
        ],
        'newlines-between': 'always', // グループ間に空行を強制
        alphabetize: {
          order: 'asc', // アルファベット順でソート
          caseInsensitive: true, // 大文字小文字を区別しない
        },
      },
    ],
    'import/no-cycle': 'error', // 循環依存を禁止（アーキテクチャの健全性保持）
    'import/max-dependencies': ['warn', { max: 20 }], // 依存過多を警告（結合度制御・複雑性管理）
    'import/no-self-import': 'error', // 自己インポートを禁止（論理的エラー防止）
    'import/no-relative-packages': 'off', // 一旦無効（プロジェクト構造を考慮）

    // DRY原則
    'no-duplicate-imports': 'error', // 同じモジュールの重複importを禁止
    'import/no-duplicates': 'error', // SonarJSと併用で重複検出強化（保守性向上）

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
        // SonarJSルールもJavaScriptファイルでは調整（型情報がないため緩く設定）
        'sonarjs/cognitive-complexity': ['warn', 20], // JSファイルは少し緩く（型情報による最適化がないため）
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
      plugins: [
        '@typescript-eslint', // TypeScript用プラグインを有効化
        'import',
        // TypeScriptファイルでもSonarJSを適用（型情報を活用した高度な検出）
        'sonarjs',
      ],
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

        // 最新TypeScript ESLintルール（型安全性強化）
        '@typescript-eslint/consistent-type-exports': 'error', // 型のエクスポートを統一
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
        ], // 型インポートの統一
        '@typescript-eslint/no-import-type-side-effects': 'error', // 型インポートの副作用を防止
        '@typescript-eslint/no-redundant-type-constituents': 'error', // 冗長な型の組み合わせを検出
        '@typescript-eslint/no-unsafe-unary-minus': 'error', // 安全でない単項マイナス演算子を禁止
        '@typescript-eslint/prefer-find': 'error', // filter(...)[0]よりもfind()を推奨
        '@typescript-eslint/prefer-includes': 'error', // indexOf() !== -1よりもincludes()を推奨
        '@typescript-eslint/prefer-string-starts-ends-with': 'error', // 文字列の開始・終了チェックの最適化

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

        // TypeScriptファイルでのSonarJS（基本ルールのみ適用）
        'sonarjs/cognitive-complexity': ['warn', 15], // TypeScriptでも適切な複雑度制限を適用
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
        // Reactコンポーネント特有のSonarJSルール調整
        'sonarjs/cognitive-complexity': ['warn', 15], // Reactコンポーネントでも適切な複雑度制限を維持
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
        // クラスコンポーネントのrenderメソッドの戻り値型注釈を不要とする
        'sonarjs/function-return-type': 'off',
        // Reactコンポーネントのpropsは読み取り専用である必要がない
        'sonarjs/prefer-read-only-props': 'off',
        // TODOコメントの使用を許可
        'sonarjs/todo-tag': 'off',
        // React関数コンポーネントでは早期returnパターンが一般的なため無効化
        'sonarjs/prefer-immediate-return': 'off',
      },
    },

    // データベースシードファイル用の設定 - console.logを許可
    {
      files: ['src/db/seed.ts'],
      rules: {
        'no-console': 'off', // シード処理では進行状況のログ出力を許可
        // シードファイルではSonarJSを緩く設定（バッチ処理の特性を考慮）
        'sonarjs/cognitive-complexity': 'off', // シード処理は複雑になりがちなため無効
        'sonarjs/no-duplicate-string': 'off', // SQLクエリ等で文字列重複が発生しがちなため無効
      },
    },

    // 設定ファイル専用（複雑度チェック緩和・設定の自由度確保）
    {
      files: [
        '**/*.config.{js,ts}', // 各種設定ファイル
        '**/tailwind.config.{js,ts}', // Tailwind CSS設定
        '**/next.config.{js,ts}', // Next.js設定
        '**/.eslintrc.{js,ts}', // ESLint設定
      ],
      rules: {
        'sonarjs/cognitive-complexity': 'off', // 設定ファイルは複雑になりがちなため無効
        'sonarjs/no-duplicate-string': 'off', // 設定値で文字列重複が発生しがちなため無効
        'import/no-default-export': 'off', // 設定ファイルはデフォルトエクスポートが一般的なため許可
      },
    },

    // テストファイル専用設定
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      rules: {
        // テストファイルでは複雑度制限を緩和
        'sonarjs/cognitive-complexity': 'off',
        // テストデータで文字列重複が発生しがちなため無効
        'sonarjs/no-duplicate-string': 'off',
        // テスト関数では同一のアサーション関数が使われるため無効
        'sonarjs/no-identical-functions': 'off',
        // モックオブジェクトで重複プロパティが発生するため無効
        'sonarjs/no-duplicated-branches': 'off',
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
