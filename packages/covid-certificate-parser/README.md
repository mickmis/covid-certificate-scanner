# EU Digital COVID Certificate Parser
This package provides a library to easily parse and extract data from 
[EU Digital COVID Certificates](https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en)
(previously known as EU Digital Green Certificate).

The development of this package was made possible by the fact that the specifications of the certificate are in open-access, and the reference implementations are open-source.
The package and its author are in no way affiliated, associated, authorized, endorsed by, or officially connected with the EU or any other government agency.

## Features
- Extract from QR payload all the metadata and data of certificate;
- Map coded values to their human-readable names;
- Support for versions of the certificates and value sets up to version 1.2.1, as defined by the [reference JSON schemas](https://github.com/ehn-digital-green-development/ehn-dgc-schema).

## Demo
Visit https://mickmis.github.io/covid-certificate-scanner/

## How to use
### Typescript example of how to parse a QR payload and use the value set mapper
```typescript
import {ValueSetMapper, ValueSet, CertificateContainer} from 'covid-certificate-parser';

import QrScanner from 'qr-scanner';
import {switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

// this example digital covid certificate contains one vaccination certificate
const testImageUrl = 'https://mickmis.github.io/covid-certificate-scanner/assets/1.png';

// use for example the npm package qr-scanner to scan a QR from the image
fromPromise(QrScanner.scanImage(testImageUrl)).pipe(
    // the parser takes as input a string containing the QR payload
    switchMap((qrPayload: string) => CertificateParser.ParseQrPayload(qrPayload)),
).subscribe((certContainer: CertificateContainer) => {
    
  // extract some information about the CBOR/COSE container of the certificate
  console.log(`Issuer of the signature of the certificate: ${certContainer.cwtIssuer}`);
  console.log(`Key identifier of the signature: ${certContainer.coseKeyId}`);

  // extract some information about the vaccination certificate
  console.log(`Dose number: ${certContainer.certificate.v[0].dn}`);
  console.log(`Total doses: ${certContainer.certificate.v[0].sd}`);
  
  // use the provided value sets to interpret some certificate data
  const valueSetMapper = new ValueSetMapper();
  console.log(`Country of vaccination: ${valueSetMapper.getValue(ValueSet.CountryCode, certContainer.certificate.v[0].co)}`);
  console.log(`Name of vaccine: ${valueSetMapper.getValue(ValueSet.Vaccine, certContainer.certificate.v[0].mp)}`);

}, err => console.log(err));
```

## TODO
- add signature verification
