'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, User, Palette, SlidersHorizontal, LogOut, Check, Lock } from 'lucide-react';
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
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => setMounted(true), []);

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!profile.name.trim() || !profile.nickname.trim()) {
      toast('Nama dan nama panggilan wajib diisi.');
      return;
    }
    toast('Profil berhasil disimpan (dummy).');
  }

  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pw.current || !pw.next || !pw.confirm) {
      toast('Lengkapi semua field password.');
      return;
    }
    if (pw.next.length < 6) {
      toast('Password baru minimal 6 karakter.');
      return;
    }
    if (pw.next !== pw.confirm) {
      toast('Konfirmasi password tidak cocok.');
      return;
    }
    if (pw.current === pw.next) {
      toast('Password baru harus berbeda dari yang lama.');
      return;
    }
    toast('Password berhasil diubah (dummy).');
    setPw({ current: '', next: '', confirm: '' });
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
    'w-full rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none';

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan</h1>
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
              {(profile.nickname || profile.name).charAt(0).toUpperCase()}
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="s-name" className="text-xs font-medium text-slate-600 dark:text-slate-300">Nama</label>
                <input id="s-name" placeholder="Nama lengkap" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="s-nickname" className="text-xs font-medium text-slate-600 dark:text-slate-300">Nama Panggilan</label>
                <input id="s-nickname" placeholder="Nama panggilan" value={profile.nickname} onChange={(e) => setProfile((p) => ({ ...p, nickname: e.target.value }))} className={inputCls} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="s-email" className="text-xs font-medium text-slate-600 dark:text-slate-300">Email</label>
                <input id="s-email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="sm"><Check className="mr-2 h-4 w-4" />Simpan Profil</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Ubah Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><Lock className="h-4 w-4 text-amber-500" />Ubah Password</CardTitle>
          <CardDescription>Ganti password akun Anda. (dummy — tidak mengubah auth sungguhan)</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={savePassword} className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="s-pw-current" className="text-xs font-medium text-slate-600 dark:text-slate-300">Password Saat Ini</label>
              <input id="s-pw-current" type="password" placeholder="••••••••" autoComplete="current-password" value={pw.current} onChange={(e) => setPw((v) => ({ ...v, current: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="s-pw-next" className="text-xs font-medium text-slate-600 dark:text-slate-300">Password Baru</label>
              <input id="s-pw-next" type="password" placeholder="Minimal 6 karakter" autoComplete="new-password" value={pw.next} onChange={(e) => setPw((v) => ({ ...v, next: e.target.value }))} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="s-pw-confirm" className="text-xs font-medium text-slate-600 dark:text-slate-300">Konfirmasi Password Baru</label>
              <input id="s-pw-confirm" type="password" placeholder="Ulangi password baru" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((v) => ({ ...v, confirm: e.target.value }))} className={inputCls} />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
              <Button type="submit" size="sm"><Check className="mr-2 h-4 w-4" />Simpan Password</Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toast('Instruksi reset password dikirim ke email Anda (dummy).')}
              >
                Lupa Password?
              </Button>
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
                  mounted && theme === key ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-400' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-slate-700'
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
            <label htmlFor="s-date" className="text-xs font-medium text-slate-600 dark:text-slate-300">Format Tanggal</label>
            <select id="s-date" value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} className={inputCls}>
              <option value="id-ID">DD/MM/YYYY (Indonesia)</option>
              <option value="en-US">MM/DD/YYYY (US)</option>
              <option value="ISO">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="s-time" className="text-xs font-medium text-slate-600 dark:text-slate-300">Format Jam</label>
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
