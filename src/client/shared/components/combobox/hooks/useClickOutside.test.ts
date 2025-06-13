import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { useClickOutside } from '../hooks/useClickOutside';

describe('useClickOutside', () => {
  let mockRef: React.RefObject<HTMLDivElement>;
  let mockCallback: ReturnType<typeof vi.fn>;
  let mockElement: HTMLDivElement;
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockRef = { current: mockElement };
    mockCallback = vi.fn();

    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('マウントされた時にイベントリスナーを登録する', () => {
    renderHook(() => useClickOutside(mockRef, mockCallback));

    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('アンマウントされた時にイベントリスナーを削除する', () => {
    const { unmount } = renderHook(() => useClickOutside(mockRef, mockCallback));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });

  it('要素外をクリックした時にコールバックが呼ばれる', () => {
    renderHook(() => useClickOutside(mockRef, mockCallback));

    // 要素外をクリック
    const outsideElement = document.createElement('div');
    document.body.appendChild(outsideElement);

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: outsideElement,
      enumerable: true,
    });

    document.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledWith(event);

    document.body.removeChild(outsideElement);
  });

  it('要素内をクリックした時はコールバックが呼ばれない', () => {
    renderHook(() => useClickOutside(mockRef, mockCallback));

    // 要素内をクリック
    const insideElement = document.createElement('span');
    mockElement.appendChild(insideElement);

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: insideElement,
      enumerable: true,
    });

    document.dispatchEvent(event);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('refがnullの場合はコールバックが呼ばれる', () => {
    const nullRef: React.RefObject<HTMLDivElement | null> = { current: null };
    renderHook(() => useClickOutside(nullRef, mockCallback));

    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: document.createElement('div'),
      enumerable: true,
    });

    document.dispatchEvent(event);

    expect(mockCallback).toHaveBeenCalledWith(event);
  });

  it('callbackが変更された時に最新のコールバックが使用される', () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(({ callback }) => useClickOutside(mockRef, callback), {
      initialProps: { callback: firstCallback },
    });

    // 要素外をクリック
    const outsideElement = document.createElement('div');
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: outsideElement,
      enumerable: true,
    });

    document.dispatchEvent(event);
    expect(firstCallback).toHaveBeenCalledWith(event);
    expect(secondCallback).not.toHaveBeenCalled();

    // コールバックを変更
    rerender({ callback: secondCallback });

    const secondEvent = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(secondEvent, 'target', {
      value: outsideElement,
      enumerable: true,
    });

    document.dispatchEvent(secondEvent);
    expect(secondCallback).toHaveBeenCalledWith(secondEvent);
    expect(firstCallback).toHaveBeenCalledTimes(1); // 前回の呼び出しのみ
  });

  it('refが変更された時に新しい要素で判定される', () => {
    const newElement = document.createElement('div');
    const newRef = { current: newElement };

    const { rerender } = renderHook(({ ref }) => useClickOutside(ref, mockCallback), {
      initialProps: { ref: mockRef },
    });

    // 最初の要素内をクリック（コールバックは呼ばれない）
    const insideOldElement = document.createElement('span');
    mockElement.appendChild(insideOldElement);

    let event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: insideOldElement,
      enumerable: true,
    });

    document.dispatchEvent(event);
    expect(mockCallback).not.toHaveBeenCalled();

    // refを変更
    rerender({ ref: newRef });

    // 古い要素内をクリック（今度はコールバックが呼ばれる）
    event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(event, 'target', {
      value: insideOldElement,
      enumerable: true,
    });

    document.dispatchEvent(event);
    expect(mockCallback).toHaveBeenCalledWith(event);
  });
});
