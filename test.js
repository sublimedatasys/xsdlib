const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");
const beautify = require("json-beautify");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<shiporder orderid="889923"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:noNamespaceSchemaLocation="shiporder.xsd">
  <orderperson>John Smith</orderperson>
  <shipto>
    <name>Ola Nordmann</name>
    <address>Langgt 23</address>
    <city>4000 Stavanger</city>
    <country>Norway</country>
  </shipto>
  <item>
    <title>Empire Burlesque</title>
    <note>Special Edition</note>
    <quantity>1</quantity>
    <price>10.90</price>
  </item>
  <item>
    <title>Hide your heart</title>
    <quantity>1</quantity>
    <price>9.90</price>
  </item>
</shiporder>`;

// const xmlSchema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
// <xs:element name="root">
//     <xs:complexType>
//         <xs:sequence>
//             <xs:element type="xs:string" name="field_1"/>
//             <xs:element type="xs:string" name="field_2"/>
//             <xs:element name="field_3">
//                 <xs:complexType>
//                     <xs:sequence>
//                         <xs:element type="xs:string" name="field_4">
//                         <xs:simpleContent>
//                         <xs:extension>
//                             <xs:attribute default="10" name="title" type="xs:string"/>
//                         </xs:extension>
//                     </xs:simpleContent>
//                         </xs:element>
//                         <xs:element type="xs:string" name="field_5"/>
//                     </xs:sequence>
//                 </xs:complexType>
//             </xs:element>
//         </xs:sequence>
//     </xs:complexType>
// </xs:element>
// </xs:schema>`;

const jsonSchema = {
  type: "object",
  properties: {
    shiporder: {
      title: "title",
      type: "object",
      orderid: "",
      properties: {
        orderperson: { type: "string", abc: "value" },
        shipto: { type: "object", properties: { name: { type: "string" }, address: { type: "string" }, city: { type: "string" }, country: { type: "string" } } },
      },
    },
  },
};

// let xsd2 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
// <xs:element name="root">
//     <xs:complexType>
//         <xs:sequence>
//             <xs:element type="xs:string" default="hello" name="field_1">
//                 <xs:simpleContent>
//                     <xs:extension base="field_1Type">
//                         <xs:attribute default="h" name="title" type="xs:string"/>
//                     </xs:extension>
//                 </xs:simpleContent>
//             </xs:element>
//             <xs:element type="xs:string" name="field_2"/>
//             <xs:element type="xs:string" name="field_3"/>
//         </xs:sequence>
//     </xs:complexType>
// </xs:element>
// <xs:simpleType name="field_1Type">
//     <xs:restriction base="xs:string">
//         <xs:minLength value="2"/>
//         <xs:maxLength value="5"/>
//     </xs:restriction>
// </xs:simpleType>
// </xs:schema>`;

// let xmlSchema2 = xml2xsd(xml);
console.log(jsonSchema2xsd(jsonSchema));
