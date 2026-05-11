'use client';

import { type ReactNode } from 'react';
import { QueryProvider }        from './QueryProvider';
import { ThemeProvider }        from './ThemeProvider';
import { AuthProvider }         from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';

interface Props { children: ReactNode; }

export function AppProviders({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}