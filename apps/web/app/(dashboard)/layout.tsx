import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { getProfile } from '@/lib/profile';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Data pencarian (Ctrl+K) di-fetch on-demand oleh GlobalSearch — lihat components/global-search.tsx
  const profile = await getProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}