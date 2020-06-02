const { xml2xsd, detectXmlSchema, jsonSchema2xsd, xsd2json } = require("./index");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<main>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body><section><h1>hello</h1></section></body>
</note>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body><section><h1>hello</h1></section></body>
</note>
</main>`;

// console.log(xsd2json(xml2xsd(xml)));
console.log(xml2xsd(xml));
