const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema, json2xsd } = require("./index");
const beautify = require("json-beautify");

const xsd1 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:attribute default="title" name="title" type="xs:string"/>
</xs:schema>
`


// console.log(xsd2jsonSchema(xsd2))
console.log(xsd2jsonSchema(xsd1))
// console.log()

