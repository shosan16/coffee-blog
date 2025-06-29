import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/client/shared/shadcn/card';

type ServerRecipeDetailErrorProps = {
  /** エラーメッセージ */
  message?: string;
  /** エラータイトル */
  title?: string;
};

/**
 * Server Component用レシピ詳細エラー表示
 *
 * サーバーサイドレンダリング時のエラー表示。
 * クライアントサイドのJavaScriptに依存しない。
 */
export default function ServerRecipeDetailError({
  title = 'エラーが発生しました',
  message = '予期しないエラーが発生しました。',
}: ServerRecipeDetailErrorProps) {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="space-y-6 p-12 text-center">
              {/* エラーアイコン */}
              <div className="flex justify-center">
                <div className="border-border flex h-20 w-20 items-center justify-center rounded-full border border-red-200 bg-red-50">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
              </div>

              {/* エラーメッセージ */}
              <div className="space-y-4">
                <h1 className="text-card-foreground text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-base">{message}</p>
                <p className="text-muted-foreground text-sm">
                  ページを再読み込みするか、レシピ一覧から他のレシピを探してみてください。
                </p>
              </div>

              {/* アクションボタン */}
              <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
                <Link
                  href="/"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
                >
                  <Home className="h-4 w-4" />
                  レシピ一覧に戻る
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
