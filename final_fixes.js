const fs = require('fs');
let html = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

// 1. Fix 423
if (!html.includes('423')) {
    const kpi2Start = html.indexOf('<!-- KPI 2:');
    if (kpi2Start !== -1) {
        const divBeforeKpi2 = html.lastIndexOf('</div>', kpi2Start);
        const newCard = '\\n\\n' +
            '                        <!-- KPI 1.5: Servidores sem contrato -->\\n' +
            '                        <div style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">\\n' +
            '                            <div>\\n' +
            '                                <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Servidores sem contrato</div>\\n' +
            '                                <div style="font-size: 2.2rem; font-weight: 800; color: var(--primary); margin-top: 5px;">423</div>\\n' +
            '                                <div style="font-size: 0.75rem; color: #ef4444; font-weight: 600; margin-top: 2px;">\\n' +
            '                                    <i class="fa-solid fa-user-minus"></i> Sem vínculo ativo\\n' +
            '                                </div>\\n' +
            '                            </div>\\n' +
            '                            <div style="width: 55px; height: 55px; background: #fef2f2; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 1.6rem; flex-shrink: 0;">\\n' +
            '                                <i class="fa-solid fa-file-excel"></i>\\n' +
            '                            </div>\\n' +
            '                        </div>\\n';
        
        html = html.substring(0, divBeforeKpi2 + 6) + newCard + html.substring(kpi2Start);
    }
}

// 2. Fix Grid
// Wait, is "Afastamentos" inside a grid now? 
if (!html.includes('<!-- INICIO GRID 3x2 -->')) {
    const t1 = 'Afastamentos por Motivo';
    const t6 = 'Tipo de Deficiência (PCD)';
    
    const idx1 = html.indexOf(t1);
    const idx6 = html.indexOf(t6);
    
    // Find exact start and end
    const card1Start = html.lastIndexOf('<!--', idx1); // finds '<!-- Card 3: Afastamentos -->'
    const nextCommentAfter6 = html.indexOf('<!--', idx6); // finds the next comment
    const card6End = html.lastIndexOf('</div>', nextCommentAfter6) + 6;
    
    const block = html.substring(card1Start, card6End);
    const newBlock = '\\n<!-- INICIO GRID 3x2 -->\\n<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; width: 100%;">\\n' + block + '\\n</div>\\n<!-- FIM GRID 3x2 -->\\n';
    
    html = html.substring(0, card1Start) + newBlock + html.substring(card6End);
}

fs.writeFileSync('c:/Users/supervisao/source/prototipos/index.html', html, 'utf8');
