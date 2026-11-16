const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add legend
const legendSup = `<span id="legenda-superavit" onclick="toggleSerie('superavit')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #0ea5e9; border-radius: 3px; display: inline-block;"></span> Superávit</span>`;
const legendCompSem = `\n                                <span id="legenda-componentes_sem_substituto" onclick="toggleSerie('componentes_sem_substituto')" style="display: flex; align-items: center; gap: 6px; color: #334155; cursor: pointer; transition: opacity 0.2s;"><span style="width: 12px; height: 12px; background: #8b5cf6; border-radius: 3px; display: inline-block;"></span> Componentes sem substituto</span>`;
if (content.indexOf(legendCompSem) === -1) {
    content = content.replace(legendSup, legendSup + legendCompSem);
}

// 2. Update data array values
content = content.replace(/superavit: (\d+)(?!, componentes_sem_substituto)/g, (match, p1) => {
    let sup = parseInt(p1);
    let comp = Math.floor(sup * 0.8) + 2; 
    return `superavit: ${sup}, componentes_sem_substituto: ${comp}`;
});

// 3. Update dadosDrilldownPorSegmento mapping
const mapSupReg = `superavit: Math.round(r.superavit * 0.3)`;
const mapCompSemReg = `superavit: Math.round(r.superavit * 0.3),\n                componentes_sem_substituto: Math.round(r.componentes_sem_substituto * 0.3)`;
if (content.indexOf('componentes_sem_substituto: Math.round(r.componentes_sem_substituto * 0.3)') === -1) {
    content = content.replace(mapSupReg, mapCompSemReg);
}

const mapSupEsc = `superavit: Math.round(e.superavit * 0.3)`;
const mapCompSemEsc = `superavit: Math.round(e.superavit * 0.3),\n                    componentes_sem_substituto: Math.round(e.componentes_sem_substituto * 0.3)`;
if (content.indexOf('componentes_sem_substituto: Math.round(e.componentes_sem_substituto * 0.3)') === -1) {
    content = content.replace(mapSupEsc, mapCompSemEsc);
}

const mapSupReg2 = `superavit: r.superavit + Math.round(r.superavit * 0.3)`;
const mapCompSemReg2 = `superavit: r.superavit + Math.round(r.superavit * 0.3),\n                componentes_sem_substituto: r.componentes_sem_substituto + Math.round(r.componentes_sem_substituto * 0.3)`;
if (content.indexOf('componentes_sem_substituto: r.componentes_sem_substituto + Math.round(r.componentes_sem_substituto * 0.3)') === -1) {
    content = content.replace(mapSupReg2, mapCompSemReg2);
}

const mapSupEsc2 = `superavit: e.superavit + Math.round(e.superavit * 0.3)`;
const mapCompSemEsc2 = `superavit: e.superavit + Math.round(e.superavit * 0.3),\n                    componentes_sem_substituto: e.componentes_sem_substituto + Math.round(e.componentes_sem_substituto * 0.3)`;
if (content.indexOf('componentes_sem_substituto: e.componentes_sem_substituto + Math.round(e.componentes_sem_substituto * 0.3)') === -1) {
    content = content.replace(mapSupEsc2, mapCompSemEsc2);
}

// 4. renderizarGraficoDrilldown values calculation
const calcSupReg = `const pctSup = (reg.superavit / maxVal) * 100;`;
const calcCompSemReg = `const pctSup = (reg.superavit / maxVal) * 100;\n                    const pctCompSem = (reg.componentes_sem_substituto / maxVal) * 100;`;
if (content.indexOf('const pctCompSem = (reg.componentes_sem_substituto / maxVal) * 100;') === -1) {
    content = content.replace(calcSupReg, calcCompSemReg);
}

const calcSupEsc = `const pctSup = (esc.superavit / maxVal) * 100;`;
const calcCompSemEsc = `const pctSup = (esc.superavit / maxVal) * 100;\n                    const pctCompSem = (esc.componentes_sem_substituto / maxVal) * 100;`;
if (content.indexOf('const pctCompSem = (esc.componentes_sem_substituto / maxVal) * 100;') === -1) {
    content = content.replace(calcSupEsc, calcCompSemEsc);
}

// 5. renderizarGraficoDrilldown bars HTML
// Region bar
const barSupRegPattern = /<div style="display: \$\{seriesOcultas\.has\('superavit'\) \? 'none' : 'flex'\}; align-items: center; gap: 6px;">\s*<div style="width: \$\{pctSup\}%; background: #0ea5e9; height: 12px; border-radius: 2px; transition: width 0\.4s;"><\/div>\s*<span style="font-size: 0\.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\$\{reg\.superavit\}<\/span>\s*<\/div>/g;

const newBarReg = `<div style="display: \${seriesOcultas.has('superavit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${reg.superavit}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('componentes_sem_substituto') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctCompSem}%; background: #8b5cf6; height: 12px; border-radius: 2px; transition: width 0.4s;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Componentes sem substituto">\${reg.componentes_sem_substituto}</span>
                                </div>`;

if (content.indexOf("title=\"Componentes sem substituto\">${reg.componentes_sem_substituto}</span>") === -1) {
    content = content.replace(barSupRegPattern, newBarReg);
}

// School bar
const barSupEscPattern = /<div style="display: \$\{seriesOcultas\.has\('superavit'\) \? 'none' : 'flex'\}; align-items: center; gap: 6px;">\s*<div style="width: \$\{pctSup\}%; background: #0ea5e9; height: 12px; border-radius: 2px;"><\/div>\s*<span style="font-size: 0\.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\$\{esc\.superavit\}<\/span>\s*<\/div>/g;

const newBarEsc = `<div style="display: \${seriesOcultas.has('superavit') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctSup}%; background: #0ea5e9; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Superávit">\${esc.superavit}</span>
                                </div>
                                <div style="display: \${seriesOcultas.has('componentes_sem_substituto') ? 'none' : 'flex'}; align-items: center; gap: 6px;">
                                    <div style="width: \${pctCompSem}%; background: #8b5cf6; height: 12px; border-radius: 2px;"></div>
                                    <span style="font-size: 0.75rem; font-weight: 600; color: #1e293b;" title="Componentes sem substituto">\${esc.componentes_sem_substituto}</span>
                                </div>`;

if (content.indexOf("title=\"Componentes sem substituto\">${esc.componentes_sem_substituto}</span>") === -1) {
    content = content.replace(barSupEscPattern, newBarEsc);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Update completed successfully.');
