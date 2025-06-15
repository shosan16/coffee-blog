/**
 * MultiComboboxコンポーネントで使用される型定義
 */

/**
 * MultiComboboxコンポーネントで使用される選択可能なアイテムの型定義
 */
export type MultiComboboxItem = {
  /** アイテムの一意識別子 */
  id: string;
  /** アイテムの表示ラベル */
  label: string;
  /** アイテムの値（オプション、未指定の場合はidを使用） */
  value?: string;
  /** アイテムが無効化されているかどうか */
  disabled?: boolean;
};

/**
 * MultiComboboxコンポーネントのプロパティ型定義
 */
export type MultiComboboxProps = {
  /** 選択可能なアイテムのリスト（必須） */
  items: MultiComboboxItem[];
  /** 現在選択されているアイテムのリスト（必須） */
  selectedItems: MultiComboboxItem[];
  /** アイテムが選択された時のコールバック関数 */
  onSelect?: (item: MultiComboboxItem) => void;
  /** 選択されたアイテムが削除された時のコールバック関数 */
  onDelete?: (item: MultiComboboxItem) => void;
  /** 新しいアイテムが追加された時のコールバック関数（creatable=trueの場合に必要） */
  onAdd?: (inputValue: string) => void;
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 検索ボックス上部に表示されるヘルプメッセージ */
  dropdownHelpMessage?: string;
  /** 新しいアイテムの作成を許可するかどうか */
  creatable?: boolean;
  /** コンポーネントが無効化されているかどうか */
  disabled?: boolean;
  /** カスタムクラス名 */
  className?: string;
  /** 入力フィールドのカスタムクラス名 */
  inputClassName?: string;
  /** ドロップダウンのカスタムクラス名 */
  dropdownClassName?: string;
  /** 選択済みアイテムが空の場合の最小の高さを維持するかどうか */
  keepMinHeight?: boolean;
  /** 最大選択可能数（オプション） */
  maxItems?: number;
};

/**
 * useMultiComboboxフックの戻り値の型定義
 */
export type UseMultiComboboxReturn = {
  /** ドロップダウンの開閉状態 */
  open: boolean;
  /** 入力値 */
  inputValue: string;
  /** 入力要素のref */
  inputRef: React.RefObject<HTMLInputElement>;
  /** リストボックスのID */
  listboxId: string;
  /** フィルタリングされたアイテム */
  filteredItems: MultiComboboxItem[];
  /** 最大選択数に達しているかどうか */
  isMaxItemsReached: boolean;
  /** 新しいアイテムが作成可能かどうか */
  canCreateNewItem: boolean;
  /** ドロップダウンの開閉状態を設定する関数 */
  setOpen: (open: boolean) => void;
  /** 入力値を設定する関数 */
  setInputValue: (value: string) => void;
  /** アイテム選択ハンドラー */
  handleSelectItem: (item: MultiComboboxItem) => void;
  /** アイテム削除ハンドラー */
  handleDeleteItem: (item: MultiComboboxItem) => void;
  /** 新しいアイテム追加ハンドラー */
  handleAddNewItem: () => void;
  /** 入力フィールドクリックハンドラー */
  handleInputClick: (e: React.MouseEvent) => void;
  /** 入力フィールドフォーカスハンドラー */
  handleInputFocus: () => void;
  /** トリガークリックハンドラー */
  handleTriggerClick: () => void;
  /** キーボードイベントハンドラー */
  handleKeyDown: (e: React.KeyboardEvent) => void;
};
