const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const oldStr = `        // Executar renderização inicial do gráfico drilldown ao carregar
        document.addEventListener('DOMContentLoaded', function() {
            renderizarGraficoDrilldown();
        });`;

const newStr = `        // Executar renderização inicial do gráfico drilldown ao carregar
        document.addEventListener('DOMContentLoaded', function() {
            renderizarGraficoDrilldown();
            const tabAtiva = document.querySelector('.segment-tab.active');
            if (tabAtiva) selecionarSegmento(tabAtiva, 'magisterio');
        });`;

content = content.replace(oldStr, newStr);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully updated DOMContentLoaded');
