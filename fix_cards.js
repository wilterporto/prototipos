const fs = require('fs');

const html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

const modStartIdx = html.indexOf('<!-- Card: Situação de Modulação da Força de Trabalho -->');
const lotStartIdx = html.indexOf('<!-- KPI / Barra: Status de Lotação -->');
const taxaModIdx = html.indexOf('<!-- Resumo Indicador Visual Proporcional -->\r\n                                <div\r\n                                    style=\"margin-top: 4px; background: #f8fafc;');
// Fallback if \r\n fails
const taxaModIdx2 = html.indexOf('<!-- Resumo Indicador Visual Proporcional -->\n                                <div\n                                    style=\"margin-top: 4px; background: #f8fafc;');
const actualTaxaModIdx = taxaModIdx !== -1 ? taxaModIdx : (taxaModIdx2 !== -1 ? taxaModIdx2 : html.indexOf('<!-- Resumo Indicador Visual Proporcional -->'));

const vinculoStartIdx = html.indexOf('<!-- Barras Empilhadas: Vínculo e Carga Horária -->');
const taxaLotIdx = html.indexOf('<!-- Resumo Indicador Visual Proporcional (Taxa de Lotação) -->');
const endAllIdx = html.indexOf('<!-- Barras Verticais: Funções de Gestão');

// Extract pieces
const modTitleBars = html.substring(modStartIdx, lotStartIdx);

let taxaModEndIdx = html.indexOf('</div>', actualTaxaModIdx);
taxaModEndIdx = html.indexOf('</div>', taxaModEndIdx + 1) + 6; // closes the taxa mod div

const lotTitleBars = html.substring(lotStartIdx, actualTaxaModIdx);
const taxaMod = html.substring(actualTaxaModIdx, taxaModEndIdx);

const vinculoBlock = html.substring(vinculoStartIdx, taxaLotIdx);

let taxaLotEndIdx = html.indexOf('</div>', taxaLotIdx);
taxaLotEndIdx = html.indexOf('</div>', taxaLotEndIdx + 1) + 6; // closes taxa lot div

const taxaLot = html.substring(taxaLotIdx, taxaLotEndIdx);

// Build new HTML correctly
const newLotacaoCard = lotTitleBars + '\n' + taxaLot + '\n                            </div>\n                        </div>\n\n                        ';
const newModulacaoCard = modTitleBars + '\n' + taxaMod + '\n                            </div>\n                        </div>\n\n                        ';
const newVinculoCard = vinculoBlock + '\n';

const before = html.substring(0, modStartIdx);
// We need to find the correct ending index. endAllIdx is the start of next card.
// We should replace up to endAllIdx (or close to it)
let replaceEndIdx = endAllIdx;
// Find the exact line before endAllIdx
while(html[replaceEndIdx-1] === ' ' || html[replaceEndIdx-1] === '\n' || html[replaceEndIdx-1] === '\r') {
    replaceEndIdx--;
}

const after = html.substring(replaceEndIdx);

const finalHtml = before + newLotacaoCard + newModulacaoCard + newVinculoCard + '\n                        ' + after;

fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', finalHtml, 'utf8');
console.log('Restructured successfully!');
