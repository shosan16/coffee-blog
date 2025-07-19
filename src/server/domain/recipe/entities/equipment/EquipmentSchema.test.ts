import { describe, it, expect } from 'vitest';
import { ZodError } from 'zod';

import {
  EquipmentNameSchema,
  EquipmentBrandSchema,
  EquipmentDescriptionSchema,
  EquipmentAffiliateLinkSchema,
  EquipmentTypeSchema,
  EquipmentCreateSchema,
  EquipmentUpdateSchema,
  type EquipmentCreateParams,
  type EquipmentUpdateParams,
  type EquipmentType,
} from './EquipmentSchema';

/**
 * Equipmentスキーマのテスト
 */
describe('EquipmentSchema', () => {
  describe('EquipmentNameSchema', () => {
    describe('正常系', () => {
      it('有効な名前がバリデーションを通過すること', () => {
        expect(() => EquipmentNameSchema.parse('V60ドリッパー')).not.toThrow();
        expect(() => EquipmentNameSchema.parse('a')).not.toThrow();
        expect(() => EquipmentNameSchema.parse('a'.repeat(200))).not.toThrow();
      });

      it('前後の空白が除去されること', () => {
        const result = EquipmentNameSchema.parse('  V60ドリッパー  ');
        expect(result).toBe('V60ドリッパー');
      });
    });

    describe('異常系', () => {
      it('空文字でZodErrorが発生すること', () => {
        expect(() => EquipmentNameSchema.parse('')).toThrow(ZodError);
      });

      it('200文字超過でZodErrorが発生すること', () => {
        expect(() => EquipmentNameSchema.parse('a'.repeat(201))).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentBrandSchema', () => {
    describe('正常系', () => {
      it('有効なブランドがバリデーションを通過すること', () => {
        expect(() => EquipmentBrandSchema.parse('HARIO')).not.toThrow();
        expect(() => EquipmentBrandSchema.parse('a'.repeat(100))).not.toThrow();
        expect(() => EquipmentBrandSchema.parse(undefined)).not.toThrow();
      });

      it('前後の空白が除去されること', () => {
        const result = EquipmentBrandSchema.parse('  HARIO  ');
        expect(result).toBe('HARIO');
      });
    });

    describe('異常系', () => {
      it('100文字超過でZodErrorが発生すること', () => {
        expect(() => EquipmentBrandSchema.parse('a'.repeat(101))).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentDescriptionSchema', () => {
    describe('正常系', () => {
      it('有効な説明がバリデーションを通過すること', () => {
        expect(() => EquipmentDescriptionSchema.parse('コーヒードリッパー')).not.toThrow();
        expect(() => EquipmentDescriptionSchema.parse('a'.repeat(1000))).not.toThrow();
        expect(() => EquipmentDescriptionSchema.parse(undefined)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('1000文字超過でZodErrorが発生すること', () => {
        expect(() => EquipmentDescriptionSchema.parse('a'.repeat(1001))).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentAffiliateLinkSchema', () => {
    describe('正常系', () => {
      it('有効なURLがバリデーションを通過すること', () => {
        expect(() => EquipmentAffiliateLinkSchema.parse('https://example.com')).not.toThrow();
        expect(() => EquipmentAffiliateLinkSchema.parse(undefined)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('無効なURLでZodErrorが発生すること', () => {
        expect(() => EquipmentAffiliateLinkSchema.parse('invalid-url')).toThrow(ZodError);
      });

      it('500文字超過でZodErrorが発生すること', () => {
        const longUrl = `https://example.com/${'a'.repeat(500)}`;
        expect(() => EquipmentAffiliateLinkSchema.parse(longUrl)).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentTypeSchema', () => {
    describe('正常系', () => {
      it('有効な器具タイプがバリデーションを通過すること', () => {
        const equipmentType: EquipmentType = {
          id: 'type-1',
          name: 'ドリッパー',
          description: 'コーヒードリッパー',
        };

        expect(() => EquipmentTypeSchema.parse(equipmentType)).not.toThrow();
      });

      it('説明なしでバリデーションを通過すること', () => {
        const equipmentType = {
          id: 'type-1',
          name: 'ドリッパー',
        };

        expect(() => EquipmentTypeSchema.parse(equipmentType)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('IDが空文字でZodErrorが発生すること', () => {
        const equipmentType = {
          id: '',
          name: 'ドリッパー',
        };

        expect(() => EquipmentTypeSchema.parse(equipmentType)).toThrow(ZodError);
      });

      it('名前が空文字でZodErrorが発生すること', () => {
        const equipmentType = {
          id: 'type-1',
          name: '',
        };

        expect(() => EquipmentTypeSchema.parse(equipmentType)).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentCreateSchema', () => {
    describe('正常系', () => {
      it('有効なパラメータがバリデーションを通過すること', () => {
        const params: EquipmentCreateParams = {
          id: 'equipment-1',
          name: 'V60ドリッパー',
          brand: 'HARIO',
          description: 'コーヒードリッパー',
          affiliateLink: 'https://example.com',
          isAvailable: true,
        };

        expect(() => EquipmentCreateSchema.parse(params)).not.toThrow();
      });

      it('オプション項目なしでバリデーションを通過すること', () => {
        const params = {
          id: 'equipment-1',
          name: 'V60ドリッパー',
        };

        expect(() => EquipmentCreateSchema.parse(params)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('IDが空文字でZodErrorが発生すること', () => {
        const params = {
          id: '',
          name: 'V60ドリッパー',
        };

        expect(() => EquipmentCreateSchema.parse(params)).toThrow(ZodError);
      });

      it('名前が無効でZodErrorが発生すること', () => {
        const params = {
          id: 'equipment-1',
          name: '',
        };

        expect(() => EquipmentCreateSchema.parse(params)).toThrow(ZodError);
      });
    });
  });

  describe('EquipmentUpdateSchema', () => {
    describe('正常系', () => {
      it('名前のみの更新パラメータがバリデーションを通過すること', () => {
        const params: EquipmentUpdateParams = {
          name: '更新された名前',
        };

        expect(() => EquipmentUpdateSchema.parse(params)).not.toThrow();
      });

      it('ブランドのみの更新パラメータがバリデーションを通過すること', () => {
        const params: EquipmentUpdateParams = {
          brand: '更新されたブランド',
        };

        expect(() => EquipmentUpdateSchema.parse(params)).not.toThrow();
      });

      it('全項目の更新パラメータがバリデーションを通過すること', () => {
        const params: EquipmentUpdateParams = {
          name: '更新された名前',
          brand: '更新されたブランド',
          description: '更新された説明',
          affiliateLink: 'https://updated.example.com',
        };

        expect(() => EquipmentUpdateSchema.parse(params)).not.toThrow();
      });

      it('空のオブジェクトでバリデーションを通過すること', () => {
        const params = {};

        expect(() => EquipmentUpdateSchema.parse(params)).not.toThrow();
      });

      it('nullでプロパティをクリアできること', () => {
        const params: EquipmentUpdateParams = {
          brand: null,
          description: null,
          affiliateLink: null,
        };

        expect(() => EquipmentUpdateSchema.parse(params)).not.toThrow();
      });
    });

    describe('異常系', () => {
      it('無効な名前でZodErrorが発生すること', () => {
        const params: EquipmentUpdateParams = {
          name: '',
        };

        expect(() => EquipmentUpdateSchema.parse(params)).toThrow(ZodError);
      });

      it('無効なブランドでZodErrorが発生すること', () => {
        const params: EquipmentUpdateParams = {
          brand: 'a'.repeat(101),
        };

        expect(() => EquipmentUpdateSchema.parse(params)).toThrow(ZodError);
      });

      it('無効な説明でZodErrorが発生すること', () => {
        const params: EquipmentUpdateParams = {
          description: 'a'.repeat(1001),
        };

        expect(() => EquipmentUpdateSchema.parse(params)).toThrow(ZodError);
      });

      it('無効なURLでZodErrorが発生すること', () => {
        const params: EquipmentUpdateParams = {
          affiliateLink: 'invalid-url',
        };

        expect(() => EquipmentUpdateSchema.parse(params)).toThrow(ZodError);
      });
    });
  });
});
