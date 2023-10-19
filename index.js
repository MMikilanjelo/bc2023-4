const http = require("http");
const fs = require("fs");
const fastXmlParser = require('fast-xml-parser');

const host = 'localhost';
const port = 8000;
const parser = new fastXmlParser.XMLParser();
const builder = new fastXmlParser.XMLBuilder();

function buildResponse(incomeTotalItem, OutComeTotalItem) {
  const xmlStructure = {
    data: {
      indicators: [
        {
          txt: incomeTotalItem ? incomeTotalItem.txt : '',
          value: incomeTotalItem ? incomeTotalItem.value : '',
        },
        {
          txt: OutComeTotalItem ? OutComeTotalItem.txt : '',
          value: OutComeTotalItem ? OutComeTotalItem.value : '',
        },
      ],
    },
  };
  const response = builder.build(xmlStructure);
  return response;
}

function filterXmlData(banksincexpElements, fieldToFilter, itemid) {
  return banksincexpElements.find((item) => item[fieldToFilter] === itemid);
}

function parseXml(callback) {
  fs.readFile("D:/BackEndUni/Lab4/bc2023-4/data.xml", 'UTF-8', (err, xmlData) => {
    if (err) {
      console.error("Something went wrong", err);
      callback(err, null);
    } else {
      const parsedData = parser.parse(xmlData);
      const banksincexpElements = parsedData.indicators.banksincexp;
      const incomeTotalElement = filterXmlData(banksincexpElements, "id_api", "BS2_IncomeTotal");
      const OutComeTotalElemnt = filterXmlData(banksincexpElements, "id_api", "BS2_ExpensesTotal");
      const response = buildResponse(incomeTotalElement, OutComeTotalElemnt);
      callback(null, response);
    }
  });
}

// http://localhost:8000
const requestListener = function (req, res) {
  parseXml((err, response) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(err.message);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(response);
    }
  });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
