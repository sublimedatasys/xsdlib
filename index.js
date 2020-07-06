const parser = require("fast-xml-parser");
const format = require("xml-formatter");
const toJsonSchema = require("to-json-schema");
const beautify = require("json-beautify");
const _ = require("lodash");

const primaryAttributes = [
  "minLength",
  "maxLength",
  "default",
  "pattern",
  "type",
  "enum",
  "properties",
  "format",
  "required",
  "enumDesc",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minimum",
  "maximum",
  "uniqueItems",
  "minItems",
  "maxItems",
  "isArray",
];

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

  const keysExtra2 = []; //keysExtra.slice();
  const valuesExtra2 = []; //valuesExtra.slice();

  keysExtra.forEach((k, index) => {
    if (primaryAttributes.indexOf(k) === -1) {
      keysExtra2.push(k);
      valuesExtra2.push(valuesExtra[index]);
    }
  });

  let baseAttr = "";
  let defaultAttr = "";

  if (minLengthIndex !== -1 || maxLengthIndex !== -1) {
    baseAttr = `base="${key}Type"`;
  }

  if (defaultIndex !== -1) {
    defaultAttr = `default="${valuesExtra[defaultIndex]}"`;
  }

  let xml = "";
  const isArray = keysExtra.indexOf("isArray") !== -1 ? `maxOccurs="unbounded"` : "";
  if (keysExtra.length === 2 && keysExtra.indexOf("isArray") !== -1) {
    xml += `<xs:element ${isArray} type="xs:${type}" ${defaultAttr} name="${key}" />`;
  } else {
    xml += `<xs:element ${isArray} type="xs:${type}" ${defaultAttr} name="${key}"><xs:simpleContent><xs:extension ${baseAttr}>`;
    keysExtra2.forEach((d, index) => {
      xml += `<xs:attribute default="${valuesExtra2[index]}" name="${d.replace("attribute_", "")}" type="xs:string"/>`;
    });
    xml += `</xs:extension></xs:simpleContent></xs:element>`;
  }

  return xml;
};

const convertToObj = (arrayObj) => {
  let obj = {};
  if (arrayObj.type === "array") {
    if (!Array.isArray(arrayObj.items)) {
      arrayObj.items = [arrayObj.items];
    }
    obj.type = "object";
    if (Array.isArray(arrayObj.items)) {
      let commonObjKeys = {};
      arrayObj.items.forEach((dObj) => {
        if (dObj.type === "object") {
          Object.keys(dObj.properties).forEach((d1) => {
            if (Object.keys(commonObjKeys).indexOf(d1) === -1) {
              if (dObj.properties[d1].type === "object") {
                Object.keys(dObj.properties).forEach((d2) => {
                  if (dObj.properties[d2].type === "array") {
                    dObj.properties[d2] = convertToObj(dObj.properties[d2]);
                  }
                });
                commonObjKeys[d1] = dObj.properties[d1];
              } else if (dObj.properties[d1].type === "array") {
                commonObjKeys[d1] = convertToObj(dObj.properties[d1]);
              } else {
                commonObjKeys[d1] = dObj.properties[d1];
              }
            }
          });
          obj.properties = commonObjKeys;
          obj.isArray = true;
        } else {
          obj = dObj;
          obj.isArray = true;
        }
      });
    } else {
      obj = arrayObj.items;
      obj.isArray = true;
    }
  }
  return obj;
};

