import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/client/shared/shadcn/card';

/**
 * レシピ詳細ページのnot-foundページ
 *
 * 存在しないレシピIDがアクセスされた場合に表示される。
 */
export default function RecipeNotFound() {
  return (
    <div className="bg-background min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="space-y-6 p-12 text-center">
              {/* エラーアイコン */}
              <div className="flex justify-center">
                <div className="border-border flex h-20 w-20 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
                  <AlertCircle className="h-10 w-10 text-orange-500" />
                </div>
              </div>

              {/* エラーメッセージ */}
              <div className="space-y-4">
                <h1 className="text-card-foreground text-2xl font-bold">レシピが見つかりません</h1>
                <p className="text-muted-foreground text-base">
                  指定されたレシピは存在しないか、削除された可能性があります。
                </p>
                <p className="text-muted-foreground text-sm">
                  URLをご確認いただくか、レシピ一覧から他のレシピを探してみてください。
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
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="border-border text-card-foreground hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-semibold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  前のページに戻る
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
