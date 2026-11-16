const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

const target1 = 'Afastamentos por Motivo';
const target6 = 'Tipo de Deficiência (PCD)';

const idx1 = html.indexOf(target1);
const idx6 = html.indexOf(target6);

const card1Start = html.lastIndexOf('<!--', idx1); // e.g. <!-- Card 3: Afastamentos -->
const card6EndTag = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', idx6) + 6) + 6) + 6) + 6) + 6;

// Let's just find exactly where the next section starts, or exactly 5 closing divs after PCD
// Actually, it's easier to find the next HTML comment.
const nextComment = html.indexOf('<!--', idx6);
const card6End = html.lastIndexOf('</div>', nextComment) + 6;

const block = html.substring(card1Start, card6End);
const newBlock = '\\n<!-- INICIO GRID 3x2 -->\\n<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; width: 100%;">\\n' + block + '\\n</div>\\n<!-- FIM GRID 3x2 -->\\n';

html = html.substring(0, card1Start) + newBlock + html.substring(card6End);
fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', html, 'utf8');
console.log('Grid applied!');
