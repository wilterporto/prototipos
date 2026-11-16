const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

const strModulacao = '<!-- Card: Situação de Modulação da Força de Trabalho -->';
const strVinculo = '<!-- Barras Empilhadas: Vínculo e Carga Horária -->';
const strLotacao = '<!-- KPI / Barra: Status de Lotação -->';
const strFuncoes = '<!-- Barras Verticais: Funções de Gestão (Visível apenas em Administrativo) -->';

const idxModulacao = html.indexOf(strModulacao);
const idxVinculo = html.indexOf(strVinculo);
const idxLotacao = html.indexOf(strLotacao);
const idxFuncoes = html.indexOf(strFuncoes);

// We want to move Lotação to be before Modulação.
// So the order should be: Lotação, Modulação, Vínculo.
// The chunk to replace is from idxModulacao up to idxFuncoes.

// Let's find the exact boundaries:
const block1 = html.substring(idxModulacao, idxVinculo);
const block2 = html.substring(idxVinculo, idxLotacao);
const block3 = html.substring(idxLotacao, idxFuncoes);

// Put them in new order: block3, block1, block2
const newContent = block3 + block1 + block2;

html = html.substring(0, idxModulacao) + newContent + html.substring(idxFuncoes);

fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', html, 'utf8');
console.log('Swapped Lotação and Modulação successfully.');
