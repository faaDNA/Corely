export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950" aria-busy="true" aria-label="Memuat">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500" />
        <div className="h-3 w-40 animate-pulse rounded-md bg-slate-800" />
      </div>
    </div>
  );
}