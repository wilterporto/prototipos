const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Revert "Magistério" in the legend to "Professores" and add "Superávit"
const oldLegend = `<div style="display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; flex-wrap: wrap;">
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Magistério</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Afastamentos</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span> Afastamentos sem substituto</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px; display: inline-block;"></span> Déficit</span>
                            </div>`;

const newLegend = `<div style="display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; flex-wrap: wrap;">
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Professores</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Afastamentos</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span> Afastamentos sem substituto</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px; display: inline-block;"></span> Déficit</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #0ea5e9; border-radius: 3px; display: inline-block;"></span> Superávit</span>
                            </div>`;

content = content.replace(oldLegend, newLegend);

// Update title back if it was changed
// Before: Distribuição por Diretoria Regional (Magistério, Afastamentos e Déficit)
// Now: Distribuição por Diretoria Regional (Visão Geral)
content = content.replace('Distribuição por Diretoria Regional (Magistério, Afastamentos e Déficit)', 'Distribuição por Diretoria Regional (Visão Geral)');


// 2. Change `magisterio` back to `professores` and add `superavit` to the raw data objects
// It currently looks like: `magisterio: 142, afastamentos: 44, afastamentos_sem_substituto: 17, deficit: 66`
content = content.replace(/magisterio:\s*(\d+),\s*afastamentos:\s*(\d+),\s*afastamentos_sem_substituto:\s*(\d+),\s*deficit:\s*(\d+)/g, (match, p1, p2, p3, p4) => {
    let sup = Math.floor(parseInt(p4) * 0.5); // Just some mock calculation
    return `professores: ${p1}, afastamentos: ${p2}, afastamentos_sem_substituto: ${p3}, deficit: ${p4}, superavit: ${sup}`;
});

// 3. Update dadosDrilldownPorSegmento mapping
const oldDrilldownSegment = `const dadosDrilldownPorSegmento = {
            magisterio: dadosDrilldownRegionais,
            administrativo: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                magisterio: Math.round(r.magisterio * 0.3),
                afastamentos: Math.round(r.afastamentos * 0.3),
                afastamentos_sem_substituto: Math.round(r.afastamentos_sem_substituto * 0.3),
                deficit: Math.round(r.deficit * 0.3),
                escolas: r.escolas.map(e => ({ 
                    nome: e.nome, 
                    magisterio: Math.round(e.magisterio * 0.3), 
                    afastamentos: Math.round(e.afastamentos * 0.3),
                    afastamentos_sem_substituto: Math.round(e.afastamentos_sem_substituto * 0.3),
                    deficit: Math.round(e.deficit * 0.3)
                }))
            })),
            servidores: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                magisterio: r.magisterio + Math.round(r.magisterio * 0.3),
                afastamentos: r.afastamentos + Math.round(r.afastamentos * 0.3),
                afastamentos_sem_substituto: r.afastamentos_sem_substituto + Math.round(r.afastamentos_sem_substituto * 0.3),
                deficit: r.deficit + Math.round(r.deficit * 0.3),
                escolas: r.escolas.map(e => ({ 
                    nome: e.nome, 
                    magisterio: e.magisterio + Math.round(e.magisterio * 0.3), 
                    afastamentos: e.afastamentos + Math.round(e.afastamentos * 0.3),
                    afastamentos_sem_substituto: e.afastamentos_sem_substituto + Math.round(e.afastamentos_sem_substituto * 0.3),
                    deficit: e.deficit + Math.round(e.deficit * 0.3)
                }))
            }))
        };`;

