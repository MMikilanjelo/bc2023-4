const http = require("http");
const fs = require("fs");
const fastXmlParser = require('fast-xml-parser');
const host ='localhost';
const port = 8000;
const parser = new fastXmlParser.XMLParser();
const builder = new fastXmlParser.XMLBuilder();

function buildResponse(incomeTotalItem , OutComeTotalItem) {
  
  const xmlStructure = {
    data: {
      indicators: [
        {
          txt: incomeTotalItem  ? incomeTotalItem.txt : '',
          value: incomeTotalItem  ? incomeTotalItem.value : '',
        },
        {
          txt:  OutComeTotalItem ? OutComeTotalItem.txt : '',
          value:  OutComeTotalItem? OutComeTotalItem.value : '',
        },
      ],
    },
  };
  const responce =  builder.build(xmlStructure);
  return responce;
}


function parseXml() {
  fs.readFile("D:/BackEndUni/Lab4/bc2023-4/data.xml", 'UTF-8', (err, xmlData) => {
    if (err) {
      console.error("Something went wrong", err);
      return;
    }

    const parsedData = parser.parse(xmlData);
    const banksincexpElements = parsedData.indicators.banksincexp;
    
    const incomeTotalElement = banksincexpElements.find((item) => item.id_api === 'BS2_IncomeTotal');
    const OutComeTotalElemnt = banksincexpElements.find((item) => item.id_api === 'BS2_ExpensesTotal');
    let responce = buildResponse (incomeTotalElement , OutComeTotalElemnt);
      console.log(responce);
    return responce;
  });
}









//http://localhost:8000
const requestListener = function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/xml' });

  parseXml((err, response) => {
    if (err) {
      res.end(err.message);
    } else {
      res.end(response);
    }
  });
  
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

