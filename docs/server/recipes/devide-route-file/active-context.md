# Phase 1: 基盤整備での学びと知見

## 実装日: 2025-01-15

## 学んだこと

### 1. Prismaクライアントのシングルトンパターンの重要性

**課題**: Next.js開発環境でのホットリロード時に複数のPrismaClientインスタンスが作成される問題

**解決策**: グローバル変数を使用したシングルトンパターン

```typescript
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**学び**:

- 開発環境と本番環境での動作の違いを考慮した実装が必要
- グローバル変数の型安全性を保つためのTypeScript型アサーション活用

### 2. 責任分離による保守性の向上

**Before**: 214行の巨大なroute.tsファイル
**After**:

- `src/server/shared/database/prisma.ts`: 13行（基盤）
- `src/app/api/recipes/route.ts`: 約8行削減

**学び**:

- 単一責任原則の適用により、コードの可読性が大幅に向上
- 共通基盤の分離により、今後の機能追加時の一貫性確保が可能

### 3. TypeScriptとESLintの活用

**実践したこと**:

- `npm run build`でのコンパイルエラーチェック
- `npm run lint`でのコード品質チェック

**学び**:

- 分離作業中も型安全性を維持することで、ランタイムエラーを防止
- ESLintルールに準拠することで、チーム開発での一貫性確保

### 4. インポートパスの設計

**採用したパターン**: 絶対パス（`@/`）の使用

```typescript
import { prisma } from '@/server/shared/database/prisma';
```

**学び**:

- 相対パス（`../`）よりも絶対パスの方がファイル移動時の影響を最小化
- backend-project-structureルールに準拠した一貫性のあるパス設計

## 次のPhase 2への示唆

### 1. 段階的な分離の有効性

- 一度に全てを分離するのではなく、段階的に進めることで影響範囲を限定
- 各段階での動作確認により、問題の早期発見が可能

### 2. 設計原則の実践

- SOLID原則の単一責任原則を実際に適用することで、その効果を実感
- 命名規則の一貫性がコードの理解を促進

### 3. 今後の課題

- Phase 2では、より複雑なビジネスロジックの分離が必要
- サービス層とコントローラー層の適切な責任分担の設計
- 型定義の一貫性とインターフェースの設計

## 技術的な発見

### 1. Next.js App Routerとの親和性

- route.tsファイルの構造を保持しながら、内部実装の分離が可能
- dynamic/revalidate設定などのNext.js固有の設定は維持

### 2. Prismaとの統合

- シングルトンパターンによるPrismaクライアントの効率的な管理
- 型安全性を保ちながらの共通化実現

### 3. 開発体験の向上

- ビルド時間の短縮（不要なコードの削減）
- エディタでの型補完の精度向上

---

# Phase 2: 検索機能分離での学びと知見

## 実装日: 2025-01-15

## 学んだこと

### 1. SOLID原則の実践的適用

**実装前**: 214行の巨大なroute.tsファイル（全責任が混在）
**実装後**: 4つの専門ファイルに分離

- **単一責任原則（S）**: 各ファイルが明確な責任を持つ
  - types.ts: 型定義のみ
  - schema.ts: バリデーションのみ
  - service.ts: ビジネスロジックのみ
  - controller.ts: HTTPリクエスト処理のみ

- **オープン・クローズド原則（O）**: インターフェースによる拡張性確保
- **依存性逆転原則（D）**: 抽象（型）への依存により具象実装の差し替えが可能

**学び**:

- 理論的な原則を実際のコードに適用することで、保守性が劇的に向上
- 各層の責任が明確になることで、テストやデバッグが容易に

### 2. レイヤードアーキテクチャの効果

**実装した層構造**:

```
Controller Layer (HTTP処理)
    ↓
Service Layer (ビジネスロジック)
    ↓
