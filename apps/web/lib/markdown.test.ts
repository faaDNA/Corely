import assert from 'node:assert/strict';
import { TIGHT, withHardBreaks } from './markdown.ts';

// 1. paragraf tepat di atas list tanpa baris kosong → ditandai TIGHT (rapat)
assert.equal(withHardBreaks('judul\n- a'), TIGHT + 'judul  \n- a');
assert.equal(withHardBreaks('judul\nsub\n- a'), TIGHT + 'judul  \nsub  \n- a');
// baris kosong di atas list → tanpa tanda (jarak paragraf normal)
assert.equal(withHardBreaks('judul\n\n- a'), 'judul\n\n- a');

// 2. teks tepat di bawah item list → kelanjutan <li> (rapat), baris kosong → paragraf sendiri
assert.equal(withHardBreaks('- a\nb'), '- a  \nb');
assert.equal(withHardBreaks('1. a\nb'), '1. a  \nb');
assert.equal(withHardBreaks('- a\n\nb'), '- a\n\nb');

// 3. antar baris teks biasa tetap hard break, list bisa menyela
assert.equal(withHardBreaks('a\nb'), 'a  \nb');
assert.equal(withHardBreaks('a\n- b'), TIGHT + 'a  \n- b');

// 4. item list berurutan tetap satu list
assert.equal(withHardBreaks('- a\n- b'), '- a  \n- b');
assert.equal(withHardBreaks('1. a\n2. b'), '1. a  \n2. b');

// 5. baris terinden di bawah item → kelanjutan item
assert.equal(withHardBreaks('- a\n  lanjut'), '- a  \n  lanjut');

// 6. paragraf kosong ekstra tetap ada (jangan dibuang Markdown)
assert.equal(withHardBreaks('a\n\n\nb'), 'a\n\n&nbsp;\n\nb');

// 7. CRLF dinormalkan
assert.equal(withHardBreaks('- a\r\nb'), '- a  \nb');

// 8. heading di atas list tidak ditandai
assert.equal(withHardBreaks('# Judul\n- a'), '# Judul  \n- a');

console.log('markdown.test.ts OK');