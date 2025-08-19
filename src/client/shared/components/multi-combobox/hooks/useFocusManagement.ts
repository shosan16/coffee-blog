import { useCallback, useMemo, useRef } from 'react';

export type FocusManagementProps = {
  /** モーダル表示時の自動フォーカスによるユーザー体験の阻害を防止するフラグ */
  readonly autoFocus: boolean;
  /** コンポーネント無効化フラグ */
  readonly disabled: boolean;
};

export type FocusManagementReturn = {
  /** 入力フィールドへの参照 */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** モーダル環境でのキーボードナビゲーション制御に使用するtabIndex値 */
  inputTabIndex: number;
  /** 入力フィールド専用クリックハンドラー */
  handleInputClick: (e: React.MouseEvent) => void;
  /** フォーカスハンドラー（モーダル環境対応） */
  handleInputFocus: () => void;
  /** トリガークリックハンドラー */
  handleTriggerClick: () => void;
};

/**
 * MultiComboboxのフォーカス管理を担当するカスタムフック
 *
 * KISS原則に基づき、setTimeout副作用を除去し宣言的な実装を提供。
 * モーダル環境での意図しない自動フォーカスによるドロップダウン開閉を防止。
 */
export function useFocusManagement({
  autoFocus,
  disabled,
}: FocusManagementProps): FocusManagementReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const inputTabIndex = useMemo(() => {
    return autoFocus ? 0 : -1;
  }, [autoFocus]);

  const handleInputClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled) {
        inputRef.current?.focus();
      }
    },
    [disabled]
  );

  const handleInputFocus = useCallback(() => {
    // モーダル環境対応：フォーカス時の自動オープンを無効化
  }, []);

  const handleTriggerClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return {
    inputRef,
    inputTabIndex,
    handleInputClick,
    handleInputFocus,
    handleTriggerClick,
  };
}