const generateObj = (keys, values, hasParent = true, name = "", { keysExtra, valuesExtra } = { keysExtra: [], valuesExtra: [] }, mainObjectExtraattributes = false) => {
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
        const obj = convertToObj(values[key]);
        if (obj.properties) {
          const keys2 = Object.keys(obj.properties);
          const values2 = Object.values(obj.properties);
          const keysExtra = Object.keys(obj);
          const valuesExtra = Object.values(obj);
          xml += `<xs:element maxOccurs="unbounded" name="${keys[key]}">`;
          xml += generateObj(keys2, values2, false, null, { keysExtra, valuesExtra }).xml;
          xml += `</xs:element>`;
        } else {
          xml += `<xs:element maxOccurs="unbounded" type="xs:${obj.type}" name="${keys[key]}" />`;
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

  if (!hasParent || (hasParent && mainObjectExtraattributes)) {
    keysExtra.forEach((d) => {
      if (primaryAttributes.indexOf(d) === -1) {
        attributes.push(d);
      }
    });

    if (attributes.length > 0 && keys.indexOf("extension") !== -1) {
      xml += ` </xs:simpleContent>`;
      xml += `</xs:complexType>`;
    } else {
      xml += `</xs:sequence>`;
      if (attributes.length > 0) {
        attributes.forEach((attr, index) => {
          if (attr.indexOf("xsi") === -1) {
            let defaultval = valuesExtra[keysExtra.indexOf(attr)] ? `default="${valuesExtra[keysExtra.indexOf(attr)]}"` : "";
            xml += `<xs:attribute name="${attr.replace("attribute_", "")}" ${defaultval} type="xs:string"/>`;
          }
        });
      }
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
    const keysExtra = Object.keys(obj);
    const valuesExtra = Object.values(obj);
    const mainKeys = ["type", "title", "properties", "description", "required"]
    const handleRootAttri = keysExtra.some((i) => !mainKeys.includes(i))

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
    let xmlObj = generateObj(keys, values, true, null, { keysExtra, valuesExtra }, handleRootAttri);
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

  let type = d.attribute_type ? d.attribute_type : ext.attribute_base;

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

  let arrayIndex = keys.indexOf("attribute_maxOccurs");

  if (complexTypeIndex !== -1) {
    if (values[complexTypeIndex]["xs:sequence"]) {
      const keys2 = Object.keys(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
      const values2 = Object.values(values[complexTypeIndex]["xs:sequence"]["xs:element"]);
      attributes.forEach((d, i) => {
        if (typeof d === "undefined") {
          attributes.splice(i, 1);
        }
      });

      jsonString += `{"${values[keyIndex]}":{"type":"object","properties":${generateJson(keys2, values2, restrictions)}${attributes.length > 0 ? "," : ""}${attributes.map((d, i) =>
        d ? `"${d.attribute_name}":"${d.attribute_default || ""}"` : ""
      )}}}`;
    } else {
      jsonString += `{"${values[keyIndex]}":{"type":"object","properties":{}}}`;
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
            const maxBound = d.attribute_maxOccurs === "unbounded";
            if (maxBound) {
              jsonString += `"${d.attribute_name}":{"type":"array","items":{"type":"object","properties":${generateJson(keys2, values2, restrictions)}}${coma ? "," : ""}}`;
            } else {
              jsonString += `"${d.attribute_name}":{"type":"object","properties":${generateJson(keys2, values2, restrictions)}}${coma ? "," : ""}`;
            }
          } else if (Array.isArray(d)) {
            d.forEach((d1, index) => {
              const coma2 = index !== d.length - 1;
              if (d1["xs:simpleContent"]) {
                jsonString += generateSimpleContent(d1, coma2, restrictions);
              } else if (d1["xs:complexType"] && d1["xs:complexType"]["xs:simpleContent"]) {
                d1["xs:complexType"].attribute_name = d1.attribute_name;
                jsonString += generateSimpleContent(d1["xs:complexType"], coma2, restrictions);
              } else if (d1["xs:complexType"]) {
                const keys2 = Object.keys(d1["xs:complexType"]["xs:sequence"]);
                const values2 = Object.values(d1["xs:complexType"]["xs:sequence"]);
                jsonString += `"${d1.attribute_name}":{"type":"object","properties":${generateJson(keys2, values2, restrictions)}}${coma ? "," : ""}`;
              } else {
                const maxBound = d1.attribute_maxOccurs === "unbounded";
                if (maxBound) {
                  if (!d1.attribute_ref) {
                    jsonString += `"${d1.attribute_name}":{"type":"array","items":{"type":"${d1.attribute_type.replace("xs:", "")}"}}${coma2 ? "," : ""}`;
                  }
                } else {
                  if (!d1.attribute_ref) {
                    jsonString += `"${d1.attribute_name}":{"type":"${d1.attribute_type.replace("xs:", "")}"}${coma2 ? "," : ""}`;
                  }
                }
              }
            });
          } else if (d["xs:complexType"] && d["xs:complexType"]["xs:simpleContent"]) {
            d["xs:complexType"].attribute_name = d.attribute_name;
            jsonString += generateSimpleContent(d["xs:complexType"], coma, restrictions);
          } else if (d["xs:simpleContent"]) {
            jsonString += generateSimpleContent(d, coma, restrictions);
          } else if (d.attribute_name && d.attribute_type) {
            if (d.attribute_maxOccurs) {
              jsonString += `"${d.attribute_name}":{"type":"array","items":{"type":"${d.attribute_type.replace("xs:", "")}"}}${coma ? "," : ""}`;
            } else {
              jsonString += `"${d.attribute_name}":{"type":"${d.attribute_type.replace("xs:", "")}"}${coma ? "," : ""}`;
            }
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
    let attributes = mainObj["xs:complexType"] && mainObj["xs:complexType"]["xs:attribute"];
    if (mainObj) {
      let keys = Object.keys(mainObj);
      let values = Object.values(mainObj);

      if (keys.length >= 2) {
        if (!Array.isArray(attributes)) attributes = [attributes];
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

exports.xml2xsd = (xmlString) => {
  const jsonObj = parser.parse(xmlString, { ignoreAttributes: false, textNodeName: "extension", attributeNamePrefix: "attribute_" });
  const newSchema = (schema, type) => {
    schema.type = type;
    return schema;
  };
  const options = {
    arrays: { mode: "tuple" },
    postProcessFnc: (type, schema, value, defaultFunc) => (type === "number" ? newSchema(schema, "integer") : defaultFunc(type, schema, value)),
  };
  const schema = toJsonSchema(jsonObj, options);
  // console.log(beautify(schema, null, 2, 100));
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
