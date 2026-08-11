const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the legend to have onclick handlers and IDs
const oldLegend = `<div style="display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; flex-wrap: wrap;">
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Professores</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Afastamentos</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span> Afastamentos sem substituto</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px; display: inline-block;"></span> Déficit</span>
                                <span style="display: flex; align-items: center; gap: 6px; color: #334155;"><span style="width: 12px; height: 12px; background: #0ea5e9; border-radius: 3px; display: inline-block;"></span> Superávit</span>
                            </div>`;

const newLegend = `<div style="display: flex; gap: 15px; font-size: 0.8rem; font-weight: 700; flex-wrap: wrap;">
                                <span id="legenda-professores" onclick="toggleSerie('professores')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 3px; display: inline-block;"></span> Professores</span>
                                <span id="legenda-afastamentos" onclick="toggleSerie('afastamentos')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #f59e0b; border-radius: 3px; display: inline-block;"></span> Afastamentos</span>
                                <span id="legenda-afastamentos_sem_substituto" onclick="toggleSerie('afastamentos_sem_substituto')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #ef4444; border-radius: 3px; display: inline-block;"></span> Afastamentos sem substituto</span>
                                <span id="legenda-deficit" onclick="toggleSerie('deficit')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #10b981; border-radius: 3px; display: inline-block;"></span> Déficit</span>
                                <span id="legenda-superavit" onclick="toggleSerie('superavit')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #0ea5e9; border-radius: 3px; display: inline-block;"></span> Superávit</span>
                            </div>`;

content = content.replace(oldLegend, newLegend);


// 2. Add `let seriesOcultas = new Set(); function toggleSerie(...) ...` in the JS block
const toggleScript = `
        let seriesOcultas = new Set();
        function toggleSerie(serieId) {
            if (seriesOcultas.has(serieId)) {
                seriesOcultas.delete(serieId);
                document.getElementById('legenda-' + serieId).style.opacity = '1';
                document.getElementById('legenda-' + serieId).style.textDecoration = 'none';
            } else {
                seriesOcultas.add(serieId);
                document.getElementById('legenda-' + serieId).style.opacity = '0.4';
                document.getElementById('legenda-' + serieId).style.textDecoration = 'line-through';
            }
            renderizarGraficoDrilldown();
        }
        
        let segmentoContextoAtual = 'magisterio';`;

content = content.replace("let segmentoContextoAtual = 'magisterio';", toggleScript);


// 3. Update the `renderizarGraficoDrilldown` function to use `seriesOcultas` and reduce `gap: 4px` to `gap: 1px`
// For Level 1
const oldRender1 = `                            <!-- Direita: Barras -->
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
                            </div>`;

const newRender1 = `                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 1px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: \${seriesOcultas.has('professores') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Professores">\${reg.professores}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('afastamentos') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${reg.afastamentos}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('afastamentos_sem_substituto') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${reg.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('deficit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${reg.deficit}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('superavit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${reg.superavit}</span>
                                </div>
                            </div>`;

content = content.replace(oldRender1, newRender1);


// For Level 2
const oldRender2 = `                            <!-- Direita: Barras -->
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
                            </div>`;

const newRender2 = `                            <!-- Direita: Barras -->
                            <div style="flex: 1; border-left: 1px solid #cbd5e1; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 1px; padding-top: 4px; padding-bottom: 4px;">
                                <div style="display: \${seriesOcultas.has('professores') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctProf}%; background: #3b82f6; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Professores">\${esc.professores}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('afastamentos') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfast}%; background: #f59e0b; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos">\${esc.afastamentos}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('afastamentos_sem_substituto') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctAfastSem}%; background: #ef4444; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Afastamentos sem substituto">\${esc.afastamentos_sem_substituto}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('deficit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctDef}%; background: #10b981; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Déficit">\${esc.deficit}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('superavit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${esc.superavit}</span>
                                </div>
                            </div>`;

content = content.replace(oldRender2, newRender2);


fs.writeFileSync(filePath, content, 'utf8');
console.log('Gap reduced to 1px and toggling logic applied successfully.');
