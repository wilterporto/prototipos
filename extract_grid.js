const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/original_index.html', 'utf8');

const target1 = 'Afastamentos por Motivo';
const target6 = 'Tipo de Deficiência (PCD)';

const idx1 = html.indexOf(target1);
const idx6 = html.indexOf(target6);

// Find the start of the card for target1
const card1Start = html.lastIndexOf('<div', idx1);
const parentDiv = html.lastIndexOf('<div', card1Start - 1);
const grandParent = html.lastIndexOf('<div', parentDiv - 1);

console.log(html.substring(grandParent, idx1));
