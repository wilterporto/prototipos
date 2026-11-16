const fs = require('fs');

let orig = fs.readFileSync('c:/Users/supervisao/source/prototipos/original_index.html', 'utf8');
let current = fs.readFileSync('c:/Users/supervisao/source/prototipos/index.html', 'utf8');

// 1. Replace the first KPI card (Total de Servidores) with the updated version (322)
const origKpiStart = orig.indexOf('<!-- KPI / Card 1: Total de Servidores');
const origKpiEnd = orig.indexOf('<!-- KPI / Card 2', origKpiStart);

const curKpiStart = current.indexOf('<!-- KPI / Card 1:');
const curKpiEnd = current.indexOf('<!-- KPI / Card 2', curKpiStart);

let finalHtml = orig.substring(0, origKpiStart) + 
                current.substring(curKpiStart, curKpiEnd) + 
                orig.substring(origKpiEnd);

// 2. Replace the Demographics grid
const origDemoStart = finalHtml.indexOf('<!-- Card: Localização');
const origDemoGridStart = finalHtml.lastIndexOf('<div', origDemoStart);
const origDemoEnd = finalHtml.indexOf('</div>', finalHtml.indexOf('<!-- Top 5 Países')) + 6;
// Wait, Top 5 is not the last one in original. Let's just find the end of the grid.
const endOfDemoGrid = finalHtml.indexOf('</section>', origDemoGridStart) - 10; // Actually, let's just find the start of the next section.
const origSec3 = finalHtml.indexOf('<!-- === SEÇÃO B3:');
const origDemoGridEnd = finalHtml.lastIndexOf('</div>', origSec3 - 10);

const curDemoStart = current.indexOf('<!-- Card: Localização');
const curDemoGridStart = current.lastIndexOf('<div', curDemoStart);
// In current, Top 5 is the last one.
const curTop5 = current.indexOf('<!-- Top 5 Países');
const curDemoGridEnd = current.indexOf('</div>', current.indexOf('</div>', current.indexOf('</div>', curTop5) + 6) + 6) + 6;

// Let's just do a simpler approach: the previous agent only swapped the contents of the 3 demographic cards!
// It's much easier to just re-do the 3 demographic cards swap on finalHtml!
