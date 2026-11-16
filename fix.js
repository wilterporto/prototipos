const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

// 1. Fix grid-column
html = html.replace(
  '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; width: 100%;">',
  '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; width: 100%; grid-column: 1 / -1;">'
);

// 2. Remove the premature FIM GRID 3x2
html = html.replace(
  '</div>\r\n<!-- FIM GRID 3x2 -->',
  ''
);
// Also it might be \n instead of \r\n
html = html.replace(
  '</div>\n<!-- FIM GRID 3x2 -->',
  ''
);

// 3. Add the FIM GRID 3x2 at the correct location
const targetStr = '                    </div>\r\n                </div>\r\n\r\n                <!-- SUBSEÇÃO B3: ALERTAS DE CADASTRO E QUALIDADE DE DADOS -->';
const targetStr2 = '                    </div>\n                </div>\n\n                <!-- SUBSEÇÃO B3: ALERTAS DE CADASTRO E QUALIDADE DE DADOS -->';

if (html.includes(targetStr)) {
  html = html.replace(targetStr, '</div>\r\n<!-- FIM GRID 3x2 -->\r\n\r\n' + targetStr);
} else if (html.includes(targetStr2)) {
  html = html.replace(targetStr2, '</div>\n<!-- FIM GRID 3x2 -->\n\n' + targetStr2);
}

fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', html, 'utf8');
console.log('Fixed index.html structure');
