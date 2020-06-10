const parser = require("fast-xml-parser");
const format = require("xml-formatter");
const toJsonSchema = require("to-json-schema");
const beautify = require("json-beautify");
const _ = require("lodash");

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
    let def = "";
    if (valuesExtra[titleIndex]) {
      def = `default="${valuesExtra[titleIndex]}"`;
    }
    titleAttribute = `<xs:attribute ${def} name="title" type="xs:string"/>`;
  }

  if (descriptionIndex !== -1) {
    let def = "";
    if (valuesExtra[descriptionIndex]) {
      def = `default="${valuesExtra[descriptionIndex]}"`;
    }
    descriptionAttribute = `<xs:attribute ${def} name="description" type="xs:string"/>`;
  }

  let xml = "";
  xml += `<xs:element type="xs:${type}" ${defaultAttr} name="${key}"><xs:simpleContent><xs:extension ${baseAttr}>`;
  if (titleAttribute !== "") xml += titleAttribute;
  if (descriptionAttribute !== "") xml += descriptionAttribute;
  xml += `</xs:extension></xs:simpleContent></xs:element>`;
  return xml;
};

const generateObj = (keys, values, hasParent = true, name = "", { keysExtra, valuesExtra } = { keysExtra: [], valuesExtra: [] }) => {
  let xml = "";
  let xmlExtraTypes = "";
  let attributes = [];
  if (!hasParent) {
    keys.forEach((k, i) => {
      if (k.indexOf("attribute_") !== -1) {
        attributes.push(k);
        delete keys[i];
        delete values[i];
      }
    });
    if (attributes.length > 0 && keys.indexOf("extension") !== -1) {
      xml += `<xs:complexType>`;
      xml += ` <xs:simpleContent>`;
    } else {
      xml += `<xs:complexType>`;
      xml += `<xs:sequence>`;
    }
  }

  if (keys.indexOf("type") === -1) {
    keys.forEach((d, key) => {
      const type = values[key].type;
      if (type === "object") {
        const obj = values[key];
        const keys2 = Object.keys(obj.properties);
        const values2 = Object.values(obj.properties);

        const keysExtra = Object.keys(obj);
        const valuesExtra = Object.values(obj);
        xml += `<xs:element name="${keys[key]}">`;
        xml += generateObj(keys2, values2, false, null, { keysExtra, valuesExtra }).xml;
        xml += `</xs:element>`;
      } else if (type === "array") {
        // const obj = values[key];
        // const keys2 = Object.keys(obj.items);
        // const values2 = Object.values(obj.items);
        // xml += `<xs:element array="1" name="${keys[key]}">`;
        // xml += `<xs:complexType>`;
        // xml += `<xs:sequence>`;
        // if (keys2.length > 1 && values2.length > 1 && values2[keys2.indexOf("type")] !== "object") {
        //   let keysExtra = keys2;
        //   let valuesExtra = values2;
        //   let defaultInline = "";
        //   if (keysExtra.indexOf("default") !== -1) {
        //     defaultInline = `default="${values[key].default}"`;
        //   }
        //   if (keysExtra.length > 1 && !(keysExtra.length === 2 && keysExtra[1] === "default")) {
        //     xmlExtraTypes += generateExtraTypes(keysExtra, valuesExtra, `${keys[key]}_item`);
        //     xml += generateComplexTypes(keysExtra, valuesExtra, `${keys[key]}_item`, type);
        //   } else {
        //     xml += `<xs:element ${defaultInline} type="xs:${type}" name="${keys[key]}"/>`;
        //   }
        // } else if (values2[0] === "object") {
        //   const keys3 = Object.keys(values2[1]);
        //   const values3 = Object.values(values2[1]);
        //   if (keys3.length > 0) {
        //     xml += `<xs:element name="${keys[key]}_item">`;
        //     xml += generateObj(keys3, values3, false, `${keys[key]}_item`).xml;
        //     xml += `</xs:element>`;
        //   } else {
        //     xml += `<xs:element name="${keys[key]}_item">`;
        //     xml += generateObj(keys3, values3, false, `${keys[key]}_item`).xml;
        //     xml += `</xs:element>`;
        //   }
        // } else {
        //   xml += `<xs:element type="xs:${values2[0]}" name="${keys[key]}_item"/>`;
        // }
        // xml += `</xs:sequence>`;
        // xml += `</xs:complexType>`;
        // xml += `</xs:element>`;
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
          if (keys[key] !== "extension") {
            xml += `<xs:element ${defaultInline} type="xs:${type}" name="${keys[key]}"/>`;
          } else {
            if (attributes.length > 0) {
              xml += `<xs:extension base="xs:${type}">`;
              attributes.forEach((d) => {
                xml += `<xs:attribute name="${d.replace("attribute_", "")}" type="xs:string"/>`;
              });
              xml += `</xs:extension>`;
            } else {
              xml += `<xs:extension base="xs:${type}"/>`;
            }
          }
        }
      }
    });
  } else {
    const type = values[keys.indexOf("type")];
    let defaultInline = "";
    if (keys.indexOf("default") !== -1) {
      defaultInline = `default="${values[keys.indexOf("default")]}"`;
    }

    let keysExtra = keys;
    let valuesExtra = values;

    if (type === "string" && keys.length === 1) {
      xml += `<xs:element ${defaultInline} type="xs:${type}" name="${name}_item"/>`;
    } else if (type === "string" && keys.length > 1) {
      xmlExtraTypes += generateExtraTypes(keysExtra, valuesExtra, name);
      xml += generateComplexTypes(keysExtra, valuesExtra, name, type);
    }
  }

  if (!hasParent) {
    let titleIndex = keysExtra.indexOf("title");
    let titleAttribute = "";

    let descriptionIndex = keysExtra.indexOf("description");
    let descriptionAttribute = "";

    if (titleIndex !== -1) {
      let def = "";
      if (valuesExtra[titleIndex]) {
        def = `default="${valuesExtra[titleIndex]}"`;
      }
      titleAttribute = `<xs:attribute ${def} name="title" type="xs:string"/>`;
    }

    if (descriptionIndex !== -1) {
      let def = "";
      if (values[titleIndex]) {
        def = `default="${values[titleIndex]}"`;
      }
      descriptionAttribute = `<xs:attribute ${def} name="description" type="xs:string"/>`;
    }

    if (attributes.length > 0 && keys.indexOf("extension") !== -1) {
      xml += ` </xs:simpleContent>`;
      xml += `</xs:complexType>`;
    } else {
      xml += `</xs:sequence>`;
      if (attributes.length > 0) {
        attributes.forEach((attr) => {
          xml += `<xs:attribute name="${attr.replace("attribute_", "")}" type="xs:string"/>`;
        });
      }
      xml += titleAttribute;
      xml += descriptionAttribute;
      xml += `</xs:complexType>`;
    }
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

const generateSimpleContent = (d, coma = false, restrictions = {}) => {
  let jsonString = "";
  let ext = d["xs:simpleContent"]["xs:extension"];
  let attr = ext["xs:attribute"];
  let attrJson = "";
  let minLength = "";
  let maxLength = "";

  let type = d.attribute_type ? d.attribute_type : "";

  if (Array.isArray(attr)) {
    attrJson = attr.length > 0 ? `,${attr.map((a) => `"${a.attribute_name}":"${a.attribute_default || ""}"`)}` : "";
  } else if (attr.attribute_name) {
    attrJson = `,"${attr.attribute_name}":"${attr.attribute_default || ""}"`;
  }

  if (ext.attribute_base) {
    if (restrictions[ext.attribute_base]) {
      let minLength = restrictions[ext.attribute_base] && restrictions[ext.attribute_base]["xs:minLength"] && restrictions[ext.attribute_base]["xs:minLength"]["attribute_value"];
      let maxLength = restrictions[ext.attribute_base] && restrictions[ext.attribute_base]["xs:maxLength"] && restrictions[ext.attribute_base]["xs:maxLength"]["attribute_value"];
      if (minLength) attrJson += `,"minLength":"${minLength}"`;
      if (maxLength) attrJson += `,"maxLength":"${maxLength}"`;
    }
  }

  jsonString += `"${d.attribute_name}":{"type":"${type.replace("xs:", "")}"${attrJson}}${coma ? "," : ""}`;
  return jsonString;
};

const generateJson = (keys, values, restrictions = {}, attributes = []) => {
  let jsonString = ``;
  let keyIndex = keys.indexOf("attribute_name");
  let complexTypeIndex = keys.indexOf("xs:complexType");
  if (complexTypeIndex !== -1) {
    if (keys.indexOf("attribute_array") === -1) {
      if (values[complexTypeIndex]["xs:sequence"]) {
        const keys2 = Object.keys(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
        const values2 = Object.values(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
        jsonString += `{"${values[keyIndex]}":{"type":"object","properties":${generateJson(keys2, values2, restrictions)},${attributes.map(
          (d, i) => `"${d.attribute_name}":""${attributes.length - 1 === i ? "" : ""}`
        )}}}`;
      } else {
        jsonString += `{"${values[keyIndex]}":{"type":"object","properties":{}}}`;
      }
    } else {
      const keys2 = Object.keys(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
      const values2 = Object.values(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
      if (values2[keys2.indexOf("attribute_type")] === "xs:string") {
        jsonString += `{"${values[keyIndex]}":{"type":"array","items":{"type":"string"}}}`;
      } else {
        if (keys2.indexOf("xs:complexType") !== -1) {
          const keys3 = Object.keys(values2[keys2.indexOf("xs:complexType")]["xs:sequence"]);
          const values3 = Object.values(values2[keys2.indexOf("xs:complexType")]["xs:sequence"]);
          jsonString += `{"${values[keys.indexOf("attribute_name")]}":{"type":"array","items":{"type":"object","properties":${generateJson(keys3, values3, restrictions)}}}}`;
        }
      }
    }
  } else {
    jsonString += "{";
    if (values.length === 2 && typeof values[0] === "string") {
      jsonString += `"${values[1]}":{"type":"${values[0].replace("xs:", "")}"}`;
    } else {
      if (keys.indexOf("xs:simpleContent") !== -1) {
        let obj = {};
        keys.forEach((d) => {
          obj[d] = values[keys.indexOf(d)];
        });
        jsonString += generateSimpleContent(obj, null, restrictions);
      } else {
        values.forEach((d, index) => {
          const coma = index !== values.length - 1;
          if (d["xs:complexType"] && d["xs:complexType"]["xs:sequence"]) {
            const keys2 = Object.keys(d["xs:complexType"]["xs:sequence"]);
            const values2 = Object.values(d["xs:complexType"]["xs:sequence"]);
            jsonString += `"${d.attribute_name}":{"type":"object","properties":${generateJson(keys2, values2, restrictions)}}${coma ? "," : ""}`;
          } else if (Array.isArray(d)) {
            d.forEach((d1, index) => {
              const coma2 = index !== d.length - 1;
              if (d1["xs:simpleContent"]) {
                jsonString += generateSimpleContent(d1, coma2, restrictions);
              } else {
                jsonString += `"${d1.attribute_name}":{"type":"${d1.attribute_type.replace("xs:", "")}"}${coma2 ? "," : ""}`;
              }
            });
          } else if (d["xs:complexType"] && d["xs:complexType"]["xs:simpleContent"]) {
            d["xs:complexType"].attribute_name = d.attribute_name;
            jsonString += generateSimpleContent(d["xs:complexType"], coma, restrictions);
          } else if (d["xs:simpleContent"]) {
            jsonString += generateSimpleContent(d, coma, restrictions);
          } else if (d.attribute_name && d.attribute_type) {
            jsonString += `"${d.attribute_name}":{"type":"${d.attribute_type.replace("xs:", "")}"}${coma ? "," : ""}`;
          }
        });
      }
    }
    jsonString += `}`;
  }
  return jsonString;
};

const xmlSchemaOBJtoJsonSchema = (jsonObj) => {
  let jsonString = "";
  jsonString += `{"type":"object","properties":`;
  const parentObj = jsonObj["xs:schema"];
  let mainKeys = Object.keys(parentObj);
  let mainValues = Object.values(parentObj);
  const restrictions = {};
  mainKeys.forEach((key, index) => {
    if (key === "xs:simpleType") {
      restrictions[mainValues[index].attribute_name] = mainValues[index]["xs:restriction"];
    }
  });
  if (parentObj) {
    const mainObj = parentObj["xs:element"];
    const attributes = mainObj["xs:complexType"] && mainObj["xs:complexType"]["xs:attribute"];
    if (mainObj) {
      let keys = Object.keys(mainObj);
      let values = Object.values(mainObj);

      if (keys.length >= 2) {
        jsonString += generateJson(keys, values, restrictions, attributes);
      }
    } else {
      jsonString += `{}`;
    }
  }
  jsonString += `}`;
  const json = JSON.parse(jsonString);
  return json.properties && json.properties.root ? json.properties.root : json;
};

const generateAttributeSchema = (jsonObj) => {
  // console.log(beautify(jsonObj, null, 2, 100));
  // const jsonObjFinal = itterateObj(jsonObj);
  return jsonObj;
};

exports.xml2xsd = (xmlString) => {
  const jsonObj = parser.parse(xmlString, { ignoreAttributes: false, textNodeName: "extension", attributeNamePrefix: "attribute_" });
  const schema = toJsonSchema(jsonObj);
  const schema2 = generateAttributeSchema(schema);
  return format(OBJtoXSDElement(schema2));
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
  // console.log(jsonObj);
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
