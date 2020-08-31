let format = require('xml-formatter')
let parser = require('fast-xml-parser')
let toJsonSchema = require('to-json-schema')
const { indexOf, keys } = require('lodash')
const beautify = require('json-beautify')

// let primaryAttributes = [
//    'minLength',
//    'maxLength',
//    'default',
//    'pattern',
//    'type',
//    'enum',
//    'properties',
//    'format',
//    'required',
//    'enumDesc',
//    'exclusiveMinimum',
//    'exclusiveMaximum',
//    'minimum',
//    'maximum',
//    'uniqueItems',
//    'minItems',
//    'maxItems',
//    'isArray'
// ]

// const generateExtraTypes = (keysExtra, valuesExtra, key) => {
//    let xmlExtraTypes = ''
//    let minLengthIndex = keysExtra.indexOf('minLength')
//    let minLength = ''

//    let maxLengthIndex = keysExtra.indexOf('maxLength')
//    let maxLength = ''

//    let typeIndex = keysExtra.indexOf('type')
//    let type = valuesExtra[typeIndex]

//    if (minLengthIndex !== -1) {
//       minLength = `<xs:minLength value="${valuesExtra[minLengthIndex]}"/>`
//    }

//    if (maxLengthIndex !== -1) {
//       maxLength = `<xs:maxLength value="${valuesExtra[maxLengthIndex]}"/>`
//    }

//    if (minLengthIndex !== -1 || maxLengthIndex !== -1) {
//       xmlExtraTypes += `<xs:simpleType name="${key}ype">`
//       xmlExtraTypes += `<xs:restriction base="xs:${type}">`
//       xmlExtraTypes += minLength
//       xmlExtraTypes += maxLength
//       xmlExtraTypes += `</xs:restriction>`
//       xmlExtraTypes += `</xs:simpleType>`
//    }
//    return xmlExtraTypes
// }

// const generateComplexTypes = (keysExtra, valuesExtra, key, type) => {
//    let minLengthIndex = keysExtra.indexOf('minLength')
//    let maxLengthIndex = keysExtra.indexOf('maxLength')
//    let defaultIndex = keysExtra.indexOf('default')

//    let keysExtra2 = [] //keysExtra.slice();
//    let valuesExtra2 = [] //valuesExtra.slice();

//    keysExtra.forEach((k, index) => {
//       if (primaryAttributes.indexOf(k) === -1) {
//          keysExtra2.push(k)
//          valuesExtra2.push(valuesExtra[index])
//       }
//    })

//    let baseAttr = ''
//    let defaultAttr = ''

//    if (minLengthIndex !== -1 || maxLengthIndex !== -1) {
//       baseAttr = `base="${key}ype"`
//    }

//    if (defaultIndex !== -1) {
//       defaultAttr = `default="${valuesExtra[defaultIndex]}"`
//    }

//    let xml = ''
//    let isArray = keysExtra.indexOf('isArray') !== -1 ? `maxOccurs="unbounded"` : ''
//    if (keysExtra.length === 2 && keysExtra.indexOf('isArray') !== -1) {
//       xml += `<xs:element ${isArray} type="xs:${type}" ${defaultAttr} name="${key}" />`
//    } else {
//       let attr = ``
//       keysExtra2.forEach((d, index) => {
//          attr += `${d}=${valuesExtra2[index]}`
//          //  xml += `<xs:attribute default="${valuesExtra2[index]}" name="${d.replace(
//          //     'attribute_',
//          //     ''
//          //  )}" type="xs:string"/>`
//       })
//       xml += `<${key} ${attr}>`
//       // <xs:extension ${baseAttr}>
//       // keysExtra2.forEach((d, index) => {
//       //    xml += `<xs:attribute default="${valuesExtra2[index]}" name="${d.replace(
//       //       'attribute_',
//       //       ''
//       //    )}" type="xs:string"/>`
//       // })
//       xml += `</${key}>`
//    }

//    return xml
// }

// const convertToObj = arrayObj => {
//    let obj = {};
//    let arrayObjParams = arrayObj;
//    let arrayObjItems = arrayObjParams.items;
//    if (arrayObjParams.type === "array") {
//       if (!Array.isArray(arrayObjItems)) {
//          arrayObjItems = [arrayObjParams.items];
//       }
//       obj.type = "object";
//       if (Array.isArray(arrayObjItems)) {
//          let commonObjKeys = {};
//          arrayObjItems.forEach(dObj => {
//             if (dObj.type === "object") {
//                Object.keys(dObj.properties).forEach(d1 => {
//                   if (Object.keys(commonObjKeys).indexOf(d1) === -1) {
//                      if (dObj.properties[d1].type === "object") {
//                         Object.keys(dObj.properties).forEach(d2 => {
//                            if (dObj.properties[d2].type === "array") {
//                               dObj.properties[d2] = convertToObj(dObj.properties[d2]);
//                            }
//                         });
//                         commonObjKeys[d1] = dObj.properties[d1];
//                      } else if (dObj.properties[d1].type === "array") {
//                         commonObjKeys[d1] = convertToObj(dObj.properties[d1]);
//                      } else {
//                         commonObjKeys[d1] = dObj.properties[d1];
//                      }
//                   }
//                });
//                obj.properties = commonObjKeys;
//                obj.isArray = true;
//             } else {
//                obj = dObj;
//                obj.isArray = true;
//             }
//          });
//       } else {
//          obj = arrayObjItems;
//          obj.isArray = true;
//       }
//    }
//    return obj;
// };


