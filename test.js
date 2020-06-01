const { xml2xsd } = require("./index");

const xmlData = `<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`;

const xsd = xml2xsd(xmlData);
console.log(xsd);
