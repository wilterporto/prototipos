const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Find the start of function selecionarSegmento
const startIndex = content.indexOf('function selecionarSegmento(element, segmento) {');
if (startIndex === -1) {
    console.error('Could not find function selecionarSegmento');
    process.exit(1);
}

// Find the end of it, which is before `function atualizarCardAtuacao`
const endIndex = content.indexOf('function atualizarCardAtuacao', startIndex);

if (endIndex === -1) {
    console.error('Could not find end of function');
    process.exit(1);
}

// We know the end is `    }\n\n        function atualizarCardAtuacao`
const functionText = content.substring(startIndex, endIndex);

// Now we can replace the entire body inside the function after `nivelDrilldownAtual = 'RAIZ';`
const splitMarker = "nivelDrilldownAtual = 'RAIZ';";
const splitPos = functionText.indexOf(splitMarker);
if (splitPos === -1) {
    console.error('Could not find split point');
    process.exit(1);
}

const beforeSplit = functionText.substring(0, splitPos + splitMarker.length);

const newLogic = `

            // Atualizar Métricas dos Cards
            const v1 = document.getElementById('kpi-val-1');
            const v2 = document.getElementById('kpi-val-2');
            const v2_5 = document.getElementById('kpi-val-2-5');
            const l3 = document.getElementById('kpi-lbl-3');
            const v3 = document.getElementById('kpi-val-3');
            const l4 = document.getElementById('kpi-lbl-4');
            const v4 = document.getElementById('kpi-val-4');
            const v5 = document.getElementById('kpi-val-5');
            const v6 = document.getElementById('kpi-val-6');
            
            // Alternar visibilidade de cards exclusivos do Administrativo
            const cardGestao = document.getElementById('card-funcoes-gestao');
            const cardApoio = document.getElementById('card-apoio-operacional');
            if (segmento === 'administrativo') {
                if (cardGestao) cardGestao.style.display = 'block';
                if (cardApoio) cardApoio.style.display = 'block';
                if (l3) l3.innerText = 'DÉFICIT ADMINISTRATIVO';
                if (l4) l4.innerText = 'SUPERÁVIT ADMINISTRATIVO';
            } else if (segmento === 'servidores') {
                if (cardGestao) cardGestao.style.display = 'none';
                if (cardApoio) cardApoio.style.display = 'none';
                if (l3) l3.innerText = 'DÉFICIT GERAL';
                if (l4) l4.innerText = 'SUPERÁVIT GERAL';
            } else {
                if (cardGestao) cardGestao.style.display = 'none';
                if (cardApoio) cardApoio.style.display = 'none';
                if (l3) l3.innerText = 'DÉFICIT MAGISTÉRIO';
                if (l4) l4.innerText = 'SUPERÁVIT MAGISTÉRIO';
            }

            // Calculate dynamic totals from data
            const dadosAtuais = dadosDrilldownPorSegmento[segmento] || dadosDrilldownPorSegmento.magisterio;
            let sumProf = 0, sumAfast = 0, sumAfastSem = 0, sumDef = 0, sumSup = 0;
            dadosAtuais.forEach(reg => {
                sumProf += reg.professores || 0;
                sumAfast += reg.afastamentos || 0;
                sumAfastSem += reg.afastamentos_sem_substituto || 0;
                sumDef += reg.deficit || 0;
                sumSup += reg.superavit || 0;
            });

            if (v1) v1.innerText = sumProf.toLocaleString('pt-BR');
            if (v2) v2.innerText = sumAfast.toLocaleString('pt-BR');
            if (v2_5) v2_5.innerText = sumAfastSem.toLocaleString('pt-BR');
            if (v3) v3.innerText = sumDef.toLocaleString('pt-BR');
            if (v4) v4.innerText = sumSup.toLocaleString('pt-BR');

            // Set fixed texts for other charts for simplicity
            if (segmento === 'administrativo') {
                if (v5) v5.innerText = '85';
                if (v6) v6.innerText = '85';
                atualizarCardAtuacao('284', '86,3%', '245', '13,7%', '39');
                atualizarCardFormacao('284', 
                    { qtd: '55', pct: '19,4%' }, 
                    { qtd: '95', pct: '33,5%' }, 
                    { qtd: '10', pct: '3,5%' }, 
                    { qtd: '4', pct: '1,4%' }, 
                    { qtd: '110', pct: '38,7%' },
                    { qtd: '10', pct: '3,5%' }
                );
                atualizarCardLocalizacao(
                    { qtd: '258', pct: '90,8%' },
                    { qtd: '14', pct: '4,9%' },
                    { qtd: '6', pct: '2,1%' },
                    { qtd: '4', pct: '1,4%' },
                    { qtd: '2', pct: '0,7%' }
                );
                atualizarCardModulacao('284',
                    { qtd: '265', pct: '93,3%' },
                    { qtd: '19', pct: '6,7%' }
                );
                atualizarCardLotacao('284',
                    { qtd: '258', pct: '90,8%' },
                    { qtd: '26', pct: '9,2%' }
                );
                atualizarCardFuncoesProf('0',
                    { qtd: '0', pct: '0,0%' },
                    { qtd: '0', pct: '0,0%' },
                    { qtd: '0', pct: '0,0%' }
                );
                atualizarCardFundebBeneficio('284',
                    { qtd: '180', pct: '63,4%' },
                    { qtd: '45', pct: '15,8%' }
                );
                atualizarCardComponentes('85',
                    { qtd: '0', pct: '0,0%' },
                    { qtd: '0', pct: '0,0%' },
                    { qtd: '0', pct: '0,0%' },
                    { qtd: '0', pct: '0,0%' }
                );
                atualizarCardPCD('7',
                    { qtd: '3', pct: '42,9%' },
                    { qtd: '2', pct: '28,6%' },
                    { qtd: '1', pct: '14,3%' },
                    { qtd: '1', pct: '14,3%' },
                    { qtd: '0', pct: '0,0%' }
                );
                atualizarAlertasCadastro('2', '10', '1', '2', '4', '6', '7', '1', '0', '1', '0');
            } else if (segmento === 'servidores') {
                if (v5) v5.innerText = '440';
                if (v6) v6.innerText = '980';
                atualizarCardAtuacao('1.420', '81,0%', '1.150', '19,0%', '270');
                atualizarCardFormacao('1.420', 
                    { qtd: '680', pct: '47,9%' }, 
                    { qtd: '490', pct: '34,5%' }, 
                    { qtd: '150', pct: '10,6%' }, 
                    { qtd: '45', pct: '3,2%' }, 
                    { qtd: '40', pct: '2,8%' },
                    { qtd: '15', pct: '1,0%' }
                );
                atualizarCardLocalizacao(
                    { qtd: '1.280', pct: '90,1%' },
                    { qtd: '72', pct: '5,1%' },
                    { qtd: '38', pct: '2,7%' },
                    { qtd: '22', pct: '1,5%' },
                    { qtd: '8', pct: '0,6%' }
                );
                atualizarCardModulacao('1.420',
                    { qtd: '1.340', pct: '94,4%' },
                    { qtd: '80', pct: '5,6%' }
                );
                atualizarCardLotacao('1.420',
                    { qtd: '1.365', pct: '96,1%' },
                    { qtd: '55', pct: '3,9%' }
                );
                atualizarCardFuncoesProf('1.420',
                    { qtd: '720', pct: '57,6%' },
                    { qtd: '380', pct: '30,4%' },
                    { qtd: '150', pct: '12,0%' }
                );
                atualizarCardFundebBeneficio('1.420',
                    { qtd: '1.300', pct: '91,5%' },
                    { qtd: '355', pct: '25,0%' }
                );
                atualizarCardComponentes('440',
                    { qtd: '135', pct: '30,7%' },
                    { qtd: '125', pct: '28,4%' },
                    { qtd: '95', pct: '21,6%' },
                    { qtd: '85', pct: '19,3%' }
                );
                atualizarCardPCD('45',
                    { qtd: '20', pct: '44,4%' },
                    { qtd: '12', pct: '26,7%' },
                    { qtd: '8', pct: '17,8%' },
                    { qtd: '3', pct: '6,7%' },
                    { qtd: '2', pct: '4,4%' }
                );
                atualizarAlertasCadastro('12', '48', '3', '8', '19', '34', '42', '5', '0', '2', '16');
            } else {
                if (v5) v5.innerText = '13';
                if (v6) v6.innerText = '13';
                atualizarCardAtuacao('1.420', '78,4%', '980', '21,6%', '270');
                atualizarCardFormacao('1.420', 
                    { qtd: '620', pct: '49,6%' }, 
                    { qtd: '410', pct: '32,8%' }, 
                    { qtd: '145', pct: '11,6%' }, 
                    { qtd: '45', pct: '3,6%' }, 
                    { qtd: '20', pct: '1,6%' },
                    { qtd: '10', pct: '0,8%' }
                );
                atualizarCardLocalizacao(
                    { qtd: '1.125', pct: '90,0%' },
                    { qtd: '65', pct: '5,2%' },
                    { qtd: '35', pct: '2,8%' },
                    { qtd: '18', pct: '1,4%' },
                    { qtd: '7', pct: '0,6%' }
                );
                atualizarCardModulacao('1.420',
                    { qtd: '1.185', pct: '94,8%' },
                    { qtd: '65', pct: '5,2%' }
                );
                atualizarCardLotacao('1.420',
                    { qtd: '1.180', pct: '94,4%' },
                    { qtd: '70', pct: '5,6%' }
                );
                atualizarCardFuncoesProf('1.420',
                    { qtd: '720', pct: '57,6%' },
                    { qtd: '380', pct: '30,4%' },
                    { qtd: '150', pct: '12,0%' }
                );
                atualizarCardFundebBeneficio('1.420',
                    { qtd: '1.120', pct: '89,6%' },
                    { qtd: '310', pct: '24,8%' }
                );
                atualizarCardComponentes('440',
                    { qtd: '135', pct: '30,7%' },
                    { qtd: '125', pct: '28,4%' },
                    { qtd: '95', pct: '21,6%' },
                    { qtd: '85', pct: '19,3%' }
                );
                atualizarCardPCD('38',
                    { qtd: '17', pct: '44,7%' },
                    { qtd: '10', pct: '26,3%' },
                    { qtd: '7', pct: '18,4%' },
                    { qtd: '2', pct: '5,3%' },
                    { qtd: '2', pct: '5,3%' }
                );
                atualizarAlertasCadastro('10', '38', '2', '6', '15', '28', '35', '4', '0', '1', '16');
            }

            renderizarGraficoDrilldown();

            const toast = document.getElementById('toast-sucesso');
            if (toast) {
                toast.innerHTML = \`<i class="fa-solid fa-layer-group" style="margin-right: 8px;"></i> Exibindo segmento: \${element.innerText}\`;
                toast.style.display = 'block';
                setTimeout(() => { toast.style.display = 'none'; }, 3000);
            }
        
`;

const finalNewFunction = beforeSplit + newLogic;

content = content.replace(functionText, finalNewFunction);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully updated KPIs robustly');
