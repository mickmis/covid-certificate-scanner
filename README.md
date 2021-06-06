# EU Digital COVID Certificate Scanner
This web application allows to scan any
[EU Digital COVID Certificate](https://ec.europa.eu/info/live-work-travel-eu/coronavirus-response/safe-covid-19-vaccines-europeans/eu-digital-covid-certificate_en)
emitted to extract and display all the information it encloses. It is implemented in Typescript using Angular v11.

The development was made possible by the fact that the specifications of the certificate are in open-access, and the reference implementations are open-source.

## Useful links
- [A reference implementation](https://github.com/ehn-digital-green-development/ehn-sign-verify-javascript-trivial/blob/main/cose_verify.js)
- [Specifications Vol. 3](https://ec.europa.eu/health/sites/default/files/ehealth/docs/digital-green-certificates_v3_en.pdf)
- [Specifications - Value Sets](https://ec.europa.eu/health/sites/default/files/ehealth/docs/digital-green-certificates_dt-specifications_en.pdf)

## Upcoming
- verification of signature
- languages

## What's new
### 06/06/21 - Initial version 
- scan certificates from a camera, an image or from provided examples
- use of value sets for interpreting raw data

# Contact
[Mickaël Misbach](https://github.com/mickmis) - [mickael@misba.ch](mailto:mickael@misba.ch)