// const generateObj = (
//    keys,
//    values,
//    hasParent = true,
//    name = '',
//    { keysExtra, valuesExtra } = { keysExtra: [], valuesExtra: [] }
// ) => {
//    let xml = ''
//    let xmlExtraTypes = ''
//    let attributes = []

//    let attributeString = ``

//    if (!hasParent) {
//       keys.forEach((k, i) => {
//          if (k.indexOf('attribute_') !== -1) {
//             attributes.push(k)
//             delete keys[i]
//             delete values[i]
//          }
//       })

//    }

//    if (keys.indexOf('type') === -1) {
//       keys.forEach((d, key) => {
//          let type = values[key].type
//          if (type === 'object') {
//             let obj = values[key]
//             let keys2 = Object.keys(obj.properties)
//             let values2 = Object.values(obj.properties)
//             let keysExtra = Object.keys(obj)
//             let valuesExtra = Object.values(obj)

//             const t = generateObj(keys2, values2, false, null, {
//                keysExtra,
//                valuesExtra
//             })
//             xml += `<${keys[key]}>`
//             xml += t.xml
//             xml += `</${keys[key]}>`
//          } else if (type === 'array') {
//             let obj = convertToObj(values[key])
//             if (obj.properties) {
//                let keys2 = Object.keys(obj.properties)
//                let values2 = Object.values(obj.properties)
//                let keysExtra = Object.keys(obj)
//                let valuesExtra = Object.values(obj)
//                xml += `<${keys[key]}>`
//                xml += generateObj(keys2, values2, false, null, {
//                   keysExtra,
//                   valuesExtra
//                }).xml
//                xml += `</${keys[key]}`
//             } else {
//                xml += `<xs:element maxOccurs="unbounded" type="xs:${obj.type}" name="${keys[key]}" />`
//             }
//          } else if (typeof type === 'string' && type.length > 0) {
//             let keysExtra = Object.keys(values[key])
//             let valuesExtra = Object.values(values[key])

//             let defaultInline = ''
//             if (keysExtra.indexOf('default') !== -1) {
//                defaultInline = `${values[key].default}`
//             }

//             if (keysExtra.length > 1 && !(keysExtra.length === 2 && keysExtra[1] === 'default')) {
//                xmlExtraTypes += generateExtraTypes(keysExtra, valuesExtra, keys[key])
//                xml += generateComplexTypes(keysExtra, valuesExtra, keys[key], type)
//             } else {
//                if (keys[key] !== 'extension') {
//                   xml += `<${keys[key]}>${defaultInline}</${keys[key]}>`
//                } else {
//                   if (attributes.length > 0) {
//                      attributes.forEach(d => {
//                         attributeString += `${d.replace(
//                            'attribute_',
//                            ''
//                         )}`
//                      })
//                   } else {
//                      xml += `<xs:extension base="xs:${type}"/>`
//                   }
//                }
//             }
//          }
//       })
//    } else {
//       let type = values[keys.indexOf('type')]
//       let defaultInline = ''
//       if (keys.indexOf('default') !== -1) {
//          defaultInline = `default="${values[keys.indexOf('default')]}"`
//       }

//       let keysExtra = keys
//       let valuesExtra = values
//       if (type === 'string' && keys.length === 1) {
//          xml += `<xs:element ${defaultInline} type="xs:${type}" name="${name}_item"/>`
//       } else if (type === 'string' && keys.length > 1) {
//          xmlExtraTypes += generateExtraTypes(keysExtra, valuesExtra, name)
//          xml += generateComplexTypes(keysExtra, valuesExtra, name, type)
//       }
//    }

//    if (!hasParent) {
//       keysExtra.forEach(d => {
//          if (primaryAttributes.indexOf(d) === -1) {
//             attributes.push(d)
//          }
//       })

//       if (attributes.length > 0 && keys.indexOf('extension') !== -1) {

//       } else {
//          xml += `</xs:sequence>`
//          if (attributes.length > 0) {
//             attributes.forEach((attr, index) => {
//                if (attr.indexOf('xsi') === -1 && attr.indexOf('xmlns') === -1) {
//                   let defaultval = valuesExtra[keysExtra.indexOf(attr)]
//                      ? `default="${valuesExtra[keysExtra.indexOf(attr)]}"`
//                      : ''
//                   xml += `<xs:attribute name="${attr.replace(
//                      'attribute_',
//                      ''
//                   )}" ${defaultval} type="xs:string"/>`
//                }
//             })
//          }
//          xml += `</xs:complexType>`
//       }
//    }
//    return { xml, xmlExtraTypes, attributeString }
// }

