const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema, json2xsd } = require("./index");
const beautify = require("json-beautify");

const xsd1 = `<?xml version="1.0" encoding="utf-16" ?>
<xs:schema targetNamespace="http://NamespaceTest.com/CommonTypes"
           xmlns:xs="http://www.w3.org/2001/XMLSchema"
           elementFormDefault="qualified">
           <xs:element name="class">
           <xs:complexType>
              <xs:sequence>
                 <xs:element name="student" type="StudentType" minOccurs="0" maxOccurs="unbounded" />
              </xs:sequence>
           </xs:complexType>
        </xs:element>
     
        <xs:complexType name="StudentType">
           <xs:sequence>
              <xs:element name="firstname" type="xs:string"/>
              <xs:element name="lastname" type="xs:string"/>
              <xs:element name="nickname" type="xs:string"/>
              <xs:element name="marks" type="xs:positiveInteger"/>
           </xs:sequence>
           <xs:attribute name="rollno" type="xs:positiveInteger"/>
        </xs:complexType>
</xs:schema>
`


// console.log(xsd2jsonSchema(xsd2))
console.log(xsd2jsonSchema(xsd1))
// console.log()

