import * as base45 from 'base45';
import * as pako from 'pako';
import * as cbor from 'cbor-web';
import {fromPromise} from 'rxjs/internal-compatibility';
import {map, switchMap, tap} from 'rxjs/operators';
import {Convert, EuDigitalCovidCert121} from './models/eu-digital-covid-cert/eu-digital-covid-cert-121';
import {Observable, of} from 'rxjs';

export class DigitalCovidCertificate {

  /*
   * QR payload:
   * - version prefix: e.g. "HC1:"
   * - payload: zlib-compressed and base45-encoded COSE
   */

  // regex to validate the format of the QR payload and capture its components
  static QrPayloadRegex: RegExp = /^(?<version>HC(?<versionNb>\d))?:?(?<payload>[0-9A-Z $%*+\-.\/:]+)/;

  // the health certificate version prefixing the QR payload, undefined if not present
  qrPayloadVersion?: number;

  /*
   * COSE_Sign structure:
   * - protected: header with algorithm and key identifier
   * - unprotected: empty
   * - payload: contains the CWT that contains the covid certificate
   * - signatures
   */

  // COSE algorithm (key 1 "alg" in protected COSE header)
  coseAlgorithm: number;

  // COSE key identifier (key 4 "kid" in protected COSE header)
  coseKeyId: any;

  // COSE payload (CBOR map containing the CWT claims)
  cosePayload: Map<number, any>;

  // COSE signatures (CBOR array, see https://datatracker.ietf.org/doc/html/rfc8152#section-4.1)
  coseSignatures: Uint8Array;

  /*
   * CWT structure:
   * - iss: issuer
   * - iat: issued at
   * - exp: expiration
   * - hcert: covid certificate
   */

  // issuer of certificate (key 1 "iss" in CWT claims)
  cwtIssuer: string;

  // time the certificate was issued (key 6 "iat" in CWT claims)
  cwtIssuedAt: number;

  // expiration time of the certificate (key 4 "exp" in CWT claims)
  cwtExpirationTime: number;

  // digital covid certificate (key -260 "hcert" in CWT claims; key 1 "eu_dgc_v1" in hcert)
  certificate: EuDigitalCovidCert121;

  static New(_qrPayload: string): Observable<DigitalCovidCertificate> {
    return of(new DigitalCovidCertificate()).pipe(
      switchMap(cert => cert.parseCertificate(cert.parseQrPayload(_qrPayload)))
    );
  }

  // parse, decode and decompress QR payload
  private parseQrPayload(_qrPayload: string): Uint8Array {
    const rgxResults = DigitalCovidCertificate.QrPayloadRegex.exec(_qrPayload);
    if (!rgxResults) {
      throw new Error('invalid QR payload');
    }

    if (rgxResults.groups.version) {
      this.qrPayloadVersion = parseInt(rgxResults.groups.versionNb, 10);
    }

    console.log(`Decoded payload (version ${this.qrPayloadVersion}):`, _qrPayload);
    return pako.inflate(base45.decode(rgxResults.groups.payload));
  }

  // Parse COSE, CWT and certificate. qrPayloadDecoded is the QR payload stripped from its health certificate version,
  // base45-decoded and zlib-decompressed.
  private parseCertificate(qrPayloadDecoded: Uint8Array): Observable<DigitalCovidCertificate> {
    return fromPromise<{err, tag: number, value: Array<Uint8Array>}>(cbor.decodeFirst(qrPayloadDecoded)).pipe(
      tap(cose => {
        this.coseSignatures = cose.value[3];
        fromPromise<Map<number, any>>(cbor.decodeFirst(cose.value[0])).subscribe(protectedHeader => {
          this.coseAlgorithm = protectedHeader.get(1);
          this.coseKeyId = protectedHeader.get(4);

          if (!this.coseKeyId) {
            // the kid might be in the unprotected header
            fromPromise<Map<number, any>>(cbor.decodeFirst(cose.value[1])).subscribe(unprotectedHeader => {
              this.coseKeyId = unprotectedHeader.get(4);
            });
          }
        });
      }),
      switchMap(cose => fromPromise<Map<number, any>>(cbor.decodeFirst(cose.value[2]))),
      map(cwt => {
        if (!cwt || cwt.size === 0) {
          throw new Error(`invalid COSE payload: ${cwt}`);
        }
        this.cosePayload = cwt;
        this.cwtIssuer = cwt.get(1);
        this.cwtIssuedAt = cwt.get(6);
        this.cwtExpirationTime = cwt.get(4);

        const rawCert = cwt.get(-260).get(1);
        this.certificate = Convert.toEuDigitalCovidCert121(JSON.stringify(rawCert));

        console.log(`Parsed digital covid certificate (iss: ${this.cwtIssuer}, iat: ${this.cwtIssuedAt}, ` +
          `exp: ${this.cwtExpirationTime}):`, this.certificate);
        return this;
      })
    );
  }

  get coseAlgorithmName(): string {
    switch (this.coseAlgorithm) {
      case -7:
        return 'ES256';
      case -37:
        return 'PS256';
      default:
        return 'invalid algorithm';
    }
  }
}
