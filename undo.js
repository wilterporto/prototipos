const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');
let original = fs.readFileSync('c:/Users/supervisao/source/prototipos/original_index.html', 'utf8');

const startMarker = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 20px;">';
const endMarker = '<!-- Barras Verticais: Funções de Gestão';

const origStart = original.indexOf(startMarker, 100000); // make sure it's the right grid
const origEnd = original.indexOf(endMarker, origStart);
const origBlock = original.substring(origStart, origEnd);

const htmlStart = html.indexOf(startMarker, 100000);
const htmlEnd = html.indexOf(endMarker, htmlStart);

const htmlBefore = html.substring(0, htmlStart);
const htmlAfter = html.substring(htmlEnd);

const finalHtml = htmlBefore + origBlock + htmlAfter;
fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', finalHtml, 'utf8');
console.log('Undone changes successfully!');
