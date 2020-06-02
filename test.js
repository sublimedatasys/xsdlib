const { xml2xsd, detectXmlSchema, jsonSchema2xsd, xsd2jsonSchema } = require("./index");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<note>
<to><item>some string</item></to>
<to><item>some string</item></to>
<to><item>some string</item></to>
</note>`;

console.log(xml2xsd(xml));
