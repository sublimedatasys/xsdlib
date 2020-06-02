const { xml2xsd, detectXmlSchema, jsonSchema2xsd, xsd2jsonSchema } = require("./index");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`;

console.log(xsd2jsonSchema(xml2xsd(xml)));
