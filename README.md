# XSD Library

XML Schema library to convert XML to XSD (XML Schema) using pure javascript.

- Convert XML to XML Schema
- Convert JSON (JS Object) to XML Schema
- XML to JSON Schema

##### ToDo

- XML Schema to JSON Schema

### Installation

npm

```sh
$ npm install xsdlib
```

yarn

```sh
$ yarn add xsdlib
```

### Usage

```js
import { xml2xsd, json2xsd } from xsdlib;
```

```js
const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`; // your xml string

const xmlSchema = xml2xsd(xmlString);
console.log(xmlSchema);

// returns xml schema
/* <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="note">
        <xs:complexType>
            <xs:sequence>
                <xs:element type="xs:string" name="to"/>
                <xs:element type="xs:string" name="from"/>
                <xs:element type="xs:string" name="heading"/>
                <xs:element type="xs:string" name="body"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
</xs:schema> */
```