// const OBJtoXSDElement = obj => {
//    let xml = ``
//    let xmlExtraTypes = ``
//    let type = obj.type

//    let rootKeys = Object.keys(obj)
//    let rootValues = Object.values(obj)

//    let i1 = rootKeys.indexOf('type')
//    let i2 = rootKeys.indexOf('properties')
//    let i3 = rootKeys.indexOf('required')

//    delete rootKeys[i1] && rootValues[i1]
//    delete rootKeys[i2] && rootValues[i2]
//    delete rootKeys[i3] && rootValues[i3]

//    if (type === 'object') {
//       let keys = Object.keys(obj.properties)
//       let values = Object.values(obj.properties)
//       let keysExtra = Object.keys(obj)
//       let valuesExtra = Object.values(obj)

//       if (keys.length === 0) {
//          xml += `<xs:element name="root">`
//          xml += `</xs:element>`
//       }

//       if (keys.length > 1) {
//          let title = ''
//          let description = ''

//          if (obj.title) {
//             title = `title="${obj.title}"`
//          }

//          if (obj.description) {
//             description = `description="${obj.description}"`
//          }

//          xml += `<xs:element ${title} ${description} name="root">`
//          xml += `<xs:complexType>`
//          xml += `<xs:sequence>`
//       }
//       let xmlObj = generateObj(keys, values, true, null, {
//          keysExtra,
//          valuesExtra
//       })
//       xmlExtraTypes = xmlObj.xmlExtraTypes
//       xml += xmlObj.xml
//       if (keys.length > 1) {
//          xml += `</xs:element>`
//          xml += `</xs:sequence>`
//          xml += `</xs:complexType>`
//       }
//    }
//    xml += xmlExtraTypes
//    rootKeys.forEach((d, index) => {
//       xml += `<xs:attribute default="${rootValues[index]}" name="${d}" type="xs:string"/>`
//    })
//    xml += ``
//    xml = xml.replace(/<\/?[0-9]{1,}>/g, '')
//    return xml
// }

const ATTR = '@'
const EXT = 'extension'

converObj = (json) => {
   let xml = ``


   if (json.type === "object") {
      const itemKeys = Object.keys(json.properties);
      const itemValues = Object.values(json.properties)

      itemKeys.forEach((d, index) => {
         let attrString = ''
         let defaultString = ''
         if (itemValues[index].propeties) {
            let attributes = Object.keys(itemValues[index].properties);

            attributes.forEach(d => {
               if (d.indexOf(ATTR) !== -1) {
                  attrString += ` ${d.replace(ATTR, '')}="${itemValues[index].properties[d]}"`
               }
            })
         }

         if (itemValues[index].default) {
            defaultString = itemValues[index].default
         }

         const keys2 = Object.keys(itemValues[index]);
         keys2.forEach(d => {
            if (d.indexOf(ATTR) !== -1) {
               attrString += ` ${d.replace(ATTR, '')}="${itemValues[index][d]}"`
            }
         })

         if (itemValues[index].type === "object" || itemValues[index].type === "array") {
            if (itemValues[index].type === 'array') {
               if (itemValues[index].items[0] && itemValues[index].items[0].properties) {
                  const itemKeys = Object.keys(itemValues[index].items[0].properties);
                  itemKeys.forEach(d => {
                     if (d.indexOf("@") !== -1) {
                        attrString += ` ${d.replace(ATTR, '')}="${itemValues[index].items[0].properties[d]}"`
                     }
                  })
               }
            }

            xml += `<${d} ${attrString}>`
            xml += `${converObj(itemValues[index])}`
            xml += `</${d}>`

         } else {

            if (d.indexOf(ATTR) === -1) {
               xml += `<${d}${attrString}>`
               xml += `${defaultString}`
               xml += `</${d}>`
            }
         }
      })
   }

   if (json.type === "array") {
      const itemKeys = Object.keys(json.items[0].properties)
      const itemValues = Object.values(json.items[0].properties)

      itemKeys.forEach((d, index) => {
         let attrString = ''
         let defaultString = ''

         if (itemValues[index].properties) {
            const attributes = Object.keys(itemValues[index].properties)
            attributes.forEach(d => {
               if (d.indexOf(ATTR) !== -1) {
                  attrString += ` ${d.replace(ATTR, '')}="${itemValues[index].properties[d]}"`
               }
               if (d.indexOf(EXT) !== -1) {
                  defaultString += itemValues[index].properties[d].default
               }
            })
         }

         if (itemValues[index].default) {
            defaultString = itemValues[index].default
         }


         if (d.indexOf(ATTR) === -1) {
            xml += `<${d}${attrString}>`
            xml += defaultString
            xml += `</${d}>`
         }
      })
   }
   return xml;
}

const convertXml2Json = (json) => {
   return converObj(json)
}

exports.json2xml = schema => {
   //  schema = toJsonSchema(schema)
   //  console.log(JSON.stringify(schema))
   return format(convertXml2Json(schema))
}
