const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");
const beautify = require("json-beautify");

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

const jsonSchema = { type: "object", properties: { field_1: { type: "string", title: "a", description: "abjb" } } };

let xmlSchema2 = jsonSchema2xsd(jsonSchema);
// console.log(beautify(jsonSchema, null, 2, 100));
console.log(xsd2jsonSchema(xmlSchema2));
console.log(xmlSchema2);
