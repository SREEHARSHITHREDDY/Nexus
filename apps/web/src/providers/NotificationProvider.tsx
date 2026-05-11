'use client';

import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            border: '1px solid rgba(0,194,255,0.2)',
            backdropFilter: 'blur(12px)',
          },
          className: 'glass',
          duration: 4000,
        }}
      />
    </>
  );
}