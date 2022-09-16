// Puppeteer faz interação com o Browser
const puppeteer = require('puppeteer');
const sdk = require('api')('@virustotal/v3.0#1mk70h3zl6yyhea6');

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

    // Função para configurar o worksheet com a resposta do VirusATotal
    setWorksheetVirusTotal(response) {
        data = {}
        var data = {}
        var columns = []        
        columns = Object.keys(response.data.attributes.last_analysis_stats) + Object.keys(response.data.attributes.last_analysis_results) 
        console.log(columns);


        // Instancia objeto worksheet BAD popula dados a partir das variáveis passadas na função
        worksheet.virustotal.push(
            {
                'harmless': response.data.attributes.last_analysis_stats.harmless,
                'malicious': response.data.attributes.last_analysis_stats.malicious,
                'suspicious': response.data.attributes.last_analysis_stats.suspicious,
                'undetected': response.data.attributes.last_analysis_stats.undetected,
                'timeout': response.data.attributes.last_analysis_stats.timeoutCMC, 
                'CMC Threat Intelligence': response.data.attributes.last_analysis_results['CMC Threat Intelligence']['result'],
                'Snort IP sample list': response.data.attributes.last_analysis_results['Snort IP sample list']['result'],
                '0xSI_f33d': response.data.attributes.last_analysis_results['0xSI_f33d']['result'] ,
                'Armis': response.data.attributes.last_analysis_results['Armis']['result'] ,
                'ViriBack': response.data.attributes.last_analysis_results['ViriBack']['result'] ,
                'Comodo Valkyrie Verdict': response.data.attributes.last_analysis_results['Comodo Valkyrie Verdict']['result'] ,
                'PhishLabs': response.data.attributes.last_analysis_results['PhishLabs']['result'] ,
                'K7AntiVirus': response.data.attributes.last_analysis_results['K7AntiVirus']['result'] ,
                'CINS Army': response.data.attributes.last_analysis_results['CINS Army']['result'] ,
                'Quttera': response.data.attributes.last_analysis_results['Quttera']['result'] ,
                'OpenPhish': response.data.attributes.last_analysis_results['OpenPhish']['result'] ,
                'VX Vault': response.data.attributes.last_analysis_results['VX Vault']['result'] ,
                'Web Security Guard': response.data.attributes.last_analysis_results['Web Security Guard']['result'],
                'Scantitan': response.data.attributes.last_analysis_results['Scantitan']['result'] ,
                'AlienVault': response.data.attributes.last_analysis_results['AlienVault']['result'] ,
                'Sophos': response.data.attributes.last_analysis_results['Sophos']['result'] ,
                'Phishtank': response.data.attributes.last_analysis_results['Phishtank']['result'] ,
                'EonScope': response.data.attributes.last_analysis_results['EonScope']['result'] ,
                'Cyan': response.data.attributes.last_analysis_results['Cyan']['result'] ,
                'Spam404': response.data.attributes.last_analysis_results['Spam404']['result'] ,
                'SecureBrain': response.data.attributes.last_analysis_results['SecureBrain']['result'] ,
                'Hoplite Industries': response.data.attributes.last_analysis_results['Hoplite Industries']['result'] ,
                'AutoShun': response.data.attributes.last_analysis_results['AutoShun']['result'] ,
                'Fortinet': response.data.attributes.last_analysis_results['Fortinet']['result'] ,
                'alphaMountain.ai': response.data.attributes.last_analysis_results['alphaMountain.ai']['result'] ,
                'Lionic': response.data.attributes.last_analysis_results['Lionic']['result'] ,
                'Cyble': response.data.attributes.last_analysis_results['Cyble']['result'] ,
                'Seclookup': response.data.attributes.last_analysis_results['Seclookup']['result'] ,
                'Virusdie External Site Scan': response.data.attributes.last_analysis_results['Virusdie External Site Scan']['result'] ,
                'Google Safebrowsing': response.data.attributes.last_analysis_results['Google Safebrowsing']['result'] ,
                'SafeToOpen': response.data.attributes.last_analysis_results['SafeToOpen']['result'] ,
                'ADMINUSLabs': response.data.attributes.last_analysis_results['ADMINUSLabs']['result'] ,
                'CyberCrime': response.data.attributes.last_analysis_results['CyberCrime']['result'] ,
                'Juniper Networks': response.data.attributes.last_analysis_results['Juniper Networks']['result'],
                'Heimdal Security': response.data.attributes.last_analysis_results['Heimdal Security']['result'],
                'CRDF': response.data.attributes.last_analysis_results['CRDF']['result'] ,
                'Trustwave': response.data.attributes.last_analysis_results['Trustwave']['result'],
                'AICC (MONITORAPP)': response.data.attributes.last_analysis_results['AICC (MONITORAPP)']['result'],
                'CyRadar': response.data.attributes.last_analysis_results['CyRadar']['result'],
                'Dr.Web': response.data.attributes.last_analysis_results['Dr.Web']['result'],
                'Emsisoft': response.data.attributes.last_analysis_results['Emsisoft']['result'],
                'Abusix': response.data.attributes.last_analysis_results['Abusix']['result'],
                'Webroot': response.data.attributes.last_analysis_results['Webroot']['result'],
                'Avira': response.data.attributes.last_analysis_results['Avira']['result'],
                'securolytics': response.data.attributes.last_analysis_results['securolytics']['result'],
                'Antiy-AVL': response.data.attributes.last_analysis_results['Antiy-AVL']['result'],
                'Acronis': response.data.attributes.last_analysis_results['Acronis']['result'],
                'Quick Heal': response.data.attributes.last_analysis_results['Quick Heal']['result'],
                'URLQuery': response.data.attributes.last_analysis_results['URLQuery']['result'],
                'Viettel Threat Intelligence': response.data.attributes.last_analysis_results['Viettel Threat Intelligence']['result'],
                'DNS8': response.data.attributes.last_analysis_results['DNS8']['result'],
                'benkow.cc': response.data.attributes.last_analysis_results['benkow.cc']['result'],
                'EmergingThreats': response.data.attributes.last_analysis_results['EmergingThreats']['result'],
                'Chong Lua Dao': response.data.attributes.last_analysis_results['Chong Lua Dao']['result'],
                'Yandex Safebrowsing': response.data.attributes.last_analysis_results['Yandex Safebrowsing']['result'],
                'MalwareDomainList': response.data.attributes.last_analysis_results['MalwareDomainList']['result'],
                'Lumu': response.data.attributes.last_analysis_results['Lumu']['result'],
                'zvelo': response.data.attributes.last_analysis_results['zvelo']['result'],
                'Kaspersky': response.data.attributes.last_analysis_results['Kaspersky']['result'],
                'Segasec': response.data.attributes.last_analysis_results['Segasec']['result'],
                'Sucuri SiteCheck': response.data.attributes.last_analysis_results['Sucuri SiteCheck']['result'],
                'desenmascara.me': response.data.attributes.last_analysis_results['desenmascara.me']['result'],
                'URLhaus': response.data.attributes.last_analysis_results['URLhaus']['result'],
                'PREBYTES': response.data.attributes.last_analysis_results['PREBYTES']['result'],
                'StopForumSpam': response.data.attributes.last_analysis_results['StopForumSpam']['result'],
                'Blueliv': response.data.attributes.last_analysis_results['Blueliv']['result'],
                'Netcraft': response.data.attributes.last_analysis_results['Netcraft']['result'],
                'ZeroCERT': response.data.attributes.last_analysis_results['ZeroCERT']['result'],
                'Phishing Database': response.data.attributes.last_analysis_results['Phishing Database']['result'],
                'MalwarePatrol': response.data.attributes.last_analysis_results['MalwarePatrol']['result'],
                'MalBeacon': response.data.attributes.last_analysis_results['MalBeacon']['result'],
                'IPsum': response.data.attributes.last_analysis_results['IPsum']['result'],
                'Malwared': response.data.attributes.last_analysis_results['Malwared']['result'],
                'BitDefender': response.data.attributes.last_analysis_results['BitDefender']['result'],
                'GreenSnow': response.data.attributes.last_analysis_results['BitDefender']['result'],
                'G-Data': response.data.attributes.last_analysis_results['G-Data']['result'],
                'StopBadware': response.data.attributes.last_analysis_results['StopBadware']['result'],
                'SCUMWARE.org': response.data.attributes.last_analysis_results['SCUMWARE.org']['result'],
                'ESTsecurity': response.data.attributes.last_analysis_results['ESTsecurity']['result'],
                'malwares.com URL checker': response.data.attributes.last_analysis_results['malwares.com URL checker']['result'],
                'NotMining': response.data.attributes.last_analysis_results['NotMining']['result'],
                'Forcepoint ThreatSeeker': response.data.attributes.last_analysis_results['Forcepoint ThreatSeeker']['result'],
                'Certego': response.data.attributes.last_analysis_results['Certego']['result'],
                'ESET': response.data.attributes.last_analysis_results['ESET']['result'],
                'Threatsourcing': response.data.attributes.last_analysis_results['Threatsourcing']['result'],
                'MalSilo': response.data.attributes.last_analysis_results['MalSilo']['result'],
                'Nucleon': response.data.attributes.last_analysis_results['Nucleon']['result'],
                'BADWARE.INFO': response.data.attributes.last_analysis_results['BADWARE.INFO']['result'],
                'ThreatHive': response.data.attributes.last_analysis_results['ThreatHive']['result'],
                'FraudScore': response.data.attributes.last_analysis_results['FraudScore']['result'],
                'Tencent': response.data.attributes.last_analysis_results['Tencent']['result'],
                'Bfore.Ai PreCrime': response.data.attributes.last_analysis_results['Bfore.Ai PreCrime']['result'],
                'Baidu-International': response.data.attributes.last_analysis_results['Baidu-International']['result'] ,

            }
        );

        // Chama função do XLSX que adiciona JSON em planilhas XLSXs. E envia o objeto worksheet para a própria aba da planilha
        xlsx.utils.sheet_add_json(workbook.Sheets["virustotal"], worksheet.virustotal) ;
        
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


function getVirusTotal(dado) {
    console.log("====================== VIRUS TOTAL API =======================================")
    for (ip of dado) {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'x-apikey': '9321d18aa13c78df0a395d903a9033a173e8ef5d3966ee26cc9d812837982502' // Chave pessoal
            }
          };
          
          fetch(`https://www.virustotal.com/api/v3/ip_addresses/${ip.replace(/\s/g, '')}`, options)
            .then(response => response.json())
            .then(response => {                
                console.log(response);
                personalize.setWorksheetVirusTotal(response);
            })                
            .catch(err => console.error(err));
    }

}

goBot(valores);
getVirusTotal(valores);
