// Puppeteer faz interação com o Browser
const puppeteer = require('puppeteer');

// Interagir com a planilha
const xlsx = require('xlsx') ;

// Declara variáveis
let stateIp     ;
let isp         ;
let porcent     ;
let ipState     ;
let count = 0   ;

// Lê planilha XLSX e envia para constante workbook
const workbook = xlsx.readFile('./dataFile.xlsx') ;
let worksheet = {};
let valores = [] ;

// Itera entre as abas das planilhas
for(const sheet of workbook.SheetNames){
    // Para cada aba joga o seu identificador em sheet
    worksheet[sheet] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]) ;
}
// Itera sobre a coluna lista
worksheet.list.map(item => {
    // Durante a iteração adiciona cada IP a lista valores
    valores.push(item["lista"].toString()) ;
})

// Até aqui a aba list é lida e todos os IPs contidos é jogado na variável valores.

class CreateExcel {
    constructor(){}
    
    // Função para configurar o worksheet recebe as variáveis IP, ISP  e URL
    setWorksheet(ip, isp, url) {
        // Instancia objeto worksheet GOOD popula dados a partir das variáveis passadas na função
        worksheet.good.push({
            "IP": ip,
            "ISP": isp,
            "STATE": "NÃO CONSTA EM BLACK-LIST",
            "REFERÊNCIA": url
        });
        // Chama função do XLSX que adiciona JSON em planilhas XLSXs. E envia o objeto worksheet para a própria aba da planilha
        xlsx.utils.sheet_add_json(workbook.Sheets["good"], worksheet.good);
        // Escreve no arquivo dataFile.xlsx
        xlsx.writeFile(workbook, 'dataFile.xlsx') ;
    }

    // Função para configurar o worksheet de BAD IP's recebe as variáveis IP, ISP  e URL
    setWorksheetBad(ip, isp, porcent, url) {
        // Instancia objeto worksheet BAD popula dados a partir das variáveis passadas na função
        worksheet.bad.push({
            "IP": ip,
            "ISP": isp,
            "CONFIANÇA DE ABUSO": porcent,
            "STATE": "CONSTA EM BLACK-LIST",
            "REFERÊNCIA": url
        });

        // Chama função do XLSX que adiciona JSON em planilhas XLSXs. E envia o objeto worksheet para a própria aba da planilha
        xlsx.utils.sheet_add_json(workbook.Sheets["bad"], worksheet.bad) ;
        // Escreve no arquivo dataFile.xlsx
        xlsx.writeFile(workbook, 'dataFile.xlsx') ;
    }
}
// Instacia a classe de criação no excel na variável Cria Excell
const personalize = new CreateExcel() ;

// Instancia função que roda uma automatização de navegaçã
// 
//      NÃO É UMA REQUISIÇÃO À UMA API!!! 
//      É WEB-SCRAPING
// 
// 

async function goBot(dado) {
    // Inicializa Headless Chromium
    const browser = await puppeteer.launch();
    // Abre nova Tab
    const page = await browser.newPage();
    // Contador
    count = 1;
    // Itera sobre o conteúdo de dados
    for await(ip of dado) {
        
        try {
            // Acessa a API pelo instancia do Chromium
            let url = await `https://www.abuseipdb.com/check/${ip.replace(/\s/g, '')}` ;            
            await page.goto(url) ; 

            // Instacia variável com uma promessa da STRING '<ip>' was not found in our database
            //  ${ip.replace(/\s/g, '')} remove espaços indesejados lidos da planilha
            ipState =   await `<b>${ip.replace(/\s/g, '')}</b> was not found in our database` ;    
            // Instancia variável com uma promessa do conteúdo da página HTML ontem tem uma tag h3 dentro de uma tag de classe .well
            stateIp =   await page.evaluate(rep => document.querySelector(".well h3").innerHTML) ;
            // Instancia variável com uma promessa do conteúdo da página HTML ontem tem uma tag td dentro de uma table dentro de uma tag de classe .well
            isp     =   await page.evaluate(isp => document.querySelector(" .well table td").innerHTML) ;

            // Executa uma promessa
            await (async () => {
                // Se o conteúdo da tag h2.well (stateIp) não conter ipState (...not found...) 
                if(stateIp.indexOf(ipState) > -1){
                    // Joga os conteúdos de IP,  .well.table.td (isp) e url na instacia de excel (personalise) na worksheet GOOD
                    await personalize.setWorksheet(ip.replace(/\s/g, ''), isp, url) ;
                    // Printa no terminal
                    await console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}   -  Checado!`) ;
                }
                // Caso stateIp for NOT FOUND
                else {  
                    // Espera barra de progresso
                    porcent = await page.evaluate(body => document.querySelector(".progress span").innerHTML);
                    // Printa no terminal
                    await console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}   -  Checado!`);
                    // Joga os conteúdos de IP,  .well.table.td (isp) e url na instacia de excel (personalise) na worksheet BAD
                    await personalize.setWorksheetBad(ip.replace(/\s/g, ''), isp, porcent, url) ;
                }
            })();
        // Se o parâmetro for inválido
        }catch(err) {
            console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}  -  Privado ou Invalido`);
        }

        count += 1 ;
    }

    await browser.close() ;
};

goBot(valores) ;

