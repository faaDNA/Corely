'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { Button, type ButtonProps } from '@repo/ui';

/** Tombol submit dengan spinner + disable selama form action berjalan. */
export function SubmitButton({ children, disabled, ...props }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending || disabled} {...props}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
