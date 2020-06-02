# XSD Library

XML Schema library to convert XML to XSD (XML Schema) using pure javascript.

- Convert XML to XML Schema
- Convert JSON (JS Object) to XML Schema
- XML to JSON Schema
- Detect XML or XML Schema
- Validate XML Schema

##### ToDo

- XML Schema to JSON Schema

### Installation

npm

```sh
$ npm install xsdlibrary
```

yarn

```sh
$ yarn add xsdlibrary
```

### Usage

```js
import { xml2xsd, json2xsd, validateXml, detectXmlSchema, jsonSchema2xsd } from xsdlib;
```

Convert XML to XML Schema

```js
const xmlString = ``; // your xml string
xml2xsd(xmlString); // returns xml schema
```

Convert JSON Schema to XML Schema

```js
const jsonObj = {}; // your javascript object
jsonSchema2xsd(jsonObj); // returns xml schema
```

Validate XML or XML Schema

```js
const xmlString = ""; // your xml or xml schema string
validateXml(xmlString); // returns true if valid or an error object
```

Detect XML or XML Schema

```js
const string = ""; // your xml or xml schema string
detectXmlSchema(string); // returns "xml" or "xsd" or an error object if none
```
