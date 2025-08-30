import type { ErrorMessage, ErrorContext } from './types';

/**
 * エラーメッセージファクトリー
 * 一貫したエラーメッセージ作成とi18n準備
 */
export function createErrorMessage(
  title: string,
  description: string,
  options?: {
    action?: string;
    severity?: ErrorMessage['severity'];
  }
): ErrorMessage {
  return {
    title,
    description,
    action: options?.action,
    severity: options?.severity ?? 'error',
  };
}

/**
 * 動的エラーメッセージファクトリー
 * コンテキストに基づいてメッセージを生成
 */
export function createDynamicErrorMessage(
  titleTemplate: string,
  descriptionTemplate: string,
  options?: {
    action?: string;
    severity?: ErrorMessage['severity'];
  }
) {
  return (context?: Partial<ErrorContext>): ErrorMessage => {
    // 将来的なテンプレート置換機能のための基盤
    const title = titleTemplate.replace(/\{(\w+)\}/g, (match, key) => {
      return context?.metadata?.[key]?.toString() ?? match;
    });

    const description = descriptionTemplate.replace(/\{(\w+)\}/g, (match, key) => {
      return context?.metadata?.[key]?.toString() ?? match;
    });

    return createErrorMessage(title, description, options);
  };
}

/**
 * 標準的なHTTPエラーステータスに基づくエラーメッセージ
 */
export function createHttpErrorMessage(statusCode: number, resource?: string): ErrorMessage {
  const resourceText = resource ? `${resource}` : 'リソース';

  switch (statusCode) {
    case 400:
      return createErrorMessage(
        'リクエストエラー',
        '送信されたデータに問題があります。入力内容を確認してください。',
        { severity: 'warning', action: '入力内容を確認して再度お試しください。' }
      );
    case 401:
      return createErrorMessage('認証エラー', '認証が必要です。ログインしてください。', {
        severity: 'warning',
        action: 'ログインページに移動してください。',
      });
    case 403:
      return createErrorMessage('アクセス拒否', `${resourceText}へのアクセス権限がありません。`, {
        severity: 'warning',
        action: '管理者に連絡してください。',
      });
    case 404:
      return createErrorMessage(
        `${resourceText}が見つかりません`,
        `指定された${resourceText}は存在しません。`,
        { severity: 'info', action: 'URLを確認するか、一覧ページから探してください。' }
      );
    case 429:
      return createErrorMessage(
        'リクエスト制限',
        'アクセスが集中しています。少し時間をおいてから再度お試しください。',
        { severity: 'warning', action: '1分程度待ってから再度お試しください。' }
      );
    case 500:
    case 502:
    case 503:
    case 504:
      return createErrorMessage(
        'サーバーエラー',
        'サーバーで問題が発生しました。しばらく待ってから再度お試しください。',
        { severity: 'critical', action: '時間をおいて再度アクセスしてください。' }
      );
    default:
      return createErrorMessage('予期しないエラー', '予期しない問題が発生しました。', {
        severity: 'error',
        action: 'ページを更新するか、サポートに連絡してください。',
      });
  }
}
