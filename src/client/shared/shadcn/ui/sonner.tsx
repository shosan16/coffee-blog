'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export default function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--toast-bg': 'var(--muted)',
          '--toast-text': 'var(--foreground)',
          '--toast-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
