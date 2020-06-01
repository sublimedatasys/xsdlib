const parser = require("xml2json");
const format = require("xml-formatter");
const toJsonSchema = require("to-json-schema");

const generateObj = (keys, values, hasParent = true) => {
  let xml = "";
  if (hasParent) {
    xml += `<xs:complexType>`;
    xml += `<xs:sequence>`;
  }

  for (let key in keys) {
    const type = values[key].type;
    if (type === "object") {
      const obj = values[key];
      const keys2 = Object.keys(obj.properties);
      const values2 = Object.values(obj.properties);
      xml += `<xs:element name="${keys[key]}">`;
      xml += generateObj(keys2, values2);
      xml += `</xs:element>`;
    } else if (type === "string") {
      xml += `<xs:element type="xs:string" name="${keys[key]}"/>`;
    }
  }
  if (hasParent) {
    xml += `</xs:sequence>`;
    xml += `</xs:complexType>`;
  }

  return xml;
};

const OBJtoXSDElement = (obj) => {
  let xml = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">`;
  const type = obj.type;
  if (type === "object") {
    const keys = Object.keys(obj.properties);
    const values = Object.values(obj.properties);
    xml += generateObj(keys, values, false);
  }
  xml += `</xs:schema>`;
  xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
  return xml;
};

exports.xml2xsd = (xmlString) => {
  const jsonString = parser.toJson(xmlString);
  const schema = toJsonSchema(JSON.parse(jsonString));
  return format(OBJtoXSDElement(schema));
};

exports.json2xsd = (jsonObj) => {
  const schema = toJsonSchema(jsonObj);
  return format(OBJtoXSDElement(schema));
};
