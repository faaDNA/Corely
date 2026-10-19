/**
 * Transform teks catatan polos → markdown yang mempertahankan apa yang user lihat di textarea:
 * - `\r\n` → `\n`
 * - paragraf tepat di atas list tanpa baris kosong → ditandai `TIGHT` (rapat, margin paragraf dimatikan
 *   saat render). Kalau user menulis baris kosong, tanpa tanda → jarak paragraf normal.
 * - `\n{3,}` → paragraf `&nbsp;` (baris kosong ekstra tidak dibuang Markdown)
 * - `\n` tunggal → hard break `  \n` (tanpa ini Markdown ubah jadi spasi)
 *
 * Catatan: baris teks tepat DI BAWAH item list tanpa baris kosong jadi kelanjutan `<li>` (rapat, dan
 * rata kiri karena list-style-position: inside). Baris kosong memisahkannya jadi `<p>` sendiri.
 */
export const TIGHT = '\u200B';

const LIST_ITEM = /^ {0,3}(?:[-*+]|\d+[.)])(?:\s|$)/;
// blok Markdown lain (heading, quote, fence, tabel, hr, html, code indent) — jangan ditandai
const OTHER_BLOCK = /^(#{1,6}\s|>|```|~~~|<|\|| {4}|\t| {0,3}(?:-{3,}|\*{3,}|_{3,})\s*$)/;

function plainParagraphLine(line: string): boolean {
  return line !== '' && !/^\s/.test(line) && !LIST_ITEM.test(line) && !OTHER_BLOCK.test(line);
}

export function withHardBreaks(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n');

  for (let j = 1; j < lines.length; j++) {
    if (!LIST_ITEM.test(lines[j]) || !plainParagraphLine(lines[j - 1])) continue;
    let k = j - 1; // mundur ke awal paragraf
    while (k > 0 && plainParagraphLine(lines[k - 1])) k--;
    lines[k] = TIGHT + lines[k];
  }

  return lines
    .join('\n')
    .replace(/\n{3,}/g, (match) => '\n\n' + '&nbsp;\n\n'.repeat(match.length - 2))
    .split('\n\n')
    .map((part) => part.replace(/\n/g, '  \n'))
    .join('\n\n');
}