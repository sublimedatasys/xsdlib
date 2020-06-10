const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");
const beautify = require("json-beautify");

const xsd = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root">
    <xs:complexType>
        <xs:sequence>
            <xs:element type="xs:string" name="field_4"/>
            <xs:element type="xs:string" name="field_5"/>
            <xs:element type="xs:string" name="field_6"/>
            <xs:element type="xs:string" name="field_7"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
</xs:schema>`;

const jsonSchema = {
  type: "object",
  title: "title",
  properties: {
    field_1: {
      type: "string",
      title: "hello",
      description: "hii",
      minLength: 2,
      maxLength: 3,
      somemoreAttribute: "",
      somemoreAttribute2: "",
      default: "def 1",
    },
    field_3: {
      type: "string",
      attributes2: 1,
    },
    field_2: {
      type: "string",
    },
  },
  required: ["field_1", "field_2", "field_3"],
};

console.log(jsonSchema2xsd(jsonSchema));
// console.log(xsd2jsonSchema(xsd));
