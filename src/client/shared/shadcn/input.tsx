import * as React from 'react';

import { cn } from '@/client/lib/tailwind';

export default function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-primary/30 bg-card disabled:border-border flex h-9 w-full min-w-0 rounded-md border-2 px-3 py-1 text-base shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'hover:border-primary/50',
        'focus-visible:border-primary focus-visible:ring-ring/20 focus-visible:ring-2',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}
