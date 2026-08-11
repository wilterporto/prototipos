const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace 1.250 with 1.420
content = content.replace(/1\.250/g, '1.420');

// 2. Update Legend
const oldLegend = `<div style="display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700;">
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Professores</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Contratos</span>
                            </div>`;

const newLegend = `<div style="display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.8rem; font-weight: 700;">
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Magistério</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Afastamentos</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span> Afastamentos sem substituto</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px; display: inline-block;"></span> Déficit</span>
                            </div>`;

content = content.replace(oldLegend, newLegend);

// Update title
content = content.replace('Distribuição por Diretoria Regional (Professores vs. Contratos)', 'Distribuição por Diretoria Regional (Magistério, Afastamentos e Déficit)');
content = content.replace('Distribuição por Diretoria Regional (${rotuloSerie1} vs. ${rotuloSerie2})', 'Distribuição por Diretoria Regional (Visão Geral)');

// Update JS variables and functions

// Replace `professores` and `contratos` with new fields in the data objects
content = content.replace(/professores: (\d+),\s*contratos: (\d+)/g, (match, p1, p2) => {
    let mag = parseInt(p1);
    let cont = parseInt(p2);
    let afast = Math.floor(cont * 0.2) + 1;
    let afastSem = Math.floor(afast * 0.4);
    let def = Math.floor(cont * 0.3) + 2;
    return `magisterio: ${mag}, afastamentos: ${afast}, afastamentos_sem_substituto: ${afastSem}, deficit: ${def}`;
});

// Update dadosDrilldownPorSegmento
const oldDrilldownSegment = `const dadosDrilldownPorSegmento = {
            magisterio: dadosDrilldownRegionais,
            administrativo: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                professores: Math.round(r.professores * 0.3),
                contratos: Math.round(r.contratos * 0.3),
                escolas: r.escolas.map(e => ({ nome: e.nome, professores: Math.round(e.professores * 0.3), contratos: Math.round(e.contratos * 0.3) }))
            })),
            servidores: dadosDrilldownRegionais.map(r => ({
                id: r.id, nome: r.nome,
                professores: r.professores + Math.round(r.professores * 0.3),
                contratos: r.contratos + Math.round(r.contratos * 0.3),
                escolas: r.escolas.map(e => ({ nome: e.nome, professores: e.professores + Math.round(e.professores * 0.3), contratos: e.contratos + Math.round(e.contratos * 0.3) }))
            }))
        };`;

const newDrilldownSegment = `const dadosDrilldownPorSegmento = {
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

content = content.replace(oldDrilldownSegment, newDrilldownSegment);

// Replace renderizarGraficoDrilldown logic

const oldRenderLevel1 = `                let html = '';
                dadosAtuais.forEach(reg => {
                    const pctProf = (reg.professores / maxVal) * 100;
                    const pctCont = (reg.contratos / maxVal) * 100;

                    html += \`
                        <div onclick="executarDrilldownRegional('\${reg.id}')" style="display: flex; cursor: pointer; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; transition: background 0.2s;" onmouseover="this.style.background='#f8fafc';" onmouseout="this.style.background='transparent';">
                            <!-- Esquerda: Nome da Regional -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${reg.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <!-- Barra 1 (Professores) -->
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;">\${reg.professores}</span>
                                </div>
                                
                                <!-- Barra 2 (Contratos) -->
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctCont}%; background: #f59e0b; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;">\${reg.contratos}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

const newRenderLevel1 = `                let html = '';
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

content = content.replace(oldRenderLevel1, newRenderLevel1);


const oldRenderLevel2 = `                let html = '';
                regSelecionada.escolas.forEach(esc => {
                    const pctProf = (esc.professores / maxVal) * 100;
                    const pctCont = (esc.contratos / maxVal) * 100;

                    html += \`
                        <div style="display: flex; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; background: transparent;">
                            <!-- Esquerda: Nome da Escola -->
                            <div style="width: 160px; text-align: right; padding-right: 12px; display: flex; align-items: center; justify-content: flex-end;">
                                <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase;">\${esc.nome}</span>
                            </div>
                            
                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 4px; padding-top: 4px; padding-bottom: 4px;">
                                <!-- Barra 1 -->
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;">\${esc.professores}</span>
                                </div>

                                <!-- Barra 2 -->
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <div style="width: \${pctCont}%; background: #f59e0b; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;">\${esc.contratos}</span>
                                </div>
                            </div>
                        </div>
                    \`;
                });`;

const newRenderLevel2 = `                let html = '';
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

content = content.replace(oldRenderLevel2, newRenderLevel2);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update completed successfully.');