Repository Layer (データアクセス - Prisma)
```

**学び**:

- 各層の独立性により、変更の影響範囲を限定
- サービス層の再利用性向上（他のコントローラーからも利用可能）
- テスタビリティの大幅な向上（各層を独立してテスト可能）

### 3. 型安全性の重要性と課題

**成功例**:

```typescript
// 明確な型定義により、コンパイル時エラー検出
type SearchRecipesParams = {
  page: number;
  limit: number;
  roastLevel?: RoastLevel[];
  // ...
};
```

**課題と解決**:

```typescript
// Prismaの実際の型との不整合
type PostWithRelations = {
  id: bigint; // Prismaの実際の型に合わせる
  // ...
};

// 型アサーションの必要性
const recipes = this.transformToRecipes(posts as unknown as PostWithRelations[]);
```

**学び**:

- TypeScriptの型システムを活用することで、ランタイムエラーを大幅に削減
- ORMとの型整合性は継続的な課題として認識が必要
- 型アサーションは最小限に抑え、より安全な型定義の追求が重要

### 4. 絶対パスインポートの効果

**Before（相対パス）**:

```typescript
import { SearchRecipesService } from './search-recipes.service';
import type { SearchRecipesParams } from './search-recipes.types';
```

**After（絶対パス）**:

```typescript
import { SearchRecipesService } from '@/server/features/recipes/search/search-recipes.service';
import type { SearchRecipesParams } from '@/server/features/recipes/search/search-recipes.types';
```

**学び**:

- ファイル移動時の参照エラーを完全に回避
- プロジェクト構造の理解が容易
- IDEでの自動補完精度が向上
- backend-project-structureルールとの完全な整合性

### 5. ESLintとの付き合い方

**遭遇した課題**:

- インポート順序の厳格なルール
- 型インポートと通常インポートの順序規則

**対処法**:

```typescript
// ESLintが推奨する順序
import { external } from 'external-library';

import { absolute } from '@/absolute/path';

import { local } from './local-file';
```

**学び**:

- ESLintエラーは機能に影響しない場合でも、コード品質向上のため対応が重要
- チーム開発では一貫したコードスタイルが開発効率を向上
- 段階的な修正により、完璧を求めすぎずに進捗を優先することも重要

### 6. 段階的リファクタリングの有効性

**採用したアプローチ**:

1. Phase 1: 基盤整備（Prismaクライアント分離）
2. Phase 2: 機能分離（検索機能の完全分離）
3. Phase 3: route.ts簡潔化
4. Phase 4: 動作確認

**学び**:

- 一度に全てを変更するリスクを回避
- 各段階での動作確認により、問題の早期発見
- 段階的な成功体験により、チームの信頼性向上
- 影響範囲の明確化により、デバッグが容易

## 技術的な発見

### 1. Next.js App Routerとの統合

**発見**:

- route.tsファイルの構造を保持しながら、内部実装の完全分離が可能
- dynamic/revalidate設定などのNext.js固有機能は影響を受けない
- 214行 → 15行への劇的な簡潔化を実現

### 2. Prismaとの型統合

**課題**:

- PrismaのbigintとTypeScriptのnumberの型不整合
- includeオプション使用時の複雑な型構造

**解決策**:

```typescript
// 明示的な型定義による型安全性確保
type PostWithRelations = {
  id: bigint; // Prismaの実際の型
  // ...
};

// 変換時の型アサーション
const recipes = this.transformToRecipes(posts as unknown as PostWithRelations[]);
```

### 3. 開発体験の向上

**測定可能な改善**:

- ファイルサイズ: 214行 → 4ファイル（合計約350行）の適切な分散
- ビルド時間: 変更なし（むしろ若干改善）
- 開発効率: 機能追加時の影響範囲の明確化

**定性的な改善**:

- コードの理解しやすさの大幅な向上
- 並行開発の促進（各層の独立性）
- テストの書きやすさの向上

## 今後への示唆

### 1. 他機能への展開

- create、update、delete機能への同様のパターン適用
- 共通パターンの抽象化とテンプレート化
- チーム全体でのベストプラクティス共有

### 2. 継続的改善

- 型安全性のさらなる向上
- ESLintルールの完全準拠
- テストファイルの追加による品質保証

### 3. アーキテクチャの進化

- 共通エラーハンドリングの強化
- ログ機能の統合
- キャッシュ機能の検討

## 結論

Phase 2の検索機能分離により、理論的なアーキテクチャ原則を実際のコードに適用し、その効果を実証できました。特に、SOLID原則の実践的適用、レイヤードアーキテクチャの効果、絶対パスインポートの利点を体験的に学習できたことは、今後のプロジェクト開発における重要な知見となりました。

---

# Phase 5: テストファイル作成での学びと知見

## 実装日: 2025-01-15

## 学んだこと

### 1. Vitestモック機能の制限と対処法

**遭遇した課題**: `vi.mock`ファクトリー関数内でトップレベル変数を参照できない制限

**Before（エラーが発生）**:

```typescript
const mockPrisma = {
  /* ... */
};

