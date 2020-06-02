const { xml2xsd, detectXmlSchema, jsonSchema2xsd, xsd2jsonSchema } = require("./index");

const xml = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root">
    <xs:complexType>
        <xs:sequence>
            <xs:element type="xs:string" name="field_1"/>
            <xs:element type="xs:string" name="field_2"/>
            <xs:element name="field_3">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element type="xs:string" name="field_4"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:sequence>
    </xs:complexType>
</xs:element>
</xs:schema>`;

console.log(xsd2jsonSchema(xml));
