import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

import { Barista, type SocialLink } from './Barista.entity';

describe('Barista Entity', () => {
  describe('create()', () => {
    describe('正常系', () => {
      it('有効なパラメータでバリスタを作成できること', () => {
        // Arrange - バリスタ作成パラメータを準備
        const params = {
          id: 'barista-1',
          name: '田中太郎',
          affiliation: 'テストカフェ',
        };

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 作成されたバリスタの状態を確認
        expect(barista.id).toBe('barista-1');
        expect(barista.name).toBe('田中太郎');
        expect(barista.affiliation).toBe('テストカフェ');
        expect(barista.socialLinks).toHaveLength(0);
        expect(barista.createdAt).toBeInstanceOf(Date);
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('所属なしでバリスタを作成できること', () => {
        // Arrange - 所属なしのパラメータを準備
        const params = {
          id: 'barista-2',
          name: '佐藤花子',
        };

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 作成されたバリスタの状態を確認
        expect(barista.id).toBe('barista-2');
        expect(barista.name).toBe('佐藤花子');
        expect(barista.affiliation).toBeUndefined();
        expect(barista.socialLinks).toHaveLength(0);
      });

      it('前後の空白が除去されること', () => {
        // Arrange - 前後に空白があるパラメータを準備
        const params = {
          id: 'barista-3',
          name: '  空白付き名前  ',
          affiliation: '  空白付き所属  ',
        };

        // Act - バリスタを作成
        const barista = Barista.create(params);

        // Assert - 空白が除去されることを確認
        expect(barista.name).toBe('空白付き名前');
        expect(barista.affiliation).toBe('空白付き所属');
      });
    });

    describe('異常系', () => {
      it('空のIDでエラーが発生すること', () => {
        // Arrange - 無効なIDを持つパラメータを準備
        const params = {
          id: '',
          name: 'テスト名前',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('空の名前でエラーが発生すること', () => {
        // Arrange - 無効な名前を持つパラメータを準備
        const params = {
          id: 'barista-1',
          name: '',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('空白のみの名前でエラーが発生すること', () => {
        // Arrange - 空白のみの名前を持つパラメータを準備
        const params = {
          id: 'barista-1',
          name: '   ',
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('長すぎる名前でエラーが発生すること', () => {
        // Arrange - 101文字の名前を準備
        const longName = 'a'.repeat(101);
        const params = {
          id: 'barista-1',
          name: longName,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });

      it('長すぎる所属でエラーが発生すること', () => {
        // Arrange - 201文字の所属を準備
        const longAffiliation = 'a'.repeat(201);
        const params = {
          id: 'barista-1',
          name: 'テスト名前',
          affiliation: longAffiliation,
        };

        // Act & Assert - エラーが発生することを確認
        expect(() => Barista.create(params)).toThrow(ZodError);
      });
    });
  });

  describe('reconstruct()', () => {
    it('既存データからバリスタを再構築できること', () => {
      // Arrange - 再構築用のデータを準備
      const socialLinks: SocialLink[] = [
        {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        },
        {
          id: 'link-2',
          platform: 'Twitter',
          url: 'https://twitter.com/test',
        },
      ];

      const data = {
        id: 'barista-1',
        name: '再構築バリスタ',
        affiliation: '再構築カフェ',
        socialLinks,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      };

      // Act - バリスタを再構築
      const barista = Barista.reconstruct(data);

      // Assert - 再構築されたバリスタの状態を確認
      expect(barista.id).toBe('barista-1');
      expect(barista.name).toBe('再構築バリスタ');
      expect(barista.affiliation).toBe('再構築カフェ');
      expect(barista.socialLinks).toHaveLength(2);
      expect(barista.socialLinks[0].platform).toBe('Instagram');
      expect(barista.socialLinks[1].platform).toBe('Twitter');
      expect(barista.createdAt).toEqual(new Date('2024-01-01'));
      expect(barista.updatedAt).toEqual(new Date('2024-12-01'));
    });

    it('ソーシャルリンクなしで再構築できること', () => {
      // Arrange - ソーシャルリンクなしのデータを準備
      const data = {
        id: 'barista-2',
        name: 'シンプルバリスタ',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-01'),
      };

      // Act - バリスタを再構築
      const barista = Barista.reconstruct(data);

      // Assert - 再構築されたバリスタの状態を確認
      expect(barista.id).toBe('barista-2');
      expect(barista.name).toBe('シンプルバリスタ');
      expect(barista.affiliation).toBeUndefined();
      expect(barista.socialLinks).toHaveLength(0);
    });
  });

  describe('updateName()', () => {
    describe('正常系', () => {
      it('有効な名前で更新できること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: '元の名前',
        });

        // Act - 名前を更新
        barista.updateName('新しい名前');

        // Assert - 名前が更新され、更新日時も変更されることを確認
        expect(barista.name).toBe('新しい名前');
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('前後の空白が除去されること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: '元の名前',
        });

        // Act - 前後に空白がある名前で更新
        barista.updateName('  空白付き名前  ');

        // Assert - 空白が除去されることを確認
        expect(barista.name).toBe('空白付き名前');
      });
    });

    describe('異常系', () => {
      it('空の名前でエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: '元の名前',
        });

        // Act & Assert - 空名前でエラーが発生することを確認
        expect(() => barista.updateName('')).toThrow(ZodError);
      });

      it('長すぎる名前でエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: '元の名前',
        });

        // Act & Assert - 101文字の名前でエラーが発生することを確認
        const longName = 'a'.repeat(101);
        expect(() => barista.updateName(longName)).toThrow(ZodError);
      });

      it('空白のみの名前でエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: '元の名前',
        });

        // Act & Assert - 空白のみでエラーが発生することを確認
        expect(() => barista.updateName('   ')).toThrow(ZodError);
      });
    });
  });

  describe('updateAffiliation()', () => {
    describe('正常系', () => {
      it('有効な所属で更新できること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
          affiliation: '元の所属',
        });

        // Act - 所属を更新
        barista.updateAffiliation('新しい所属');

        // Assert - 所属が更新され、更新日時も変更されることを確認
        expect(barista.affiliation).toBe('新しい所属');
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('所属をundefinedで削除できること', () => {
        // Arrange - 所属があるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
          affiliation: '削除される所属',
        });

        // Act - 所属をundefinedで更新（削除）
        barista.updateAffiliation();

        // Assert - 所属が削除されることを確認
        expect(barista.affiliation).toBeUndefined();
      });

      it('前後の空白が除去されること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        // Act - 前後に空白がある所属で更新
        barista.updateAffiliation('  空白付き所属  ');

        // Assert - 空白が除去されることを確認
        expect(barista.affiliation).toBe('空白付き所属');
      });
    });

    describe('異常系', () => {
      it('長すぎる所属でエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        // Act & Assert - 201文字の所属でエラーが発生することを確認
        const longAffiliation = 'a'.repeat(201);
        expect(() => barista.updateAffiliation(longAffiliation)).toThrow(ZodError);
      });
    });
  });

  describe('isActive()', () => {
    it('ソーシャルリンクがあるバリスタは活動中とみなされること', () => {
      // Arrange - ソーシャルリンクありのバリスタを準備
      const barista = Barista.create({
        id: 'barista-1',
        name: 'アクティブバリスタ',
      });

      const socialLink: SocialLink = {
        id: 'link-1',
        platform: 'Instagram',
        url: 'https://instagram.com/test',
      };
      barista.addSocialLink(socialLink);

      // Act & Assert - 活動中であることを確認
      expect(barista.isActive()).toBe(true);
    });

    it('所属があるバリスタは活動中とみなされること', () => {
      // Arrange - 所属ありのバリスタを準備
      const barista = Barista.create({
        id: 'barista-1',
        name: 'アクティブバリスタ',
        affiliation: 'テストカフェ',
      });

      // Act & Assert - 活動中であることを確認
      expect(barista.isActive()).toBe(true);
    });

    it('ソーシャルリンクも所属もないバリスタは非活動とみなされること', () => {
      // Arrange - 最小構成のバリスタを準備
      const barista = Barista.create({
        id: 'barista-1',
        name: '非アクティブバリスタ',
      });

      // Act & Assert - 非活動であることを確認
      expect(barista.isActive()).toBe(false);
    });
  });

  describe('equals()', () => {
    it('同じIDのバリスタは等価であること', () => {
      // Arrange - 同じIDの2つのバリスタを準備
      const barista1 = Barista.create({
        id: 'barista-1',
        name: 'バリスタ1',
      });

      const barista2 = Barista.create({
        id: 'barista-1',
        name: 'バリスタ2', // 異なる名前でもIDが同じなら等価
      });

      // Act & Assert - 等価であることを確認
      expect(barista1.equals(barista2)).toBe(true);
    });

    it('異なるIDのバリスタは等価でないこと', () => {
      // Arrange - 異なるIDの2つのバリスタを準備
      const barista1 = Barista.create({
        id: 'barista-1',
        name: 'バリスタ1',
      });

      const barista2 = Barista.create({
        id: 'barista-2',
        name: 'バリスタ2',
      });

      // Act & Assert - 等価でないことを確認
      expect(barista1.equals(barista2)).toBe(false);
    });
  });

  describe('addSocialLink()', () => {
    describe('正常系', () => {
      it('有効なソーシャルリンクを追加できること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };

        // Act - ソーシャルリンクを追加
        barista.addSocialLink(socialLink);

        // Assert - ソーシャルリンクが追加され、更新日時も変更されることを確認
        expect(barista.socialLinks).toHaveLength(1);
        expect(barista.socialLinks[0]).toEqual(socialLink);
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('複数の異なるプラットフォームのリンクを追加できること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const instagramLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };

        const twitterLink: SocialLink = {
          id: 'link-2',
          platform: 'Twitter',
          url: 'https://twitter.com/test',
        };

        // Act - 複数のソーシャルリンクを追加
        barista.addSocialLink(instagramLink);
        barista.addSocialLink(twitterLink);

        // Assert - 両方のリンクが追加されることを確認
        expect(barista.socialLinks).toHaveLength(2);
        expect(barista.socialLinks[0]).toEqual(instagramLink);
        expect(barista.socialLinks[1]).toEqual(twitterLink);
      });
    });

    describe('異常系', () => {
      it('同じプラットフォームのリンクを重複追加するとエラーが発生すること', () => {
        // Arrange - Instagramリンクが既にあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const firstInstagramLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/first',
        };

        const secondInstagramLink: SocialLink = {
          id: 'link-2',
          platform: 'Instagram',
          url: 'https://instagram.com/second',
        };

        barista.addSocialLink(firstInstagramLink);

        // Act & Assert - 重複プラットフォームでエラーが発生することを確認
        expect(() => barista.addSocialLink(secondInstagramLink)).toThrow(
          "Social link for platform 'Instagram' already exists"
        );
      });

      it('大文字小文字を区別せずに重複をチェックすること', () => {
        // Arrange - 小文字のinstagramリンクが既にあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const lowerCaseLink: SocialLink = {
          id: 'link-1',
          platform: 'instagram',
          url: 'https://instagram.com/test',
        };

        const upperCaseLink: SocialLink = {
          id: 'link-2',
          platform: 'INSTAGRAM',
          url: 'https://instagram.com/test2',
        };

        barista.addSocialLink(lowerCaseLink);

        // Act & Assert - 大文字でも重複として検出されることを確認
        expect(() => barista.addSocialLink(upperCaseLink)).toThrow(
          "Social link for platform 'INSTAGRAM' already exists"
        );
      });

      it('無効なソーシャルリンクでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const invalidLink: SocialLink = {
          id: '', // 空のID
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };

        // Act & Assert - 無効なリンクでエラーが発生することを確認
        expect(() => barista.addSocialLink(invalidLink)).toThrow(ZodError);
      });

      it('無効なURLでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const invalidUrlLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'invalid-url', // 無効なURL
        };

        // Act & Assert - 無効なURLでエラーが発生することを確認
        expect(() => barista.addSocialLink(invalidUrlLink)).toThrow(ZodError);
      });
    });
  });

  describe('updateSocialLink()', () => {
    describe('正常系', () => {
      it('既存のソーシャルリンクのURLを更新できること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/old',
        };
        barista.addSocialLink(socialLink);

        // Act - URLを更新
        barista.updateSocialLink('link-1', {
          url: 'https://instagram.com/new',
        });

        // Assert - URLが更新されることを確認
        expect(barista.socialLinks[0].url).toBe('https://instagram.com/new');
        expect(barista.socialLinks[0].platform).toBe('Instagram'); // プラットフォームは変更されない
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('既存のソーシャルリンクのプラットフォームを更新できること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };
        barista.addSocialLink(socialLink);

        // Act - プラットフォームを更新
        barista.updateSocialLink('link-1', {
          platform: 'Twitter',
          url: 'https://twitter.com/test',
        });

        // Assert - プラットフォームとURLが更新されることを確認
        expect(barista.socialLinks[0].platform).toBe('Twitter');
        expect(barista.socialLinks[0].url).toBe('https://twitter.com/test');
      });
    });

    describe('異常系', () => {
      it('存在しないリンクIDでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        // Act & Assert - 存在しないIDでエラーが発生することを確認
        expect(() =>
          barista.updateSocialLink('non-existent', {
            url: 'https://example.com',
          })
        ).toThrow("Social link with ID 'non-existent' not found");
      });

      it('プラットフォーム変更時に重複するとエラーが発生すること', () => {
        // Arrange - 複数のソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const instagramLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };

        const twitterLink: SocialLink = {
          id: 'link-2',
          platform: 'Twitter',
          url: 'https://twitter.com/test',
        };

        barista.addSocialLink(instagramLink);
        barista.addSocialLink(twitterLink);

        // Act & Assert - Twitterを既に存在するInstagramに変更するとエラー
        expect(() =>
          barista.updateSocialLink('link-2', {
            platform: 'Instagram',
          })
        ).toThrow("Social link for platform 'Instagram' already exists");
      });

      it('無効なURLでエラーが発生すること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };
        barista.addSocialLink(socialLink);

        // Act & Assert - 無効なURLでエラーが発生することを確認
        expect(() =>
          barista.updateSocialLink('link-1', {
            url: 'invalid-url',
          })
        ).toThrow(ZodError);
      });
    });
  });

  describe('removeSocialLink()', () => {
    describe('正常系', () => {
      it('既存のソーシャルリンクを削除できること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };
        barista.addSocialLink(socialLink);

        // Act - ソーシャルリンクを削除
        barista.removeSocialLink('link-1');

        // Assert - ソーシャルリンクが削除され、更新日時も変更されることを確認
        expect(barista.socialLinks).toHaveLength(0);
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('複数のリンクから特定のリンクを削除できること', () => {
        // Arrange - 複数のソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const instagramLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };

        const twitterLink: SocialLink = {
          id: 'link-2',
          platform: 'Twitter',
          url: 'https://twitter.com/test',
        };

        barista.addSocialLink(instagramLink);
        barista.addSocialLink(twitterLink);

        // Act - 1つのソーシャルリンクを削除
        barista.removeSocialLink('link-1');

        // Assert - 指定されたリンクが削除され、他が残ることを確認
        expect(barista.socialLinks).toHaveLength(1);
        expect(barista.socialLinks[0]).toEqual(twitterLink);
      });
    });

    describe('異常系', () => {
      it('存在しないリンクIDでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        // Act & Assert - 存在しないIDでエラーが発生することを確認
        expect(() => barista.removeSocialLink('non-existent')).toThrow(
          "Social link with ID 'non-existent' not found"
        );
      });
    });
  });

  describe('setSocialLinks()', () => {
    describe('正常系', () => {
      it('有効なソーシャルリンク配列を設定できること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLinks: SocialLink[] = [
          {
            id: 'link-1',
            platform: 'Instagram',
            url: 'https://instagram.com/test',
          },
          {
            id: 'link-2',
            platform: 'Twitter',
            url: 'https://twitter.com/test',
          },
        ];

        // Act - ソーシャルリンク配列を設定
        barista.setSocialLinks(socialLinks);

        // Assert - ソーシャルリンクが設定され、更新日時も変更されることを確認
        expect(barista.socialLinks).toHaveLength(2);
        expect(barista.socialLinks).toEqual(socialLinks);
        expect(barista.updatedAt).toBeInstanceOf(Date);
      });

      it('空のソーシャルリンク配列を設定できること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const socialLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/test',
        };
        barista.addSocialLink(socialLink);

        // Act - 空の配列を設定
        barista.setSocialLinks([]);

        // Assert - ソーシャルリンクがクリアされることを確認
        expect(barista.socialLinks).toHaveLength(0);
      });

      it('既存のソーシャルリンクを置換できること', () => {
        // Arrange - ソーシャルリンクがあるバリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const oldLink: SocialLink = {
          id: 'link-1',
          platform: 'Instagram',
          url: 'https://instagram.com/old',
        };
        barista.addSocialLink(oldLink);

        const newLinks: SocialLink[] = [
          {
            id: 'link-2',
            platform: 'Twitter',
            url: 'https://twitter.com/new',
          },
        ];

        // Act - 新しいソーシャルリンク配列で置換
        barista.setSocialLinks(newLinks);

        // Assert - 古いリンクが削除され、新しいリンクが設定されることを確認
        expect(barista.socialLinks).toHaveLength(1);
        expect(barista.socialLinks[0]).toEqual(newLinks[0]);
      });
    });

    describe('異常系', () => {
      it('重複するプラットフォームでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const duplicatePlatformLinks: SocialLink[] = [
          {
            id: 'link-1',
            platform: 'Instagram',
            url: 'https://instagram.com/first',
          },
          {
            id: 'link-2',
            platform: 'Instagram', // 重複プラットフォーム
            url: 'https://instagram.com/second',
          },
        ];

        // Act & Assert - 重複プラットフォームでエラーが発生することを確認
        expect(() => barista.setSocialLinks(duplicatePlatformLinks)).toThrow(
          'Duplicate platforms are not allowed in social links'
        );
      });

      it('無効なソーシャルリンクでエラーが発生すること', () => {
        // Arrange - バリスタを準備
        const barista = Barista.create({
          id: 'barista-1',
          name: 'テストバリスタ',
        });

        const invalidLinks: SocialLink[] = [
          {
            id: '', // 空のID
            platform: 'Instagram',
            url: 'https://instagram.com/test',
          },
        ];

        // Act & Assert - 無効なリンクでエラーが発生することを確認
        expect(() => barista.setSocialLinks(invalidLinks)).toThrow(ZodError);
      });
    });
  });

  describe('toPlainObject()', () => {
    it('プレーンオブジェクトに変換できること', () => {
      // Arrange - バリスタを準備
      const barista = Barista.create({
        id: 'barista-1',
        name: 'テストバリスタ',
        affiliation: 'テストカフェ',
      });

      const socialLink: SocialLink = {
        id: 'link-1',
        platform: 'Instagram',
        url: 'https://instagram.com/test',
      };
      barista.addSocialLink(socialLink);

      // Act - プレーンオブジェクトに変換
      const plainObject = barista.toPlainObject();

      // Assert - 正しく変換されることを確認
      expect(plainObject).toEqual({
        id: 'barista-1',
        name: 'テストバリスタ',
        affiliation: 'テストカフェ',
        socialLinks: [socialLink],
        createdAt: barista.createdAt,
        updatedAt: barista.updatedAt,
      });
    });
  });
});
