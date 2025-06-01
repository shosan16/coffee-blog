import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildQueryParams, apiRequest } from './request';

// fetch APIをモック化（古典学派アプローチ：外部依存のみモック）
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('request', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildQueryParams', () => {
    describe('基本的な型の処理', () => {
      it('空のオブジェクトから空のURLSearchParamsを生成する', () => {
        // Arrange - 準備：空のフィルターオブジェクトを用意
        const filters = {};

        // Act - 実行：buildQueryParams関数でURLSearchParamsを生成
        const result = buildQueryParams(filters);

        // Assert - 確認：空の文字列と0のサイズが返されることを検証
        expect(result.toString()).toBe('');
        expect(result.size).toBe(0);
      });

      it('プリミティブ値を文字列として正しく変換する', () => {
        // Arrange - 準備：各種プリミティブ型の値を含むフィルターオブジェクトを作成
        const filters = {
          stringValue: 'test',
          numberValue: 42,
          booleanValue: true,
          zeroValue: 0,
          falseValue: false,
        };

        // Act - 実行：buildQueryParams関数でURLSearchParamsに変換
        const result = buildQueryParams(filters);

        // Assert - 確認：各プリミティブ値が正しく文字列化されることを検証
        expect(result.get('stringValue')).toBe('test');
        expect(result.get('numberValue')).toBe('42');
        expect(result.get('booleanValue')).toBe('true');
        expect(result.get('zeroValue')).toBe('0');
        expect(result.get('falseValue')).toBe('false');
      });

      it('undefined値とnull値を除外する', () => {
        // Arrange - 準備：undefined、null、有効な値を含むフィルターオブジェクトを作成
        const filters = {
          validValue: 'test',
          undefinedValue: undefined,
          nullValue: null,
          emptyString: '',
        };

        // Act - 実行：buildQueryParams関数でURLSearchParamsに変換
        const result = buildQueryParams(filters);

        // Assert - 確認：undefined/nullは除外され、有効な値のみが含まれることを検証
        expect(result.has('validValue')).toBe(true);
        expect(result.has('undefinedValue')).toBe(false);
        expect(result.has('nullValue')).toBe(false);
        expect(result.has('emptyString')).toBe(true); // 空文字は有効な値として扱う
        expect(result.get('emptyString')).toBe('');
      });
    });

    describe('配列の処理', () => {
      it('配列をカンマ区切りの文字列に変換する', () => {
        // Arrange - 準備：文字列、数値、混合型の配列を含むフィルターオブジェクトを作成
        const filters = {
          stringArray: ['apple', 'banana', 'cherry'],
          numberArray: [1, 2, 3],
          mixedArray: ['text', 42, true],
        };

        // Act - 実行：buildQueryParams関数で配列をクエリパラメータに変換
        const result = buildQueryParams(filters);

        // Assert - 確認：配列がカンマ区切りの文字列として変換されることを検証
        expect(result.get('stringArray')).toBe('apple,banana,cherry');
        expect(result.get('numberArray')).toBe('1,2,3');
        expect(result.get('mixedArray')).toBe('text,42,true');
      });

      it('空の配列を除外する', () => {
        // Arrange - 準備：空の配列と有効な配列を含むフィルターオブジェクトを作成
        const filters = {
          emptyArray: [],
          validArray: ['item'],
        };

        // Act - 実行：buildQueryParams関数で配列を処理
        const result = buildQueryParams(filters);

        // Assert - 確認：空配列は除外され、有効な配列のみが含まれることを検証
        expect(result.has('emptyArray')).toBe(false);
        expect(result.has('validArray')).toBe(true);
        expect(result.get('validArray')).toBe('item');
      });

      it('配列内のundefined/null値も文字列化する', () => {
        // Arrange - 準備：null/undefinedを含む配列を持つフィルターオブジェクトを作成
        const filters = {
          arrayWithNulls: ['valid', null, undefined, 'another'],
        };

        // Act - 実行：buildQueryParams関数でnull/undefined含む配列を処理
        const result = buildQueryParams(filters);

        // Assert - 確認：join(',')がnull/undefinedを空文字に変換することを検証
        expect(result.get('arrayWithNulls')).toBe('valid,,,another');
      });
    });

    describe('オブジェクトの処理', () => {
      it('オブジェクトをJSON文字列に変換する', () => {
        // Arrange - 準備：シンプルと複雑なオブジェクトを含むフィルターオブジェクトを作成
        const filters = {
          simpleObject: { key: 'value' },
          complexObject: {
            nested: { deep: 'value' },
            array: [1, 2, 3],
            boolean: true,
          },
        };

        // Act - 実行：buildQueryParams関数でオブジェクトをJSON文字列に変換
        const result = buildQueryParams(filters);

        // Assert - 確認：オブジェクトが正しくJSON文字列化されることを検証
        expect(result.get('simpleObject')).toBe('{"key":"value"}');

        // complexObjectの値を直接検証
        const complexObjectValue = result.get('complexObject');
        expect(complexObjectValue).toBe(
          '{"nested":{"deep":"value"},"array":[1,2,3],"boolean":true}'
        );

        // JSONパース結果も検証
        expect(JSON.parse(complexObjectValue as string)).toEqual({
          nested: { deep: 'value' },
          array: [1, 2, 3],
          boolean: true,
        });
      });

      it('空のオブジェクトもJSON文字列に変換する', () => {
        // Arrange - 準備：空のオブジェクトを含むフィルターオブジェクトを作成
        const filters = {
          emptyObject: {},
        };

        // Act - 実行：buildQueryParams関数で空オブジェクトを処理
        const result = buildQueryParams(filters);

        // Assert - 確認：空オブジェクトが正しくJSON文字列化されることを検証
        expect(result.get('emptyObject')).toBe('{}');
      });
    });

    describe('複合パターン', () => {
      it('様々な型が混在したオブジェクトを正しく処理する', () => {
        // Arrange - 準備：プリミティブ、配列、オブジェクト、null/undefinedが混在するフィルターを作成
        const filters = {
          string: 'test',
          number: 42,
          boolean: true,
          array: ['a', 'b'],
          object: { key: 'value' },
          nullValue: null,
          undefinedValue: undefined,
        };

        // Act - 実行：buildQueryParams関数で複合パターンのデータを処理
        const result = buildQueryParams(filters);

        // Assert - 確認：各データ型が適切に変換され、null/undefinedが除外されることを検証
        expect(result.get('string')).toBe('test');
        expect(result.get('number')).toBe('42');
        expect(result.get('boolean')).toBe('true');
        expect(result.get('array')).toBe('a,b');
        expect(result.get('object')).toBe('{"key":"value"}');
        expect(result.has('nullValue')).toBe(false);
        expect(result.has('undefinedValue')).toBe(false);
      });

      it('実際のフィルターオブジェクトパターンを処理する', () => {
        // Arrange - 準備：実際のレシピ検索で使用されるような複雑なフィルターオブジェクトを作成
        const filters = {
          page: 1,
          limit: 10,
          search: 'エスプレッソ',
          roastLevel: ['LIGHT', 'MEDIUM'],
          grindSize: ['FINE'],
          equipment: ['V60', 'Chemex'],
          beanWeight: { min: 15, max: 20 },
          waterTemp: { min: 90, max: 95 },
          sort: 'title',
          order: 'asc',
        };

        // Act - 実行：buildQueryParams関数で実際のユースケースに近いデータを処理
        const result = buildQueryParams(filters);

        // Assert - 確認：実際の検索フィルターが適切にクエリパラメータ化されることを検証
        expect(result.get('page')).toBe('1');
        expect(result.get('limit')).toBe('10');
        expect(result.get('search')).toBe('エスプレッソ');
        expect(result.get('roastLevel')).toBe('LIGHT,MEDIUM');
        expect(result.get('grindSize')).toBe('FINE');
        expect(result.get('equipment')).toBe('V60,Chemex');

        // オブジェクトの値を直接検証
        const beanWeightValue = result.get('beanWeight');
        const waterTempValue = result.get('waterTemp');
        expect(beanWeightValue).toBe('{"min":15,"max":20}');
        expect(waterTempValue).toBe('{"min":90,"max":95}');

        // JSONパース結果も検証
        expect(JSON.parse(beanWeightValue as string)).toEqual({ min: 15, max: 20 });
        expect(JSON.parse(waterTempValue as string)).toEqual({ min: 90, max: 95 });

        expect(result.get('sort')).toBe('title');
        expect(result.get('order')).toBe('asc');
      });
    });

    describe('エッジケース', () => {
      it('特殊文字を含む値を正しく処理する', () => {
        // Arrange - 準備：特殊文字、Unicode文字、記号を含むフィルターオブジェクトを作成
        const filters = {
          specialChars: 'test&value=123',
          unicode: 'テスト値',
          symbols: '!@#$%^&*()',
        };

        // Act - 実行：buildQueryParams関数で特殊文字を含むデータを処理
        const result = buildQueryParams(filters);

        // Assert - 確認：特殊文字が正しく保持されることを検証
        expect(result.get('specialChars')).toBe('test&value=123');
        expect(result.get('unicode')).toBe('テスト値');
        expect(result.get('symbols')).toBe('!@#$%^&*()');
      });

      it('非常に大きな値を処理する', () => {
        // Arrange - 準備：大きな文字列と大きな配列を含むフィルターオブジェクトを作成
        const largeString = 'a'.repeat(1000);
        const largeArray = Array.from({ length: 100 }, (_, i) => `item${i}`);
        const filters = {
          largeString,
          largeArray,
        };

        // Act - 実行：buildQueryParams関数で大容量データを処理
        const result = buildQueryParams(filters);

        // Assert - 確認：大きなデータが正しく処理されることを検証
        expect(result.get('largeString')).toBe(largeString);
        expect(result.get('largeArray')).toBe(largeArray.join(','));
      });
    });
  });

  describe('apiRequest', () => {
    describe('成功レスポンス', () => {
      it('相対パスでのAPIリクエストが成功する', async () => {
        // Arrange - 準備：成功レスポンスのモックとfetchをセットアップ
        const mockResponseData = { message: 'success', data: [1, 2, 3] };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act - 実行：相対パスでapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/test');

        // Assert - 確認：正しいURLでfetchが呼ばれ、期待するレスポンスが返されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/test',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
        expect(result).toEqual(mockResponseData);
      });

      it('絶対URLでのAPIリクエストが成功する', async () => {
        // Arrange - 準備：絶対URL用の成功レスポンスモックを設定
        const mockResponseData = { status: 'ok' };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);
        const absoluteUrl = 'https://api.example.com/data';

        // Act - 実行：絶対URLでapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>(absoluteUrl);

        // Assert - 確認：絶対URLがそのまま使用され、期待するレスポンスが返されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          absoluteUrl,
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
        expect(result).toEqual(mockResponseData);
      });

      it('クエリパラメータ付きリクエストが正しく構築される', async () => {
        // Arrange - 準備：クエリパラメータ用のモックレスポンスとパラメータオブジェクトを設定
        const mockResponseData = { results: [] };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);
        const params = {
          page: 1,
          limit: 10,
          search: 'test query',
          tags: ['tag1', 'tag2'],
        };

        // Act - 実行：クエリパラメータ付きでapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/search', { params });

        // Assert - 確認：パラメータが正しくURLエンコードされてfetchが呼ばれることを検証
        const expectedUrl =
          'http://localhost:3000/api/search?page=1&limit=10&search=test+query&tags=tag1%2Ctag2';
        expect(mockFetch).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
        expect(result).toEqual(mockResponseData);
      });

      it('カスタムヘッダーが正しく設定される', async () => {
        // Arrange - 準備：認証ヘッダー付きリクエスト用のモックレスポンスとカスタムヘッダーを設定
        const mockResponseData = { authenticated: true };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);
        const customHeaders = {
          Authorization: 'Bearer token123',
          'X-Custom-Header': 'custom-value',
        };

        // Act - 実行：カスタムヘッダー付きでapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/protected', {
          headers: customHeaders,
        });

        // Assert - 確認：デフォルトヘッダーとカスタムヘッダーが適切にマージされることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/protected',
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              ...customHeaders,
            },
          })
        );
        expect(result).toEqual(mockResponseData);
      });

      it('POSTリクエストでbodyが正しく送信される', async () => {
        // Arrange - 準備：POST用のモックレスポンスとリクエストボディを設定
        const mockResponseData = { id: 1, created: true };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);
        const requestBody = { name: 'Test Recipe', description: 'Test description' };

        // Act - 実行：POSTメソッドとボディ付きでapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/recipes', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        // Assert - 確認：POSTメソッドとJSONボディが正しく送信されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/recipes',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
        expect(result).toEqual(mockResponseData);
      });
    });

    describe('エラーハンドリング', () => {
      it('HTTPエラーレスポンス（404）を適切に処理する', async () => {
        // Arrange - 準備：404エラーレスポンスのモックを設定
        const errorResponse = { message: 'Not Found' };
        const mockResponse = {
          ok: false,
          status: 404,
          json: vi.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert - 実行と確認：404エラーが適切にスローされ、エラーレスポンスがパースされることを検証
        await expect(apiRequest('/api/nonexistent')).rejects.toThrow('Not Found');
        expect(mockResponse.json).toHaveBeenCalled();
      });

      it('HTTPエラーレスポンス（500）を適切に処理する', async () => {
        // Arrange - 準備：500エラーレスポンスのモックを設定
        const errorResponse = { message: 'Internal Server Error' };
        const mockResponse = {
          ok: false,
          status: 500,
          json: vi.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert - 実行と確認：500エラーが適切にスローされることを検証
        await expect(apiRequest('/api/error')).rejects.toThrow('Internal Server Error');
      });

      it('エラーレスポンスのJSONパースに失敗した場合のフォールバック', async () => {
        // Arrange - 準備：JSONパースエラーを起こすモックレスポンスを設定
        const mockResponse = {
          ok: false,
          status: 500,
          json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert - 実行と確認：JSONパース失敗時にフォールバックエラーメッセージがスローされることを検証
        await expect(apiRequest('/api/invalid-error')).rejects.toThrow(
          'APIからのレスポンスが正常ではありません'
        );
      });

      it('messageプロパティがないエラーレスポンスのフォールバック', async () => {
        // Arrange - 準備：messageプロパティを持たないエラーレスポンスのモックを設定
        const errorResponse = { error: 'Something went wrong', code: 'ERR001' };
        const mockResponse = {
          ok: false,
          status: 400,
          json: vi.fn().mockResolvedValue(errorResponse),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act & Assert - 実行と確認：messageプロパティ不在時にデフォルトエラーメッセージがスローされることを検証
        await expect(apiRequest('/api/bad-request')).rejects.toThrow('APIリクエストエラー');
      });

      it('ネットワークエラーを適切に処理する', async () => {
        // Arrange - 準備：ネットワークエラーをシミュレートするモックを設定
        const networkError = new Error('Network Error');
        mockFetch.mockRejectedValue(networkError);

        // Act & Assert - 実行と確認：ネットワークエラーがそのままスローされることを検証
        await expect(apiRequest('/api/network-error')).rejects.toThrow('Network Error');
      });

      it('タイムアウトエラーを適切に処理する', async () => {
        // Arrange - 準備：タイムアウトエラーをシミュレートするモックを設定
        const timeoutError = new Error('Request timeout');
        mockFetch.mockRejectedValue(timeoutError);

        // Act & Assert - 実行と確認：タイムアウトエラーがそのままスローされることを検証
        await expect(apiRequest('/api/timeout')).rejects.toThrow('Request timeout');
      });
    });

    describe('環境依存の処理', () => {
      it('ブラウザ環境でwindow.location.originを使用する', async () => {
        // Arrange - 準備：ブラウザ環境をシミュレートし、windowオブジェクトとモックレスポンスを設定
        const originalWindow = global.window;
        global.window = {
          location: { origin: 'https://example.com' },
        } as Window & typeof globalThis;

        const mockResponseData = { data: 'test' };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act - 実行：ブラウザ環境でapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/test');

        // Assert - 確認：window.location.originがベースURLとして使用されることを検証
        expect(mockFetch).toHaveBeenCalledWith('https://example.com/api/test', expect.any(Object));
        expect(result).toEqual(mockResponseData);

        // Cleanup - 後処理
        global.window = originalWindow;
      });

      it('サーバー環境で環境変数のベースURLを使用する', async () => {
        // Arrange - 準備：サーバー環境をシミュレートし、環境変数とモックレスポンスを設定
        const originalWindow = global.window;
        const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

        delete (global as unknown as { window?: Window }).window;
        process.env.NEXT_PUBLIC_API_BASE_URL = 'https://api.production.com';

        const mockResponseData = { data: 'server-test' };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act - 実行：サーバー環境でapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/test');

        // Assert - 確認：環境変数のベースURLが使用されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.production.com/api/test',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponseData);

        // Cleanup - 後処理：環境変数を元に戻す
        global.window = originalWindow;
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      });

      it('サーバー環境で環境変数が未設定の場合のデフォルト値', async () => {
        // Arrange - 準備：サーバー環境で環境変数未設定をシミュレート、モックレスポンスを設定
        const originalWindow = global.window;
        const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;

        delete (global as unknown as { window?: Window }).window;
        delete process.env.NEXT_PUBLIC_API_BASE_URL;

        const mockResponseData = { data: 'default-test' };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act - 実行：環境変数未設定状態でapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/test');

        // Assert - 確認：デフォルトのlocalhostベースURLが使用されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/test',
          expect.any(Object)
        );
        expect(result).toEqual(mockResponseData);

        // Cleanup - 後処理：環境変数を元に戻す
        global.window = originalWindow;
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
      });
    });

    describe('複合シナリオ', () => {
      it('パラメータとカスタムヘッダーを組み合わせたリクエスト', async () => {
        // Arrange - 準備：クエリパラメータ、カスタムヘッダー、モックレスポンスを設定
        const mockResponseData = { results: [], total: 0 };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        const params = { search: 'coffee', page: 2 };
        const headers = { Authorization: 'Bearer token' };

        // Act - 実行：パラメータとヘッダーを組み合わせてapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/search', {
          params,
          headers,
          method: 'GET',
        });

        // Assert - 確認：パラメータがURLに付与され、ヘッダーが適切に設定されることを検証
        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/search?search=coffee&page=2',
          expect.objectContaining({
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer token',
            },
          })
        );
        expect(result).toEqual(mockResponseData);
      });

      it('既存のクエリパラメータがあるURLに追加パラメータを付与', async () => {
        // Arrange - 準備：既存パラメータ付きURL用のモックレスポンスと追加パラメータを設定
        const mockResponseData = { data: 'combined' };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        const params = { filter: 'active', sort: 'name' };

        // Act - 実行：既存パラメータがあるURLに追加パラメータを付与してapiRequest関数を呼び出し
        const result = await apiRequest<typeof mockResponseData>('/api/items?existing=true', {
          params,
        });

        // Assert - 確認：既存と追加のパラメータが両方とも含まれることを検証
        const calledUrl = mockFetch.mock.calls[0][0] as string;
        expect(calledUrl).toContain('existing=true');
        expect(calledUrl).toContain('filter=active');
        expect(calledUrl).toContain('sort=name');
        expect(result).toEqual(mockResponseData);
      });
    });

    describe('型安全性', () => {
      it('ジェネリック型が正しく推論される', async () => {
        // Arrange - 準備：型定義付きのモックレスポンスデータを設定
        type ApiResponse = {
          id: number;
          name: string;
          active: boolean;
        };
        const mockResponseData: ApiResponse = {
          id: 1,
          name: 'Test Item',
          active: true,
        };
        const mockResponse = {
          ok: true,
          json: vi.fn().mockResolvedValue(mockResponseData),
        };
        mockFetch.mockResolvedValue(mockResponse);

        // Act - 実行：ジェネリック型を指定してapiRequest関数を呼び出し
        const result = await apiRequest<ApiResponse>('/api/item/1');

        // Assert - 確認：TypeScriptの型チェックにより、resultが正しい型を持つことを検証
        expect(result.id).toBe(1);
        expect(result.name).toBe('Test Item');
        expect(result.active).toBe(true);
        expect(typeof result.id).toBe('number');
        expect(typeof result.name).toBe('string');
        expect(typeof result.active).toBe('boolean');
      });
    });
  });

  describe('統合テスト', () => {
    it('buildQueryParamsとapiRequestが連携して動作する', async () => {
      // Arrange - 準備：複雑なパラメータオブジェクトとモックレスポンスを設定
      const mockResponseData = { success: true };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponseData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const complexParams = {
        search: 'エスプレッソ',
        categories: ['coffee', 'espresso'],
        priceRange: { min: 100, max: 500 },
        inStock: true,
        page: 1,
      };

      // Act - 実行：buildQueryParamsとapiRequestが連携して複雑なパラメータを処理
      const result = await apiRequest<typeof mockResponseData>('/api/products', {
        params: complexParams,
      });

      // Assert - 確認：パラメータが適切にエンコードされてURL化され、正しいレスポンスが返されることを検証
      const calledUrl = mockFetch.mock.calls[0][0] as string;
      expect(calledUrl).toContain('search=%E3%82%A8%E3%82%B9%E3%83%97%E3%83%AC%E3%83%83%E3%82%BD'); // URLエンコードされた日本語
      expect(calledUrl).toContain('categories=coffee%2Cespresso'); // カンマ区切り配列
      expect(calledUrl).toContain('priceRange=%7B%22min%22%3A100%2C%22max%22%3A500%7D'); // JSONエンコードされたオブジェクト
      expect(calledUrl).toContain('inStock=true');
      expect(calledUrl).toContain('page=1');
      expect(result).toEqual(mockResponseData);
    });
  });
});