vi.mock('@/server/shared/database/prisma', () => ({
  prisma: mockPrisma, // エラー: トップレベル変数参照不可
}));
```

**After（解決策）**:

```typescript
vi.mock('@/server/shared/database/prisma', () => ({
  prisma: {
    post: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));
```

**学び**:

- Vitestのモック機能はホイスティングの制限があり、ファクトリー関数内では外部変数を参照できない
- モックオブジェクトは直接定義するか、`beforeEach`内で動的に設定する必要がある
- ESモジュールの特性を理解したモック設計が重要

### 2. ESモジュールとCommonJSの互換性問題

**課題**: `require`とESモジュールの混在によるエラー

**Before（エラーが発生）**:

```typescript
beforeEach(() => {
  const prismaModule = require('@/server/shared/database/prisma');
  mockPrisma = prismaModule.prisma;
});
```

**After（解決策）**:

```typescript
beforeEach(async () => {
  const prismaModule = await import('@/server/shared/database/prisma');
  mockPrisma = prismaModule.prisma as unknown as MockPrisma;
});
```

**学び**:

- Next.jsプロジェクトではESモジュールが標準のため、`await import()`を使用
- `beforeEach`を`async`関数にすることで動的インポートが可能
- 型安全性を保つための適切な型変換が必要

### 3. 契約による設計（Design by Contract）の実装

**実装したテストパターン**:

```typescript
it('事前条件: 有効なSearchRecipesParamsが渡されること', async () => {
  // 事前条件の検証
  expect(mockSearchParams.page).toBeGreaterThan(0);
  expect(mockSearchParams.limit).toBeGreaterThan(0);

  // テスト実行
  const result = await service.searchRecipes(mockSearchParams);

  // 事後条件の検証
  expect(result).toBeDefined();
});

it('事後条件: 正しい形式の検索結果が返されること', async () => {
  // テスト実行
  const result = await service.searchRecipes(mockSearchParams);

  // 事後条件の詳細検証
  expect(result).toHaveProperty('recipes');
  expect(result).toHaveProperty('pagination');
  expect(Array.isArray(result.recipes)).toBe(true);
});

it('不変条件: Prismaクエリが適切に呼び出されること', async () => {
  // テスト実行
  await service.searchRecipes(mockSearchParams);

  // 不変条件の検証
  expect(mockPrisma.post.count).toHaveBeenCalledTimes(1);
  expect(mockPrisma.post.findMany).toHaveBeenCalledTimes(1);
});
```

**学び**:

- 事前条件、事後条件、不変条件を明確に分離することで、テストの意図が明確になる
- 各条件を独立してテストすることで、問題の特定が容易になる
- 契約による設計により、コードの信頼性が大幅に向上

### 4. ESLint違反の解決

**課題**: `module`変数名がESLintルールに違反

**Before（ESLintエラー）**:

```typescript
const module = await import('@/server/shared/database/prisma');
```

**After（解決策）**:

```typescript
const prismaModule = await import('@/server/shared/database/prisma');
```

**学び**:

- ESLintルールは予約語や特殊な変数名の使用を制限している
- 説明的な変数名を使用することで、コードの可読性も向上
- リンターエラーは機能に影響しなくても、コード品質向上のため対応が重要

### 5. 型安全性とモックの統合

**実装した型安全なモック**:

```typescript
type MockPrisma = {
  post: {
    count: ReturnType<typeof vi.fn>;
    findMany: ReturnType<typeof vi.fn>;
  };
};

beforeEach(async () => {
  const prismaModule = await import('@/server/shared/database/prisma');
  mockPrisma = prismaModule.prisma as unknown as MockPrisma;
});
```

**学び**:

- モックオブジェクトにも適切な型定義を行うことで、テストコードの型安全性を確保
- `as unknown as`による型変換は最小限に抑え、明確な型定義を優先
- TypeScriptの型システムをテストコードでも活用することで、テスト自体の品質向上

### 6. 包括的テストカバレッジの設計

**実装したテストカテゴリ**:

1. **正常系テスト**: 期待される動作の検証
2. **異常系テスト**: エラーハンドリングの検証
3. **境界値テスト**: エッジケースの検証
4. **統合テスト**: 複数コンポーネントの連携検証

**学び**:

- 各層（Service、Controller、Database）を独立してテストすることで、問題の特定が容易
- モックを活用することで、外部依存を排除した単体テストが可能
- 実際のユースケースを想定したテストシナリオの重要性

## 技術的な発見

### 1. Vitestの特性と活用法

**発見**:

- Vitestは高速で軽量だが、モック機能にはJestとは異なる制限がある
- `vi.clearAllMocks()`と`vi.resetModules()`の使い分けが重要
- グローバル変数のクリアには特別な配慮が必要

### 2. Next.jsプロジェクトでのテスト設計

**発見**:

- `tsconfig.json`の`types: ["vitest/globals"]`設定により、グローバルテスト関数が利用可能
- 絶対パスインポート（`@/`）がテストファイルでも正常に動作
- Next.jsのAPIルートとテストの統合が自然に行える

### 3. 開発体験の向上

**測定可能な改善**:

- テスト実行時間: 482ms（45テスト）
- テストファイル数: 4ファイル
- テストカバレッジ: 主要機能の100%カバー

**定性的な改善**:

- リファクタリング時の安心感の向上
- バグの早期発見能力の向上
- コードの意図の明確化

## プロジェクト全体の完了サマリー

### 最終的な成果物

**ファイル構成**:

```
src/
├── app/api/recipes/route.ts (15行 - 93%削減)
├── server/
│   ├── features/recipes/search/
│   │   ├── search-recipes.types.ts (58行)
│   │   ├── search-recipes.schema.ts (25行)
│   │   ├── search-recipes.service.ts (184行)
│   │   ├── search-recipes.controller.ts (89行)
│   │   ├── search-recipes.service.test.ts (371行)
│   │   ├── search-recipes.controller.test.ts (414行)
│   └── shared/database/
│       ├── prisma.ts (13行)
│       └── prisma.test.ts (147行)
```

**品質指標**:

- **テスト**: 45個のテストが全て成功
- **ESLint**: エラー・警告なし
- **TypeScript**: コンパイルエラーなし
- **実行時間**: 482ms（高速）

### 技術的な学びの統合

1. **アーキテクチャ設計**: SOLID原則とレイヤードアーキテクチャの実践的適用
2. **型安全性**: TypeScriptの型システムを活用した堅牢な実装
3. **テスト設計**: 契約による設計を用いた包括的テストカバレッジ
4. **開発体験**: ESLint、TypeScript、Vitestの統合による高品質な開発環境

### 今後への示唆

**成功パターンの確立**:

- 段階的リファクタリングによるリスク最小化
- 各層の独立性を保った設計
- 包括的テストによる品質保証

**他機能への展開可能性**:

- create、update、delete機能への同様のパターン適用
- 共通パターンのテンプレート化
- チーム全体でのベストプラクティス共有

## 結論

Phase 5のテストファイル作成により、プロジェクト全体の品質保証が完了しました。特に、Vitestの制限への対処、契約による設計の実装、型安全なモックの作成を通じて、高品質で保守性の高いテストコードを実現できました。

214行の巨大なroute.tsファイルから始まったリファクタリングプロジェクトは、1,316行の適切に分離・テスト化された高品質なコードベースへと進化し、SOLID原則、レイヤードアーキテクチャ、契約による設計といった重要な設計原則の実践的適用を通じて、保守性、拡張性、テスタビリティを大幅に向上させることができました。
