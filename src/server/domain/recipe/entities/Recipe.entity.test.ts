import { describe, it, expect, beforeEach } from 'vitest';
import { ZodError } from 'zod';

import { BrewingConditions } from '../value-objects/BrewingConditions';
import { RecipeId } from '../value-objects/RecipeId';

import { Recipe, type RecipeStep } from './Recipe.entity';

describe('Recipe Entity', () => {
  // テスト用の共通データ
  let testRecipeId: RecipeId;
  let testBrewingConditions: BrewingConditions;

  beforeEach(() => {
    // Arrange - 各テストで使用する共通データを準備
    testRecipeId = RecipeId.fromString('1');
    testBrewingConditions = BrewingConditions.create({
      roastLevel: 'MEDIUM',
      grindSize: 'MEDIUM',
      beanWeight: 20,
      waterAmount: 300,
      waterTemp: 90,
      brewingTime: 240,
    });
  });

  describe('create()', () => {
    describe('正常系', () => {
      it('有効なパラメータでレシピを作成できること', () => {
        // Arrange - レシピ作成パラメータを準備
        const params = {
          id: testRecipeId,
          title: 'テストレシピ',
          summary: 'テスト用の概要',
          remarks: 'テスト用の備考',
          brewingConditions: testBrewingConditions,
          baristaId: 'barista-1',
        };

        // Act - レシピを作成
        const recipe = Recipe.create(params);

        // Assert - 作成されたレシピの状態を確認
        expect(recipe.id.equals(testRecipeId)).toBe(true);
        expect(recipe.title).toBe('テストレシピ');
        expect(recipe.summary).toBe('テスト用の概要');
        expect(recipe.remarks).toBe('テスト用の備考');
        expect(recipe.brewingConditions.equals(testBrewingConditions)).toBe(true);
        expect(recipe.baristaId).toBe('barista-1');
        expect(recipe.viewCount).toBe(0);
        expect(recipe.isPublished).toBe(false);
        expect(recipe.publishedAt).toBeUndefined();
        expect(recipe.steps).toHaveLength(0);
        expect(recipe.equipmentIds).toHaveLength(0);
        expect(recipe.tagIds).toHaveLength(0);
      });

      it('オプションパラメータを省略してレシピを作成できること', () => {
        // Arrange - 最小限のパラメータを準備
        const params = {
          id: testRecipeId,
          title: '最小レシピ',
          brewingConditions: testBrewingConditions,
        };

        // Act - レシピを作成
        const recipe = Recipe.create(params);

        // Assert - 作成されたレシピの状態を確認
        expect(recipe.id.equals(testRecipeId)).toBe(true);
        expect(recipe.title).toBe('最小レシピ');
        expect(recipe.summary).toBeUndefined();
        expect(recipe.remarks).toBeUndefined();
        expect(recipe.baristaId).toBeUndefined();
      });
    });

    describe('異常系', () => {
      it('空のタイトルでエラーが発生すること', () => {
        // Arrange - 無効なタイトルを持つパラメータを準備
        const params = {
          id: testRecipeId,
          title: '',
          brewingConditions: testBrewingConditions,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Recipe.create(params)).toThrow(ZodError);
      });

      it('長すぎるタイトルでエラーが発生すること', () => {
        // Arrange - 201文字のタイトルを準備
        const longTitle = 'a'.repeat(201);
        const params = {
          id: testRecipeId,
          title: longTitle,
          brewingConditions: testBrewingConditions,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Recipe.create(params)).toThrow(ZodError);
      });

      it('長すぎる概要でエラーが発生すること', () => {
        // Arrange - 501文字の概要を準備
        const longSummary = 'a'.repeat(501);
        const params = {
          id: testRecipeId,
          title: 'テストレシピ',
          summary: longSummary,
          brewingConditions: testBrewingConditions,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Recipe.create(params)).toThrow(ZodError);
      });

      it('長すぎる備考でエラーが発生すること', () => {
        // Arrange - 1001文字の備考を準備
        const longRemarks = 'a'.repeat(1001);
        const params = {
          id: testRecipeId,
          title: 'テストレシピ',
          remarks: longRemarks,
          brewingConditions: testBrewingConditions,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Recipe.create(params)).toThrow(ZodError);
      });
    });
  });

  describe('reconstruct()', () => {
    it('既存データからレシピを再構築できること', () => {
      // Arrange - 再構築用のデータを準備
      const data = {
        id: testRecipeId,
        title: '再構築レシピ',
        summary: '再構築用の概要',
        remarks: '再構築用の備考',
        brewingConditions: testBrewingConditions,
        viewCount: 100,
        isPublished: true,
        publishedAt: new Date('2025-01-01'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2025-01-01'),
        baristaId: 'barista-1',
        steps: [
          {
            stepOrder: 1,
            description: 'ステップ1',
            timeSeconds: 30,
          },
        ] as RecipeStep[],
        equipmentIds: ['equipment-1'],
        tagIds: ['tag-1'],
      };

      // Act - レシピを再構築
      const recipe = Recipe.reconstruct(data);

      // Assert - 再構築されたレシピの状態を確認
      expect(recipe.id.equals(testRecipeId)).toBe(true);
      expect(recipe.title).toBe('再構築レシピ');
      expect(recipe.summary).toBe('再構築用の概要');
      expect(recipe.remarks).toBe('再構築用の備考');
      expect(recipe.viewCount).toBe(100);
      expect(recipe.isPublished).toBe(true);
      expect(recipe.publishedAt).toEqual(new Date('2025-01-01'));
      expect(recipe.createdAt).toEqual(new Date('2024-12-01'));
      expect(recipe.updatedAt).toEqual(new Date('2025-01-01'));
      expect(recipe.baristaId).toBe('barista-1');
      expect(recipe.steps).toHaveLength(1);
      expect(recipe.equipmentIds).toHaveLength(1);
      expect(recipe.tagIds).toHaveLength(1);
    });
  });

  describe('publish()', () => {
    describe('正常系', () => {
      it('ステップが設定されたレシピを公開できること', () => {
        // Arrange - レシピを作成しステップを設定
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '公開テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const steps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: 'お湯を沸かす',
            timeSeconds: 60,
          },
        ];
        recipe.setSteps(steps);

        // Act - レシピを公開
        recipe.publish();

        // Assert - 公開状態になることを確認
        expect(recipe.isPublished).toBe(true);
        expect(recipe.publishedAt).toBeInstanceOf(Date);
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });
    });

    describe('異常系', () => {
      it('既に公開済みのレシピでエラーが発生すること', () => {
        // Arrange - 公開済みレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '公開済みレシピ',
          brewingConditions: testBrewingConditions,
        });

        const steps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: 'ステップ1',
          },
        ];
        recipe.setSteps(steps);
        recipe.publish();

        // Act & Assert - 重複公開でエラーが発生することを確認
        expect(() => recipe.publish()).toThrow('Recipe is already published');
      });

      it('ステップが設定されていないレシピでエラーが発生すること', () => {
        // Arrange - ステップなしのレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'ステップなしレシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - ステップなしで公開でエラーが発生することを確認
        expect(() => recipe.publish()).toThrow('Cannot publish recipe without steps');
      });
    });
  });

  describe('unpublish()', () => {
    describe('正常系', () => {
      it('公開中のレシピを非公開にできること', () => {
        // Arrange - 公開済みレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '非公開テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const steps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: 'ステップ1',
          },
        ];
        recipe.setSteps(steps);
        recipe.publish();

        // Act - レシピを非公開にする
        recipe.unpublish();

        // Assert - 非公開状態になることを確認
        expect(recipe.isPublished).toBe(false);
        expect(recipe.publishedAt).toBeUndefined();
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });
    });

    describe('異常系', () => {
      it('既に非公開のレシピでエラーが発生すること', () => {
        // Arrange - 非公開レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '非公開レシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 重複非公開でエラーが発生することを確認
        expect(() => recipe.unpublish()).toThrow('Recipe is already unpublished');
      });
    });
  });

  describe('equals()', () => {
    it('同じIDのレシピは等価であること', () => {
      // Arrange - 同じIDの2つのレシピを準備
      const recipe1 = Recipe.create({
        id: testRecipeId,
        title: 'レシピ1',
        brewingConditions: testBrewingConditions,
      });

      const recipe2 = Recipe.create({
        id: testRecipeId,
        title: 'レシピ2', // 異なるタイトルでもIDが同じなら等価
        brewingConditions: testBrewingConditions,
      });

      // Act & Assert - 等価であることを確認
      expect(recipe1.equals(recipe2)).toBe(true);
    });

    it('異なるIDのレシピは等価でないこと', () => {
      // Arrange - 異なるIDの2つのレシピを準備
      const recipe1 = Recipe.create({
        id: testRecipeId,
        title: 'レシピ1',
        brewingConditions: testBrewingConditions,
      });

      const recipe2 = Recipe.create({
        id: RecipeId.fromString('2'),
        title: 'レシピ2',
        brewingConditions: testBrewingConditions,
      });

      // Act & Assert - 等価でないことを確認
      expect(recipe1.equals(recipe2)).toBe(false);
    });
  });

  describe('updateTitle()', () => {
    describe('正常系', () => {
      it('有効なタイトルで更新できること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '元のタイトル',
          brewingConditions: testBrewingConditions,
        });

        // Act - タイトルを更新
        recipe.updateTitle('新しいタイトル');

        // Assert - タイトルが更新され、更新日時も変更されることを確認
        expect(recipe.title).toBe('新しいタイトル');
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });

      it('前後の空白が除去されること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '元のタイトル',
          brewingConditions: testBrewingConditions,
        });

        // Act - 前後に空白があるタイトルで更新
        recipe.updateTitle('  空白付きタイトル  ');

        // Assert - 空白が除去されることを確認
        expect(recipe.title).toBe('空白付きタイトル');
      });
    });

    describe('異常系', () => {
      it('空のタイトルでエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '元のタイトル',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 空タイトルでエラーが発生することを確認
        expect(() => recipe.updateTitle('')).toThrow(ZodError);
      });

      it('長すぎるタイトルでエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '元のタイトル',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 201文字のタイトルでエラーが発生することを確認
        const longTitle = 'a'.repeat(201);
        expect(() => recipe.updateTitle(longTitle)).toThrow(ZodError);
      });

      it('空白のみのタイトルでエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: '元のタイトル',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 空白のみでエラーが発生することを確認
        expect(() => recipe.updateTitle('   ')).toThrow(ZodError);
      });
    });
  });

  describe('updateSummary()', () => {
    describe('正常系', () => {
      it('有効な概要で更新できること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          summary: '元の概要',
          brewingConditions: testBrewingConditions,
        });

        // Act - 概要を更新
        recipe.updateSummary('新しい概要');

        // Assert - 概要が更新され、更新日時も変更されることを確認
        expect(recipe.summary).toBe('新しい概要');
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });

      it('概要をundefinedで削除できること', () => {
        // Arrange - 概要があるレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          summary: '削除される概要',
          brewingConditions: testBrewingConditions,
        });

        // Act - 概要をundefinedで更新（削除）
        recipe.updateSummary();

        // Assert - 概要が削除されることを確認
        expect(recipe.summary).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act - 前後に空白がある概要で更新
        recipe.updateSummary('  空白付き概要  ');

        // Assert - 空白が除去されることを確認
        expect(recipe.summary).toBe('空白付き概要');
      });
    });

    describe('異常系', () => {
      it('長すぎる概要でエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 501文字の概要でエラーが発生することを確認
        const longSummary = 'a'.repeat(501);
        expect(() => recipe.updateSummary(longSummary)).toThrow(ZodError);
      });
    });
  });

  describe('updateRemarks()', () => {
    describe('正常系', () => {
      it('有効な備考で更新できること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          remarks: '元の備考',
          brewingConditions: testBrewingConditions,
        });

        // Act - 備考を更新
        recipe.updateRemarks('新しい備考');

        // Assert - 備考が更新され、更新日時も変更されることを確認
        expect(recipe.remarks).toBe('新しい備考');
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });

      it('備考をundefinedで削除できること', () => {
        // Arrange - 備考があるレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          remarks: '削除される備考',
          brewingConditions: testBrewingConditions,
        });

        // Act - 備考をundefinedで更新（削除）
        recipe.updateRemarks();

        // Assert - 備考が削除されることを確認
        expect(recipe.remarks).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act - 前後に空白がある備考で更新
        recipe.updateRemarks('  空白付き備考  ');

        // Assert - 空白が除去されることを確認
        expect(recipe.remarks).toBe('空白付き備考');
      });
    });

    describe('異常系', () => {
      it('長すぎる備考でエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'テストレシピ',
          brewingConditions: testBrewingConditions,
        });

        // Act & Assert - 1001文字の備考でエラーが発生することを確認
        const longRemarks = 'a'.repeat(1001);
        expect(() => recipe.updateRemarks(longRemarks)).toThrow(ZodError);
      });
    });
  });

  describe('setSteps()', () => {
    describe('正常系', () => {
      it('有効なステップ配列を設定できること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'ステップテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const steps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: 'お湯を沸かす',
            timeSeconds: 60,
          },
          {
            stepOrder: 2,
            description: 'コーヒーを挽く',
            timeSeconds: 30,
          },
          {
            stepOrder: 3,
            description: '抽出する',
          },
        ];

        // Act - ステップを設定
        recipe.setSteps(steps);

        // Assert - ステップが正しく設定され、更新日時も変更されることを確認
        expect(recipe.steps).toHaveLength(3);
        expect(recipe.steps[0].stepOrder).toBe(1);
        expect(recipe.steps[0].description).toBe('お湯を沸かす');
        expect(recipe.steps[0].timeSeconds).toBe(60);
        expect(recipe.steps[1].stepOrder).toBe(2);
        expect(recipe.steps[1].description).toBe('コーヒーを挽く');
        expect(recipe.steps[1].timeSeconds).toBe(30);
        expect(recipe.steps[2].stepOrder).toBe(3);
        expect(recipe.steps[2].description).toBe('抽出する');
        expect(recipe.steps[2].timeSeconds).toBeUndefined();
        expect(recipe.updatedAt).toBeInstanceOf(Date);
      });

      it('順序がバラバラでも正しくソートされること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'ソートテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const steps: RecipeStep[] = [
          {
            stepOrder: 3,
            description: '3番目',
          },
          {
            stepOrder: 1,
            description: '1番目',
          },
          {
            stepOrder: 2,
            description: '2番目',
          },
        ];

        // Act - 順序がバラバラのステップを設定
        recipe.setSteps(steps);

        // Assert - 正しい順序で設定されることを確認
        expect(recipe.steps).toHaveLength(3);
        expect(recipe.steps[0].stepOrder).toBe(1);
        expect(recipe.steps[0].description).toBe('1番目');
        expect(recipe.steps[1].stepOrder).toBe(2);
        expect(recipe.steps[1].description).toBe('2番目');
        expect(recipe.steps[2].stepOrder).toBe(3);
        expect(recipe.steps[2].description).toBe('3番目');
      });

      it('空のステップ配列を設定できること', () => {
        // Arrange - ステップがあるレシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'ステップクリアテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const initialSteps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: '削除されるステップ',
          },
        ];
        recipe.setSteps(initialSteps);

        // Act - 空のステップ配列を設定
        recipe.setSteps([]);

        // Assert - ステップがクリアされることを確認
        expect(recipe.steps).toHaveLength(0);
      });
    });

    describe('異常系', () => {
      it('ステップ順序が連続していない場合エラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'エラーテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const invalidSteps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: '1番目',
          },
          {
            stepOrder: 3, // 2番がない
            description: '3番目',
          },
        ];

        // Act & Assert - 連続していない順序でエラーが発生することを確認
        expect(() => recipe.setSteps(invalidSteps)).toThrow(
          'Recipe steps must be numbered consecutively starting from 1'
        );
      });

      it('ステップ順序が1から始まらない場合エラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'エラーテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const invalidSteps: RecipeStep[] = [
          {
            stepOrder: 2, // 1から始まらない
            description: '2番目',
          },
          {
            stepOrder: 3,
            description: '3番目',
          },
        ];

        // Act & Assert - 1から始まらない順序でエラーが発生することを確認
        expect(() => recipe.setSteps(invalidSteps)).toThrow(
          'Recipe steps must be numbered consecutively starting from 1'
        );
      });

      it('無効なステップ順序（0以下）でエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'エラーテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const invalidSteps: RecipeStep[] = [
          {
            stepOrder: 0, // 0以下
            description: '無効なステップ',
          },
        ];

        // Act & Assert - 0以下の順序でエラーが発生することを確認
        expect(() => recipe.setSteps(invalidSteps)).toThrow(ZodError);
      });

      it('空の説明でエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'エラーテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const invalidSteps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: '', // 空の説明
          },
        ];

        // Act & Assert - 空の説明でエラーが発生することを確認
        expect(() => recipe.setSteps(invalidSteps)).toThrow(ZodError);
      });

      it('負の時間でエラーが発生すること', () => {
        // Arrange - レシピを準備
        const recipe = Recipe.create({
          id: testRecipeId,
          title: 'エラーテストレシピ',
          brewingConditions: testBrewingConditions,
        });

        const invalidSteps: RecipeStep[] = [
          {
            stepOrder: 1,
            description: '無効な時間のステップ',
            timeSeconds: -10, // 負の時間
          },
        ];

        // Act & Assert - 負の時間でエラーが発生することを確認
        expect(() => recipe.setSteps(invalidSteps)).toThrow(ZodError);
      });
    });
  });

  describe('setEquipmentIds()', () => {
    it('器具IDを設定できること', () => {
      // Arrange - レシピを準備
      const recipe = Recipe.create({
        id: testRecipeId,
        title: '器具テストレシピ',
        brewingConditions: testBrewingConditions,
      });

      const equipmentIds = ['equipment-1', 'equipment-2', 'equipment-3'];

      // Act - 器具IDを設定
      recipe.setEquipmentIds(equipmentIds);

      // Assert - 器具IDが設定され、更新日時も変更されることを確認
      expect(recipe.equipmentIds).toEqual(equipmentIds);
      expect(recipe.updatedAt).toBeInstanceOf(Date);
    });

    it('空の器具ID配列を設定できること', () => {
      // Arrange - 器具IDがあるレシピを準備
      const recipe = Recipe.create({
        id: testRecipeId,
        title: '器具クリアテストレシピ',
        brewingConditions: testBrewingConditions,
      });

      recipe.setEquipmentIds(['equipment-1']);

      // Act - 空の器具ID配列を設定
      recipe.setEquipmentIds([]);

      // Assert - 器具IDがクリアされることを確認
      expect(recipe.equipmentIds).toHaveLength(0);
    });
  });

  describe('setTagIds()', () => {
    it('タグIDを設定できること', () => {
      // Arrange - レシピを準備
      const recipe = Recipe.create({
        id: testRecipeId,
        title: 'タグテストレシピ',
        brewingConditions: testBrewingConditions,
      });

      const tagIds = ['tag-1', 'tag-2', 'tag-3'];

      // Act - タグIDを設定
      recipe.setTagIds(tagIds);

      // Assert - タグIDが設定され、更新日時も変更されることを確認
      expect(recipe.tagIds).toEqual(tagIds);
      expect(recipe.updatedAt).toBeInstanceOf(Date);
    });

    it('空のタグID配列を設定できること', () => {
      // Arrange - タグIDがあるレシピを準備
      const recipe = Recipe.create({
        id: testRecipeId,
        title: 'タグクリアテストレシピ',
        brewingConditions: testBrewingConditions,
      });

      recipe.setTagIds(['tag-1']);

      // Act - 空のタグID配列を設定
      recipe.setTagIds([]);

      // Assert - タグIDがクリアされることを確認
      expect(recipe.tagIds).toHaveLength(0);
    });
  });
});
