const parser = require("fast-xml-parser");
const format = require("xml-formatter");
const toJsonSchema = require("to-json-schema");
const beautify = require("json-beautify");

const generateExtraTypes = (keysExtra, valuesExtra, key) => {
  let xmlExtraTypes = "";
  let minLengthIndex = keysExtra.indexOf("minLength");
  let minLength = "";

  let maxLengthIndex = keysExtra.indexOf("maxLength");
  let maxLength = "";

  let typeIndex = keysExtra.indexOf("type");
  let type = valuesExtra[typeIndex];

  if (minLengthIndex !== -1) {
    minLength = `<xs:minLength value="${valuesExtra[minLengthIndex]}"/>`;
  }

  if (maxLengthIndex !== -1) {
    maxLength = `<xs:maxLength value="${valuesExtra[maxLengthIndex]}"/>`;
  }

  if (minLengthIndex !== -1 || maxLengthIndex !== -1) {
    xmlExtraTypes += `<xs:simpleType name="${key}Type">`;
    xmlExtraTypes += `<xs:restriction base="xs:${type}">`;
    xmlExtraTypes += minLength;
    xmlExtraTypes += maxLength;
    xmlExtraTypes += `</xs:restriction>`;
    xmlExtraTypes += `</xs:simpleType>`;
  }
  return xmlExtraTypes;
};

const generateComplexTypes = (keysExtra, valuesExtra, key, type) => {
  let minLengthIndex = keysExtra.indexOf("minLength");
  let maxLengthIndex = keysExtra.indexOf("maxLength");
  let defaultIndex = keysExtra.indexOf("default");

  let baseAttr = "";
  let defaultAttr = "";

  if (minLengthIndex !== -1 || maxLengthIndex !== -1) {
    baseAttr = `base="${key}Type"`;
  }

  if (defaultIndex !== -1) {
    defaultAttr = `default="${valuesExtra[defaultIndex]}"`;
  }

  let titleIndex = keysExtra.indexOf("title");
  let titleAttribute = "";

  let descriptionIndex = keysExtra.indexOf("description");
  let descriptionAttribute = "";

  if (titleIndex !== -1) {
    titleAttribute = `<xs:attribute default="${valuesExtra[titleIndex]}" name="title" type="xs:string"/>`;
  }

  if (descriptionIndex !== -1) {
    descriptionAttribute = `<xs:attribute default="${valuesExtra[descriptionIndex]}" name="description" type="xs:string"/>`;
  }

  let xml = "";
  xml += `<xs:element type="${type}" ${defaultAttr} name="${key}"><xs:simpleContent><xs:extension ${baseAttr}>`;
  if (titleAttribute !== "") xml += titleAttribute;
  if (descriptionAttribute !== "") xml += descriptionAttribute;
  xml += `</xs:extension></xs:simpleContent></xs:element>`;
  return xml;
};

const generateObj = (keys, values, hasParent = true) => {
  let xml = "";
  let xmlExtraTypes = "";
  if (!hasParent) {
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
      xml += generateObj(keys2, values2, false).xml;
      xml += `</xs:element>`;
    } else if (type === "array") {
      const obj = values[key];
      const keys2 = Object.keys(obj.items);
      const values2 = Object.values(obj.items);
      if (keys2.length === 1 && values2.length === 1 && values2[0] !== "object") {
        xml += `<xs:element type="xs:${values2[0]}" name="${keys2[0]}"/>`;
      } else if (values2[0] === "object") {
        const keys3 = Object.keys(values2[1]);
        const values3 = Object.values(values2[1]);
        xml += `<xs:element name="${keys3[0]}">`;
        xml += generateObj(keys3, values3, false).xml;
        xml += `</xs:element>`;
      }
    } else if (typeof type === "string" && type.length > 0) {
      let keysExtra = Object.keys(values[key]);
      let valuesExtra = Object.values(values[key]);

      let defaultInline = "";
      if (keysExtra.indexOf("default") !== -1) {
        defaultInline = `default="${values[key].default}"`;
      }

      if (keysExtra.length > 1 && !(keysExtra.length === 2 && keysExtra[1] === "default")) {
        xmlExtraTypes += generateExtraTypes(keysExtra, valuesExtra, keys[key]);
        xml += generateComplexTypes(keysExtra, valuesExtra, keys[key], type);
      } else {
        xml += `<xs:element ${defaultInline} type="xs:${type}" name="${keys[key]}"/>`;
      }
    }
  }

  if (!hasParent) {
    xml += `</xs:sequence>`;
    xml += `</xs:complexType>`;
  }

  return { xml, xmlExtraTypes };
};

