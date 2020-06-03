const { xml2xsd, detectXmlSchema, validateXml, jsonSchema2xsd, xsd2jsonSchema } = require("./index");

const jsonSchema = {
  type: "object",
  title: "main",
  properties: {
    name: {
      type: "string",
      title: "10",
    },
    number: {
      type: "number",
    },
    address: {
      type: "string",
      title: "Address",
      description: "Full Address",
      minLength: 5,
      maxLength: 200,
    },
  },
  description: "main description",
  required: ["name", "number", "address"],
};

let xmlSchema = jsonSchema2xsd(jsonSchema);
console.log(xmlSchema);
console.log(xsd2jsonSchema(xmlSchema));
