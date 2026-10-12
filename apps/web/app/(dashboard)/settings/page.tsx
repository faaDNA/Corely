import { redirect } from 'next/navigation';
import { requireProfile } from '@/lib/profile';
import { SettingsClient } from './settings-client';

export default async function SettingsPage() {
  const profile = await requireProfile();
  return <SettingsClient initialProfile={profile} />;
}