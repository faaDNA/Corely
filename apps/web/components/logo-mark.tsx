// Simbol Corely: huruf C ditutup centang. Warna ikut `currentColor` (atur via text-*).
// Geometri sama dengan app/icon.svg — ubah keduanya bersamaan.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="72 72 368 368"
      fill="none"
      stroke="currentColor"
      strokeWidth={68}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M377 326 A140 140 0 1 1 326 135" />
      <path d="M196 262 L248 314 L392 190" />
    </svg>
  );
}
