const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");
const beautify = require("json-beautify");

const xml = `<note from="">
<to>Tove</to>
<from time="">Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`;

const xmlSchema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root">
    <xs:complexType>
        <xs:sequence>
            <xs:element type="xs:string" name="field_1"/>
            <xs:element type="xs:string" name="field_2"/>
            <xs:element name="field_3">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element type="xs:string" name="field_4">
                        <xs:simpleContent>
                        <xs:extension>
                            <xs:attribute default="10" name="title" type="xs:string"/>
                        </xs:extension>
                    </xs:simpleContent>
                        </xs:element>
                        <xs:element type="xs:string" name="field_5"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
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
      default: "def 1",
    },
    field_3: {
      type: "string",
    },
    field_2: {
      type: "string",
    },
  },
  required: ["field_1", "field_2", "field_3"],
};

let xsd2 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root">
    <xs:complexType>
        <xs:sequence>
            <xs:element type="xs:string" default="hello" name="field_1">
                <xs:simpleContent>
                    <xs:extension base="field_1Type">
                        <xs:attribute default="h" name="title" type="xs:string"/>
                    </xs:extension>
                </xs:simpleContent>
            </xs:element>
            <xs:element type="xs:string" name="field_2"/>
            <xs:element type="xs:string" name="field_3"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
<xs:simpleType name="field_1Type">
    <xs:restriction base="xs:string">
        <xs:minLength value="2"/>
        <xs:maxLength value="5"/>
    </xs:restriction>
</xs:simpleType>
</xs:schema>`;

// let xmlSchema2 = jsonSchema2xsd(jsonSchema);
// console.log(beautify(jsonSchema, null, 2, 100));
// console.log(xsd2jsonSchema(xmlSchema2));
// console.log(xmlSchema2);

// console.log(xml2xsd(xml));
console.log(xsd2jsonSchema(xsd2));