const OBJtoXSDElement = (obj) => {
  let xml = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">`;
  let xmlExtraTypes = ``;
  const type = obj.type;
  if (type === "object") {
    const keys = Object.keys(obj.properties);
    const values = Object.values(obj.properties);
    if (keys.length > 1) {
      let title = "";
      let description = "";

      if (obj.title) {
        title = `title="${obj.title}"`;
      }

      if (obj.description) {
        description = `description="${obj.description}"`;
      }

      xml += `<xs:element ${title} ${description} name="root">`;
      xml += `<xs:complexType>`;
      xml += `<xs:sequence>`;
    }
    let xmlObj = generateObj(keys, values);
    xmlExtraTypes = xmlObj.xmlExtraTypes;
    xml += xmlObj.xml;
    if (keys.length > 1) {
      xml += `</xs:element>`;
      xml += `</xs:sequence>`;
      xml += `</xs:complexType>`;
    }
  }
  xml += xmlExtraTypes;

  xml += `</xs:schema>`;
  xml = xml.replace(/<\/?[0-9]{1,}>/g, "");
  return xml;
};

const generateJson = (keys, values, noParent = true) => {
  let jsonString = ``;
  let keyIndex = keys.indexOf("attribute_name");
  let complexTypeIndex = keys.indexOf("xs:complexType");

  if (complexTypeIndex !== -1) {
    const keys2 = Object.keys(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
    const values2 = Object.values(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
    jsonString += `{"${values[keyIndex]}":{"type":"object","properties":${generateJson(keys2, values2)}}}`;
  } else {
    jsonString += "{";
    if (values.length === 2 && typeof values[0] === "string") {
      jsonString += `"${values[1]}":{"type":"${values[keyIndex].replace("xs:", "")}"}`;
    } else {
      values.forEach((d, index) => {
        const coma = index !== values.length - 1;
        if (d["xs:complexType"]) {
          const keys2 = Object.keys(d["xs:complexType"]["xs:sequence"]);
          const values2 = Object.values(d["xs:complexType"]["xs:sequence"]);
          jsonString += `"${d.attribute_name}":{"type":"object","properties":${generateJson(keys2, values2)}}${coma ? "," : ""}`;
        } else if (d["xs:simpleContent"]) {
          let ext = d["xs:simpleContent"]["xs:extension"];
          let attr = ext["xs:attribute"];
          let attrJson = "";

          if (Array.isArray(attr)) {
            attrJson = attr.length > 0 ? `,${attr.map((a) => `"${a.attribute_name}":"${a.attribute_default}"`)}` : "";
          } else if (attr.attribute_name) {
            attrJson = `,"${attr.attribute_name}":"${attr.attribute_default}"`;
          }

          jsonString += `"${d.attribute_name}":{"type":"${d.attribute_type}"${attrJson}}${coma ? "," : ""}`;
        } else if (d.attribute_name && d.attribute_type) {
          jsonString += `"${d.attribute_name}":{"type":"${d.attribute_type.replace("xs:", "")}"}${coma ? "," : ""}`;
        }
      });
    }
    jsonString += "}";
  }
  return jsonString;
};

const xmlSchemaOBJtoJsonSchema = (jsonObj) => {
  let jsonString = "";
  jsonString += `{"type":"object","properties":`;
  const parentObj = jsonObj["xs:schema"];
  if (parentObj) {
    const mainObj = parentObj["xs:element"];
    let keys = Object.keys(mainObj);
    let values = Object.values(mainObj);
    if (keys.length >= 2) {
      jsonString += generateJson(keys, values);
    }
  }
  jsonString += `}`;
  return JSON.parse(jsonString);
};

exports.xml2xsd = (xmlString) => {
  const jsonObj = parser.parse(xmlString, { ignoreAttributes: false });
  const schema = toJsonSchema(jsonObj);
  return format(OBJtoXSDElement(schema));
};

exports.json2xsd = (jsonObj) => {
  const schema = toJsonSchema(jsonObj);
  return format(OBJtoXSDElement(schema));
};

exports.jsonSchema2xsd = (jsonSchema) => {
  return format(OBJtoXSDElement(jsonSchema));
};

exports.xsd2jsonSchema = (xsdString) => {
  const jsonObj = parser.parse(xsdString, { ignoreAttributes: false, attributeNamePrefix: "attribute_" });
  return beautify(xmlSchemaOBJtoJsonSchema(jsonObj), null, 2, 100);
};

exports.validateXml = (string) => {
  let response = parser.validate(string);
  if (response === true) {
    return true;
  } else {
    throw response.err;
  }
};

exports.detectXmlSchema = (string) => {
  if (parser.validate(string) === true) {
    if (string.endsWith("</xs:schema>")) {
      return "xsd";
    } else return "xml";
  } else throw parser.validate(string).err;
};