const newDrilldownSegment = `const dadosDrilldownPorSegmento = {
            magisterio: dadosDrilldownRegionais,
            administrativo: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                professores: Math.round(r.professores * 0.3),
                afastamentos: Math.round(r.afastamentos * 0.3),
                afastamentos_sem_substituto: Math.round(r.afastamentos_sem_substituto * 0.3),
                deficit: Math.round(r.deficit * 0.3),
                superavit: Math.round(r.superavit * 0.3),
                escolas: r.escolas.map(e => ({ 
                    nome: e.nome, 
                    professores: Math.round(e.professores * 0.3), 
                    afastamentos: Math.round(e.afastamentos * 0.3),
                    afastamentos_sem_substituto: Math.round(e.afastamentos_sem_substituto * 0.3),
                    deficit: Math.round(e.deficit * 0.3),
                    superavit: Math.round(e.superavit * 0.3)
                }))
            })),
            servidores: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                professores: r.professores + Math.round(r.professores * 0.3),
                afastamentos: r.afastamentos + Math.round(r.afastamentos * 0.3),
                afastamentos_sem_substituto: r.afastamentos_sem_substituto + Math.round(r.afastamentos_sem_substituto * 0.3),
                deficit: r.deficit + Math.round(r.deficit * 0.3),
                superavit: r.superavit + Math.round(r.superavit * 0.3),
                escolas: r.escolas.map(e => ({ 
                    nome: e.nome, 
                    professores: e.professores + Math.round(e.professores * 0.3), 
                    afastamentos: e.afastamentos + Math.round(e.afastamentos * 0.3),
                    afastamentos_sem_substituto: e.afastamentos_sem_substituto + Math.round(e.afastamentos_sem_substituto * 0.3),
                    deficit: e.deficit + Math.round(e.deficit * 0.3),
                    superavit: e.superavit + Math.round(e.superavit * 0.3)
                }))
            }))
        };`;

content = content.replace(oldDrilldownSegment, newDrilldownSegment);


// 4. Update the Javascript logic to render the 5 bars instead of 4, changing `magisterio` to `professores`.

const oldRenderLevel1 = `                let html = '';
                dadosAtuais.forEach(reg => {
                    const pctMag = (reg.magisterio / maxVal) * 100;
                    const pctAfast = (reg.afastamentos / maxVal) * 100;
                    const pctAfastSem = (reg.afastamentos_sem_substituto / maxVal) * 100;
                    const pctDef = (reg.deficit / maxVal) * 100;

                    html += \`
                        <div onclick="executarDrilldownRegional('\${reg.id}')" style="display: flex; cursor: pointer; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                            <!-- Esquerda: Nome da Regional -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${reg.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctMag}%; background: #3b82f6; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Magistério">\${reg.magisterio}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${reg.afastamentos}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${reg.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${reg.deficit}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

const newRenderLevel1 = `                let html = '';
                dadosAtuais.forEach(reg => {
                    const pctProf = (reg.professores / maxVal) * 100;
                    const pctAfast = (reg.afastamentos / maxVal) * 100;
                    const pctAfastSem = (reg.afastamentos_sem_substituto / maxVal) * 100;
                    const pctDef = (reg.deficit / maxVal) * 100;
                    const pctSup = (reg.superavit / maxVal) * 100;

                    html += \`
                        <div onclick="executarDrilldownRegional('\${reg.id}')" style="display: flex; cursor: pointer; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                            <!-- Esquerda: Nome da Regional -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${reg.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Professores">\${reg.professores}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${reg.afastamentos}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${reg.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${reg.deficit}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${reg.superavit}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

content = content.replace(oldRenderLevel1, newRenderLevel1);

const oldRenderLevel2 = `                let html = '';
                regSelecionada.escolas.forEach(esc => {
                    const pctMag = (esc.magisterio / maxVal) * 100;
                    const pctAfast = (esc.afastamentos / maxVal) * 100;
                    const pctAfastSem = (esc.afastamentos_sem_substituto / maxVal) * 100;
                    const pctDef = (esc.deficit / maxVal) * 100;

                    html += \`
                        <div style="display: flex; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; background: transparent;">
                            <!-- Esquerda: Nome da Escola -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${esc.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctMag}%; background: #3b82f6; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Magistério">\${esc.magisterio}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${esc.afastamentos}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${esc.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${esc.deficit}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

const newRenderLevel2 = `                let html = '';
                regSelecionada.escolas.forEach(esc => {
                    const pctProf = (esc.professores / maxVal) * 100;
                    const pctAfast = (esc.afastamentos / maxVal) * 100;
                    const pctAfastSem = (esc.afastamentos_sem_substituto / maxVal) * 100;
                    const pctDef = (esc.deficit / maxVal) * 100;
                    const pctSup = (esc.superavit / maxVal) * 100;

                    html += \`
                        <div style="display: flex; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; background: transparent;">
                            <!-- Esquerda: Nome da Escola -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${esc.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Professores">\${esc.professores}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${esc.afastamentos}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${esc.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${esc.deficit}</span>
                                </div>
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${esc.superavit}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

content = content.replace(oldRenderLevel2, newRenderLevel2);


fs.writeFileSync(filePath, content, 'utf8');
console.log('Update reverted magisterio -> professores and added superavit successfully.');
