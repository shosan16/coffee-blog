import * as React from 'react';

export const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  callback: (event: MouseEvent) => void
): void => {
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (!ref.current || !ref.current.contains(event.target as Node)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return (): void => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback]);
};
