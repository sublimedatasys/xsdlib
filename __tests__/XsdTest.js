import fs from "fs";
const { xsd2jsonSchema, xml2json } = require('../')

const readModuleFile = (
  path,
  callback
) => {
  try {
    const filename = require.resolve(path);
    fs.readFile(filename, "utf8", callback);
  } catch (e) {
    callback(e, "");
  }
};

it("Parse complex content xml2json", (done) => {
  readModuleFile("./XsdData.xsd", (_err, xsdText) => {
    const jsonO = xml2json(xsdText)
    expect(JSON.parse(jsonO)).toMatchSnapshot();
    done();
  });
});

it("Parse xsd restrictions", () => {
  const jsonO = xsd2jsonSchema(`
  <?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
    <xs:element name="TestElemet" type="GhbdtnId_Struct">
      <xs:annotation>
        <xs:documentation>Complex test element</xs:documentation>
      </xs:annotation>
    </xs:element>
	<xs:complexType name="GhbdtnId_Struct" final="#all">
		<xs:annotation>
			<xs:documentation>Ghwpa kwdfp  ghwp</xs:documentation>
		</xs:annotation>
		<xs:sequence>
			<xs:element name="Hps" type="Long_Type">
				<xs:annotation>
					<xs:documentation>Id kwdfp</xs:documentation>
				</xs:annotation>
			</xs:element>
			<xs:element name="Unc" type="SomeIdVariation48_Type">
				<xs:annotation>
					<xs:documentation>Id sfdwg</xs:documentation>
				</xs:annotation>
			</xs:element>
			<xs:element name="Xfw" type="Date_Type">
				<xs:annotation>
					<xs:documentation>Sdfs dghfd</xs:documentation>
				</xs:annotation>
			</xs:element>
			<xs:element name="SFwsdf" type="String4000_Type">
				<xs:annotation>
					<xs:documentation>sdfsd sdfsdf</xs:documentation>
				</xs:annotation>
			</xs:element>
			<xs:element name="SFwsdf2">
				<xs:annotation>
					<xs:documentation>sdfsd sdfsdf</xs:documentation>
				</xs:annotation>
        <xs:simpleType>
          <xs:restriction base="xs:string">
            <xs:maxLength value="5000"/>
          </xs:restriction>
        </xs:simpleType>
			</xs:element>
		</xs:sequence>
	</xs:complexType>
	<xs:simpleType name="Long_Type">
		<xs:annotation>
			<xs:documentation/>
		</xs:annotation>
		<xs:restriction base="xs:long"/>
	</xs:simpleType>
	<xs:simpleType name="SomeIdVariation48_Type">
		<xs:restriction base="xs:string">
			<xs:pattern value="([0-9]|[A-F]){48}"/>
		</xs:restriction>
	</xs:simpleType>
	<xs:simpleType name="Date_Type">
		<xs:annotation>
			<xs:documentation>Date</xs:documentation>
		</xs:annotation>
		<xs:restriction base="xs:date"/>
	</xs:simpleType>
	<xs:simpleType name="String4000_Type">
		<xs:restriction base="xs:string">
			<xs:maxLength value="4000"/>
		</xs:restriction>
	</xs:simpleType>
  </xs:schema>
`)
  expect(JSON.parse(jsonO)).toMatchSnapshot();
});

