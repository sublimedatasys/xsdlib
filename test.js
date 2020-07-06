const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");
const beautify = require("json-beautify");

const json1 = {
  type: "object",
  title: "one1@************",
  description: "",
  properties: {
    shiporder: {
      type: "object",
      properties: {
        orderperson: {
          type: "string",
          title: "ABCXYZ******",
        },
        shipto: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
            city: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
        },
        item: {
          type: "array",
          items: [
            {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                note: {
                  type: "string",
                },
                quantity: {
                  type: "integer",
                },
                price: {
                  type: "integer",
                },
              },
            },
          ],
        },
      },
      orderid: "",
      onemore: "description",
    },
  },
};

const json2 = {
  type: "object",
  title: "two2@@@@@@@@@@@@",
  properties: {
    orderperson: {
      type: "string",
      title: "ABC@@@@@",
    },
    shipto: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        address: {
          type: "string",
        },
        city: {
          type: "string",
        },
        country: {
          type: "string",
        },
      },
    },
    item: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          note: {
            type: "string",
          },
          quantity: {
            type: "integer",
          },
          price: {
            type: "integer",
          },
        },
      },
    },
  },
  orderid: "",
};
const json3 = {
  type: "object",
  properties: {
    orderperson: {
      type: "string",
      title: "dfdfereg@",
      description: "dfdfere",
    },
    shipto: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        address: {
          type: "string",
        },
        city: {
          type: "string",
        },
        country: {
          type: "string",
        },
      },
    },
    item: {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            note: {
              type: "string",
            },
            quantity: {
              type: "integer",
            },
            price: {
              type: "integer",
            },
          },
        },
      ],
    },
  },
  orderid: "",
  description: "dfdf*****",
  title: "dfdfdfd&&&&&**&&&&&",
};
const json4 = {
  type: "object",
  properties: {
    shiporder: {
      type: "object",
      properties: {
        orderperson: {
          type: "string",
        },
        shipto: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            address: {
              type: "string",
            },
            city: {
              type: "string",
            },
            country: {
              type: "string",
            },
          },
        },
        item: {
          type: "array",
          items: [
            {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                note: {
                  type: "string",
                },
                quantity: {
                  type: "integer",
                },
                price: {
                  type: "integer",
                },
              },
            },
          ],
        },
      },
      orderid: "",
    },
  },
};
const xsd1 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="root">
		<xs:complexType>
				<xs:sequence>
						<xs:element name="shiporder">
								<xs:complexType>
										<xs:sequence>
												<xs:element type="xs:string" name="orderperson"/>
												<xs:element name="shipto">
														<xs:complexType>
																<xs:sequence>
																		<xs:element type="xs:string" name="name"/>
																		<xs:element type="xs:string" name="address"/>
																		<xs:element type="xs:string" name="city"/>
																		<xs:element type="xs:string" name="country"/>
																</xs:sequence>
														</xs:complexType>
												</xs:element>
												<xs:element maxOccurs="unbounded" name="item">
														<xs:complexType>
																<xs:sequence>
																		<xs:element type="xs:string" name="title"/>
																		<xs:element type="xs:string" name="note"/>
																		<xs:element type="xs:integer" name="quantity"/>
																		<xs:element type="xs:integer" name="price"/>
																</xs:sequence>
														</xs:complexType>
												</xs:element>
										</xs:sequence>
										<xs:attribute name="orderid" type="xs:string"/>
								</xs:complexType>
						</xs:element>
				</xs:sequence>
		</xs:complexType>
</xs:element>
</xs:schema>`;

const xsd2 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="root">
		<xs:complexType>
				<xs:sequence>
						<xs:element type="xs:string" name="orderperson"/>
						<xs:element name="shipto">
								<xs:complexType>
										<xs:sequence>
												<xs:element type="xs:string" name="name"/>
												<xs:element type="xs:string" name="address"/>
												<xs:element type="xs:string" name="city"/>
												<xs:element type="xs:string" name="country"/>
										</xs:sequence>
								</xs:complexType>
						</xs:element>
						<xs:element maxOccurs="unbounded" name="item">
								<xs:complexType>
										<xs:sequence>
												<xs:element type="xs:string" name="title"/>
												<xs:element type="xs:string" name="note"/>
												<xs:element type="xs:integer" name="quantity"/>
												<xs:element type="xs:integer" name="price"/>
										</xs:sequence>
								</xs:complexType>
						</xs:element>
				</xs:sequence>
		</xs:complexType>
</xs:element>
</xs:schema>`;

const xsd3 = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
<xs:element name="shiporder">
		<xs:complexType>
				<xs:sequence>
						<xs:element type="xs:string" name="orderperson">
								<xs:simpleContent>
										<xs:extension>
												<xs:attribute default="dfdfereg@" name="title" type="xs:string"/>
												<xs:attribute default="dfdfere" name="description" type="xs:string"/>
										</xs:extension>
								</xs:simpleContent>
						</xs:element>
						<xs:element name="shipto">
								<xs:complexType>
										<xs:sequence>
												<xs:element type="xs:string" name="name"/>
												<xs:element type="xs:string" name="address"/>
												<xs:element type="xs:string" name="city"/>
												<xs:element type="xs:string" name="country"/>
										</xs:sequence>
										<xs:attribute name="title" default="ta***************" type="xs:string"/>
										<xs:attribute name="description" default="da************" type="xs:string"/>
								</xs:complexType>
						</xs:element>
						<xs:element maxOccurs="unbounded" name="item">
								<xs:complexType>
										<xs:sequence>
												<xs:element type="xs:string" name="title"/>
												<xs:element type="xs:string" name="note"/>
												<xs:element type="xs:integer" name="quantity"/>
												<xs:element type="xs:integer" name="price"/>
										</xs:sequence>
								</xs:complexType>
						</xs:element>
				</xs:sequence>
				<xs:attribute name="orderid" type="xs:string"/>
				<xs:attribute name="description" default="dfdf!!!!!!!!!!" type="xs:string"/>
				<xs:attribute name="title" default="dfdfdfd!!!!!!!!!!" type="xs:string"/>
		</xs:complexType>
</xs:element>
</xs:schema>`;

// jsonSchema2xsd(json1)
// jsonSchema2xsd(json2)
// jsonSchema2xsd(json3)

console.log(jsonSchema2xsd(json1));
console.log(jsonSchema2xsd(json2));
console.log(jsonSchema2xsd(json3));
console.log(jsonSchema2xsd(json4));
// xsd2jsonSchema(xsd1)
// xsd2jsonSchema(xsd2)
// xsd2jsonSchema(xsd3)

console.log(xsd2jsonSchema(xsd1));
console.log(xsd2jsonSchema(xsd2));
console.log(xsd2jsonSchema(xsd3));
