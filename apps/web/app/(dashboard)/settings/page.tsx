'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, User, Palette, SlidersHorizontal, LogOut, Check } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, cn } from '@repo/ui';
import { logout } from '@/app/(auth)/actions';
import { toast } from '@/components/toast';
import { mockUser } from '@/lib/mock-data';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(mockUser);
  const [dateFormat, setDateFormat] = useState('id-ID');
  const [timeFormat, setTimeFormat] = useState('24h');

  useEffect(() => setMounted(true), []);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    toast('Profil berhasil disimpan (dummy).');
  }

  function savePreferences() {
    toast('Preferensi tersimpan (dummy).');
  }

  const themeOptions = [
    { key: 'light', label: 'Terang', icon: Sun },
    { key: 'dark', label: 'Gelap', icon: Moon },
    { key: 'system', label: 'Sistem', icon: Monitor },
  ] as const;

  const inputCls =
    'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-400">Kelola profil, tampilan, dan preferensi aplikasi.</p>
      </header>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4 text-blue-400" />Profil</CardTitle>
          <CardDescription>Informasi akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProfile} className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="s-name" className="text-xs font-medium text-slate-300">Nama</label>
                <input id="s-name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="s-email" className="text-xs font-medium text-slate-300">Email</label>
                <input id="s-email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="sm"><Check className="mr-2 h-4 w-4" />Simpan Profil</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4 text-purple-400" />Tampilan</CardTitle>
          <CardDescription>Pilih tema terang, gelap, atau ikuti sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4 text-left transition',
                  mounted && theme === key ? 'border-blue-600 bg-blue-600/10 text-blue-400' : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
                {mounted && theme === key && <Check className="ml-auto h-4 w-4" />}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><SlidersHorizontal className="h-4 w-4 text-emerald-400" />Preferensi</CardTitle>
          <CardDescription>Format dan tampilan default.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="s-date" className="text-xs font-medium text-slate-300">Format Tanggal</label>
            <select id="s-date" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className={inputCls}>
              <option value="id-ID">DD/MM/YYYY (Indonesia)</option>
              <option value="en-US">MM/DD/YYYY (US)</option>
              <option value="ISO">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="s-time" className="text-xs font-medium text-slate-300">Format Jam</label>
            <select id="s-time" value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} className={inputCls}>
              <option value="24h">24 jam</option>
              <option value="12h">12 jam (AM/PM)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Button size="sm" variant="outline" onClick={savePreferences}><Check className="mr-2 h-4 w-4" />Simpan Preferensi</Button>
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Akun</CardTitle>
          <CardDescription>Kelola sesi dan akun Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logout}>
            <Button type="submit" variant="danger" size="sm"><LogOut className="mr-2 h-4 w-4" />Keluar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}