it("Parse xsd extention", () => {
  const jsonO = xsd2jsonSchema(`
  <?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
    <xs:element name="TestElemet" type="BDtPrasd">
      <xs:annotation>
        <xs:documentation>Complex test element</xs:documentation>
      </xs:annotation>
    </xs:element>

    <xs:complexType name="BDtPrasd">
		<xs:annotation>
			<xs:documentation>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque perspiciatis possimus corrupti laboriosam reiciendis repellendus iure? Cum recusandae distinctio officiis ipsa ratione voluptatum eum provident officia, fugiat, maiores esse nesciunt.</xs:documentation>
		</xs:annotation>
		<xs:complexContent>
			<xs:extension base="BDtBase">
				<xs:sequence>
					<xs:element name="Fsap" type="String64_Type" minOccurs="0">
						<xs:annotation>
							<xs:documentation>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolores cupiditate delectus atque quae, error, sequi at quas unde earum provident expedita recusandae assumenda sint corrupti odio laboriosam. Saepe, voluptatem laborum!</xs:documentation>
						</xs:annotation>
					</xs:element>
					<xs:element name="DateGFwp" type="Date_Type" minOccurs="0">
						<xs:annotation>
							<xs:documentation>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit impedit cumque accusamus porro! Quo, nisi corporis obcaecati temporibus unde quisquam odit dignissimos! Voluptates sequi placeat eveniet perferendis repellat cumque numquam!</xs:documentation>
						</xs:annotation>
					</xs:element>
					<xs:element name="Npwfd" type="String4000_Type" minOccurs="0">
						<xs:annotation>
							<xs:documentation>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam, voluptates voluptatem eius mollitia cupiditate odio, nemo qui dolorum placeat alias sunt. Nam non voluptatibus, itaque magni similique saepe! Maxime, nisi.</xs:documentation>
						</xs:annotation>
					</xs:element>
				</xs:sequence>
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
  <xs:complexType name="BDtBase" abstract="true">
		<xs:annotation>
			<xs:documentation>Base</xs:documentation>
		</xs:annotation>
		<xs:sequence>
			<xs:element name="Prasd" type="Prasd_Struct">
				<xs:annotation>
					<xs:documentation>Prasd</xs:documentation>
				</xs:annotation>
			</xs:element>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="Prasd_Struct">
		<xs:annotation>
			<xs:documentation>Prasd asdfa</xs:documentation>
		</xs:annotation>
		<xs:sequence>
			<xs:element name="Apwoe" type="Max100_Type" minOccurs="0">
				<xs:annotation>
					<xs:documentation>Prasd dfe</xs:documentation>
				</xs:annotation>
			</xs:element>
			<xs:element name="Ghbdtn" type="SomeIdVariation48_Type" minOccurs="0">
				<xs:annotation>
					<xs:documentation>Prasd fgher</xs:documentation>
				</xs:annotation>
			</xs:element>
		</xs:sequence>
  </xs:complexType>

	<xs:simpleType name="String64_Type">
		<xs:restriction base="xs:string">
			<xs:maxLength value="64"/>
		</xs:restriction>
	</xs:simpleType>
  <xs:simpleType  name="Max100_Type">
  <xs:restriction base="xs:integer">
    <xs:minInclusive value="0"/>
    <xs:maxInclusive value="100"/>
  </xs:restriction>
</xs:simpleType>
	<xs:simpleType name="Long_Type">
		<xs:annotation>
			<xs:documentation/>
		</xs:annotation>
		<xs:restriction base="xs:long"/>
	</xs:simpleType>
	<xs:simpleType name="SomeIdVariation48_Type">
		<xs:restriction base="xs:string">
			<xs:pattern value="([0-9]|[A-F]){48}"/>
		</xs:restriction>
	</xs:simpleType>
	<xs:simpleType name="Date_Type">
		<xs:annotation>
			<xs:documentation>Date</xs:documentation>
		</xs:annotation>
		<xs:restriction base="xs:date"/>
	</xs:simpleType>
	<xs:simpleType name="String4000_Type">
		<xs:restriction base="xs:string">
			<xs:maxLength value="4000"/>
		</xs:restriction>
	</xs:simpleType>
  </xs:schema>
`)
  expect(JSON.parse(jsonO)).toMatchSnapshot();
});

