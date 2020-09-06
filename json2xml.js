let format = require('xml-formatter')
const beautify = require('json-beautify')

let primaryAttributes = ['minLength', 'maxLength', 'array', '@array', 'default', 'pattern', 'type', 'enum', 'properties', 'format', 'required', 'enumDesc', 'exclusiveMinimum', 'exclusiveMaximum', 'minimum', 'maximum', 'uniqueItems', 'minItems', 'items', 'maxItems', 'isArray']

const ATTR = '@'
const EXT = 'extension'

const converObj = (json) => {
  let xml = ``

  if (json.type === 'object') {
    const itemKeys = Object.keys(json.properties)
    const itemValues = Object.values(json.properties)

    itemKeys.forEach((d, index) => {
      let attrString = ''
      let defaultString = ''
      if (itemValues[index].propeties) {
        let attributes = Object.keys(itemValues[index].properties)

        attributes.forEach((d) => {
          if (primaryAttributes.indexOf(d) === -1) {
            attrString += ` ${d}="${itemValues[index].properties[d]}"`
          }
        })
      }

      if (itemValues[index].default) {
        defaultString = itemValues[index].default
      }

      const keys2 = Object.keys(itemValues[index])

      keys2.forEach((d) => {
        if (primaryAttributes.indexOf(d) === -1) {
          attrString += ` ${d}="${itemValues[index][d]}"`
        }
      })

      if (itemValues[index].type === 'object') {
        xml += `<${d} ${attrString}>`
        xml += `${converObj(itemValues[index])}`
        xml += `</${d}>`
      } else if (itemValues[index].type === 'array') {
        xml += `<${d} array="true" ${attrString}>`
        xml += `${converObj(itemValues[index].items)}`
        xml += `</${d}>`
      } else {
        if (primaryAttributes.indexOf(d) === -1) {
          xml += `<${d}${attrString}>`
          xml += `${defaultString}`
          xml += `</${d}>`
        }
      }
    })
  }

  if (json.type === 'array') {
    const xmlItem = json.items[0]
    const itemKeys = (xmlItem && xmlItem && Object.keys(xmlItem.properties)) || []
    const itemValues = (xmlItem && xmlItem && Object.values(xmlItem.properties)) || []

    itemKeys.forEach((d, index) => {
      let attrString = ''
      let defaultString = ''

      if (itemValues[index].type === 'object') {
        // if (itemValues[index].items[0] && itemValues[index].items[0].properties) {
        const itemKeys = Object.keys(itemValues[index])
        itemKeys.forEach((d) => {
          if (primaryAttributes.indexOf(d) === -1) {
            attrString += ` ${d}="${itemValues[index][d]}"`
          }
        })
        xml += `<${d} ${attrString}>`
        xml += `${converObj(itemValues[index])}`
        xml += `</${d}>`
      } else {
        if (itemValues[index].default) {
          defaultString = itemValues[index].default
        }

        if (itemValues[index].properties) {
          const attributes = Object.keys(itemValues[index].properties)
          attributes.forEach((d) => {
            if (primaryAttributes.indexOf(d) === -1) {
              attrString += ` ${d}="${itemValues[index].properties[d]}"`
            }
            if (d.indexOf(EXT) !== -1) {
              defaultString += itemValues[index].properties[d].default
            }
          })
        }

        if (primaryAttributes.indexOf(d) === -1) {
          xml += `<${d}${attrString}>`
          xml += defaultString
          xml += `</${d}>`
        }
      }
    })
  }
  return xml
}

const convertXml2Json = (json) => {
  return converObj(json)
}

exports.json2xml = (schema) => {
  if (typeof schema === 'string') schema = JSON.parse(schema)
  if (schema && schema.properties && Object.keys(schema.properties).length !== 0) {
    return format(convertXml2Json(schema))
  } else return `<data></data>`
}
