const { xsd2jsonSchema, json2xsd, jsonSchema2xsd } = require(".")


const test = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root"></xs:element>
<xs:attribute default="title value" name="title" type="xs:string"/>
</xs:schema>
`


console.log(xsd2jsonSchema(test))