it("Parse xsd array", () => {
  const jsonO = xsd2jsonSchema(`

  <?xml version="1.0" encoding="UTF-8"?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
    <xs:element name="TestElemet" type="A1_Struct">
    </xs:element>

  <xs:complexType name="A1_Struct">
		<xs:complexContent>
			<xs:extension base="RSt_Struct">
				<xs:sequence>
					<xs:element name="Dt" type="Date_Type">
					</xs:element>
					<xs:element name="ChSrv" type="Ch_struct" minOccurs="0" maxOccurs="unbounded">
					</xs:element>
					<xs:element name="Dt2" type="Date_Type">
					</xs:element>
					<xs:element name="Ch2" type="Ch_struct2">
					</xs:element>
				</xs:sequence>
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
	<xs:complexType name="RSt_Struct">
		<xs:sequence>
			<xs:element name="Rdg" type="String64_Type">
			</xs:element>
			<xs:element name="Rdt" type="Max100_Type">
			</xs:element>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="Ch_struct">
		<xs:sequence>
			<xs:element name="Wdt" type="String4000_Type">
			</xs:element>
			<xs:element name="Srv" type="Long_Type">
			</xs:element>
		</xs:sequence>
	</xs:complexType>
	<xs:complexType name="Ch_struct2">
		<xs:sequence>
			<xs:element name="Wdt" type="String4000_Type">
			</xs:element>
			<xs:element name="Srv" type="Long_Type">
			</xs:element>
      <xs:element name="ChSrv" type="Ch_struct" minOccurs="0" maxOccurs="unbounded">
      </xs:element>
		</xs:sequence>
	</xs:complexType>

	<xs:simpleType name="String64_Type">
		<xs:restriction base="xs:string">
			<xs:maxLength value="64"/>
		</xs:restriction>
	</xs:simpleType>
  <xs:simpleType  name="Max100_Type">
  <xs:restriction base="xs:integer">
    <xs:minInclusive value="0"/>
    <xs:maxInclusive value="100"/>
  </xs:restriction>
</xs:simpleType>
	<xs:simpleType name="Long_Type">
		<xs:annotation>
			<xs:documentation/>
		</xs:annotation>
		<xs:restriction base="xs:long"/>
	</xs:simpleType>
	<xs:simpleType name="SomeIdVariation48_Type">
		<xs:restriction base="xs:string">
			<xs:pattern value="([0-9]|[A-F]){48}"/>
		</xs:restriction>
	</xs:simpleType>
	<xs:simpleType name="Date_Type">
		<xs:annotation>
			<xs:documentation>Date</xs:documentation>
		</xs:annotation>
		<xs:restriction base="xs:date"/>
	</xs:simpleType>
	<xs:simpleType name="String4000_Type">
		<xs:restriction base="xs:string">
			<xs:maxLength value="4000"/>
		</xs:restriction>
	</xs:simpleType>
  </xs:schema>
`)
  expect(JSON.parse(jsonO)).toMatchSnapshot();
});

it("Parse complex content xsd2jsonSchema", (done) => {
  readModuleFile("./XsdData.xsd", (err, xsdText) => {
    const jsonO = xsd2jsonSchema(xsdText)
    expect(JSON.parse(jsonO)).toMatchSnapshot();
    done();
  });
});

it('Parse xsd has no complex types', () => {
	const jsonO = xsd2jsonSchema(`
  	<?xml version="1.0" encoding="UTF-8"?>
	<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
	  <xs:element name="TestElemet" type="SomeIdVariation48_Type">
	  </xs:element>
	  <xs:simpleType name="SomeIdVariation48_Type">
		  <xs:restriction base="xs:string">
			  <xs:pattern value="[0-9]{4}"/>
		  </xs:restriction>
	  </xs:simpleType>
	</xs:schema>
  `)
	expect(JSON.parse(jsonO)).toMatchSnapshot();
});

it('Parse xsd pattern extra escaping characters dot', () => {
	  const jsonO = xsd2jsonSchema(`
		<?xml version="1.0" encoding="UTF-8"?>
	  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
		<xs:element name="TestElemet" type="SomeIdVariation48_Type">
		</xs:element>
		<xs:complexType name="Ch_struct2">
			<xs:sequence>
				<xs:element name="Wdt" type="xs:string">
				</xs:element>
			</xs:sequence>
		</xs:complexType>
		<xs:simpleType name="SomeIdVariation48_Type">
			<xs:restriction base="xs:string">
				<xs:pattern value="(\\.[0-9]{3})?"/>
			</xs:restriction>
		</xs:simpleType>
	  </xs:schema>
	`)
	  expect(JSON.parse(jsonO)).toMatchSnapshot();
});

it('Parse xsd pattern extra escaping characters plus', () => {
	  const jsonO = xsd2jsonSchema(`
		<?xml version="1.0" encoding="UTF-8"?>
	  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified" attributeFormDefault="unqualified">
		<xs:element name="TestElemet" type="SomeIdVariation48_Type">
		</xs:element>
		<xs:complexType name="Ch_struct2">
			<xs:sequence>
				<xs:element name="Wdt" type="xs:string">
				</xs:element>
			</xs:sequence>
		</xs:complexType>
		<xs:simpleType name="SomeIdVariation48_Type">
			<xs:restriction base="xs:string">
				<xs:pattern value="((-|\\+)[0-9]{2}:[0-9]{2})?)?)?"/>
			</xs:restriction>
		</xs:simpleType>
	  </xs:schema>
	`)
	  expect(JSON.parse(jsonO)).toMatchSnapshot();
});
