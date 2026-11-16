const fs = require('fs');

const indexHtml = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');
const origHtml = fs.readFileSync('c:/Users/supervisao/source/prototipos/original_index.html', 'utf8');

const s2Marker = '<!-- === SEÇÃO B2: DIVERSIDADE E DEMOGRAFIA === -->';
// Let's find the end of the demografia section in indexHtml
// Since I deleted starting from some grid, let's just find the last card of Demografia.
const demografiaEndMarker = '<!-- Top 5 Países de Origem (Estrangeiros) -->';
const demoEndIdx = indexHtml.indexOf(demografiaEndMarker);
const afterDemo = indexHtml.indexOf('</div>', demoEndIdx) + 6;
// Add a few more div closures just in case
const exactEnd = indexHtml.indexOf('</div>', afterDemo + 10) + 6;

const userChangesBlock = indexHtml.substring(indexHtml.indexOf(s2Marker), exactEnd);

const origS2Idx = origHtml.indexOf(s2Marker);
const origExactEnd = origHtml.indexOf(indexHtml.substring(exactEnd, exactEnd + 100)); // Find corresponding place in original? No, original has a different order for Top 5!

// In original_index.html, the demographic section ends before "<!-- === SEÇÃO B3: QUANTITATIVO E GESTÃO OPERACIONAL === -->"
const origS3Idx = origHtml.indexOf('<!-- === SEÇÃO B3: QUANTITATIVO E GESTÃO OPERACIONAL === -->');

// In indexHtml, the block we want to copy is from s2Marker to wherever the next section starts.
// But the next section (S3) might be missing.
// What was before S3 in original?
const beforeS3 = origHtml.substring(origS3Idx - 200, origS3Idx);
console.log('Before S3 in original:', beforeS3);

// Let's just find `<!-- === SEÇÃO B2:` up to `<!-- === SEÇÃO B3:` in original, and we will replace it with the user changes block.
// But how do we find the end of the user changes block in indexHtml?
// The user changes block ends EXACTLY where my `undo.js` started deleting!
// `undo.js` started deleting at the FIRST grid marker after 100000.
const gridMarker = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">';
const deleteStart = indexHtml.indexOf(gridMarker, 100000);

// Wait, the grid marker I used to delete WAS the demographic grid!
// If I deleted the demographic grid, then `index.html` doesn't even HAVE the demographic cards!
console.log('Includes Top 5 Paises:', indexHtml.includes('Top 5 Países'));
