'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Card, CardContent } from '@/client/shared/shadcn/card';

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
};

type State = {
  hasError: boolean;
  error?: Error;
};

/**
 * レシピ詳細コンポーネント用エラー境界
 *
 * クライアントサイドで発生したエラーをキャッチし、
 * グレースフルにフォールバック表示を提供する。
 */
export default class RecipeDetailErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // エラーが発生した場合、state を更新してフォールバック UI を表示
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // エラーログをコンソールに出力（本番環境では外部ログサービスに送信）
    // eslint-disable-next-line no-console
    console.error('RecipeDetailErrorBoundary caught an error:', error, errorInfo);

    // 本番環境では、エラートラッキングサービスに送信
    if (process.env.NODE_ENV === 'production') {
      // 例: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    // エラー状態をリセットして再試行
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = 'コンポーネントエラー',
        fallbackMessage = 'レシピ詳細の表示中にエラーが発生しました。',
      } = this.props;

      return (
        <div className="py-8">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="space-y-6 p-8 text-center">
              {/* エラーアイコン */}
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>

              {/* エラーメッセージ */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-red-800">{fallbackTitle}</h3>
                <p className="text-sm text-red-600">{fallbackMessage}</p>
                <p className="text-xs text-red-500">
                  問題が継続する場合は、ページを再読み込みしてください。
                </p>
              </div>

              {/* エラー詳細（開発環境のみ） */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-red-700">
                    開発者向け詳細情報
                  </summary>
                  <pre className="mt-2 rounded bg-red-100 p-3 text-xs whitespace-pre-wrap text-red-800">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* 再試行ボタン */}
              <div className="pt-4">
                <button
                  onClick={this.handleRetry}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                >
                  <RefreshCw className="h-4 w-4" />
                  再試行
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
