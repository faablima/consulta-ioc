const puppeteer = require('puppeteer');
const xlsx = require('xlsx') ;

let stateIp     ;
let isp         ;
let porcent     ;
let ipState     ;
let count = 0   ;

const workbook = xlsx.readFile('./dataFile.xlsx') ;
let worksheet = {};
let valores = [] ;

for(const sheet of workbook.SheetNames){
    worksheet[sheet] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]) ;
}

worksheet.list.map(item => {
    valores.push(item["lista"].toString()) ;
})

class CreateExcel {
    constructor(){}
    
    setWorksheet(ip, isp, url) {
        worksheet.good.push({
            "IP": ip,
            "ISP": isp,
            "STATE": "NÃO CONSTA EM BLACK-LIST",
            "REFERÊNCIA": url
        });

        xlsx.utils.sheet_add_json(workbook.Sheets["good"], worksheet.good);
        xlsx.writeFile(workbook, 'dataFile.xlsx') ;
    }

    setWorksheetBad(ip, isp, porcent, url) {
        worksheet.bad.push({
            "IP": ip,
            "ISP": isp,
            "CONFIANÇA DE ABUSO": porcent,
            "STATE": "CONSTA EM BLACK-LIST",
            "REFERÊNCIA": url
        });

        xlsx.utils.sheet_add_json(workbook.Sheets["bad"], worksheet.bad) ;
        xlsx.writeFile(workbook, 'dataFile.xlsx') ;
    }
}

const personalize = new CreateExcel() ;

async function goBot(dado) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    count = 1;

    for await(ip of dado) {
        
        try {
            
            let url = await `https://www.abuseipdb.com/check/${ip.replace(/\s/g, '')}` ;
            await page.goto(url) ; 

            ipState =   await `<b>${ip.replace(/\s/g, '')}</b> was not found in our database` ;    
            stateIp =   await page.evaluate(rep => document.querySelector(".well h3").innerHTML) ;

            isp     =   await page.evaluate(isp => document.querySelector(" .well table td").innerHTML) ;

            await (async () => {

                if(stateIp.indexOf(ipState) > -1){
                    await personalize.setWorksheet(ip.replace(/\s/g, ''), isp, url) ;
                    await console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}   -  Checado!`) ;
                }
                else {  
                    porcent = await page.evaluate(body => document.querySelector(".progress span").innerHTML);
                    await console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}   -  Checado!`);
                    await personalize.setWorksheetBad(ip.replace(/\s/g, ''), isp, porcent, url) ;
                }
            })();
        
        }catch(err) {
            console.log(`${count}->  IP: ${ip.replace(/\s/g, '')}  -  Privado ou Invalido`);
        }

        count += 1 ;
    }

    await browser.close() ;
};

goBot(valores) ;

