const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

// 1. KPI 1: Servidores com Contrato Rescindido
html = html.replace(
    /<!-- KPI 1 -->[\s\S]*?<div style="font-size: 0\.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total de Servidores na Rede<\/div>\s*<div style="font-size: 2\.2rem; font-weight: 800; color: var\(--primary\); margin-top: 5px;">1\.420<\/div>\s*<div style="font-size: 0\.75rem; color: #10b981; font-weight: 600; margin-top: 2px;">\s*<i class="fa-solid fa-arrow-trend-up"><\/i> 100% Ativos e Cadastrados\s*<\/div>\s*<\/div>\s*<div style="width: 55px; height: 55px; background: #eef4fc; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var\(--primary\); font-size: 1\.6rem; flex-shrink: 0;">\s*<i class="fa-solid fa-users"><\/i>\s*<\/div>/,
    '<!-- KPI 1 -->\\n' +
    '                        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">\\n' +
    '                            <div>\\n' +
    '                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Servidores com Contrato Rescindido</div>\\n' +
    '                                <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-top: 5px;">322</div>\\n' +
    '                                <div style="font-size: 0.75rem; color: #ef4444; font-weight: 600; margin-top: 2px;">\\n' +
    '                                    <i class="fa-solid fa-user-xmark"></i> Contratos rescindidos\\n' +
    '                                </div>\\n' +
    '                            </div>\\n' +
    '                            <div style="width: 55px; height: 55px; background: #eef4fc; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 1.6rem; flex-shrink: 0;">\\n' +
    '                                <i class="fa-solid fa-users"></i>\\n' +
    '                            </div>'
);

// 2. Servidores sem contrato (add after KPI 1)
const newCard = '</div>\\n\\n' +
    '                        <!-- KPI 1.5: Servidores sem contrato -->\\n' +
    '                        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between;">\\n' +
    '                            <div>\\n' +
    '                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Servidores sem contrato</div>\\n' +
    '                                <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-top: 5px;">423</div>\\n' +
    '                                <div style="font-size: 0.75rem; color: #ef4444; font-weight: 600; margin-top: 2px;">\\n' +
    '                                    <i class="fa-solid fa-user-minus"></i> Sem vínculo ativo\\n' +
    '                                </div>\\n' +
    '                            </div>\\n' +
    '                            <div style="width: 55px; height: 55px; background: #fef2f2; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 1.6rem; flex-shrink: 0;">\\n' +
    '                                <i class="fa-solid fa-file-excel"></i>\\n' +
    '                            </div>';
html = html.replace('</div>\\n\\n                        <!-- KPI 2: PcD com ícone acessibilidade -->', newCard + '\\n\\n                        <!-- KPI 2: PcD com ícone acessibilidade -->');


// 3. Grid wrapper for the 6 cards!
const startCard = '<!-- Card 3: Afastamentos -->';
const endCard = '<!-- Tipo de Deficiência (PCD) -->';
const idxStart = html.indexOf(startCard);
const idxEnd = html.indexOf(endCard);

if (idxStart !== -1 && idxEnd !== -1) {
    const startDiv = html.lastIndexOf('<div', idxStart);
    // Find end of PCD card
    const endDiv = html.indexOf('</div>', html.indexOf('</div>', html.indexOf('</div>', idxEnd) + 6) + 6) + 6;

    const cardsBlock = html.substring(startDiv, endDiv);
    const newBlock = '\\n                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; width: 100%;">\\n' +
                     cardsBlock +
                     '\\n                        </div>';
    
    html = html.substring(0, startDiv) + newBlock + html.substring(endDiv);
} else {
    console.log('Could not find startCard or endCard for grid wrapper!');
}

fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', html, 'utf8');
console.log('Applied successfully!');
