const { xml2xsd, detectXmlSchema, jsonSchema2xsd, xsd2jsonSchema } = require("./index");

const xml = `<?xml version="1.0" encoding="ISO-8859-1"?>  
<note>  
  <to>Tove</to>  
  <from>Jani</from>  
  <heading>Reminder</heading>  
  <body>Don't forget me this weekend!</body>  
</note>`;

console.log(xml2xsd(xml));
