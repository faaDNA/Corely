import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { getProfile } from '@/lib/profile';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await getProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}
