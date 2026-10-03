import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Hello, User!</h1>
        <p className="mt-1 text-sm text-slate-400">
          Welcome back to your personal productivity workspace.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Ready</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">
            Sprint 0 selesai. Widget dashboard akan ditambahkan pada Sprint 1.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}