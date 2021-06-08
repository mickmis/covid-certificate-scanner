import {EuDigitalCovidCert121} from './eu-digital-covid-cert/eu-digital-covid-cert-121';

export class CertificateContainer {

  constructor(qrPayloadVersion: number | undefined, coseAlgorithm: number, coseKeyId: any, cosePayload: Map<number, any>,
              coseSignatures: Uint8Array, cwtIssuer: string, cwtIssuedAt: number, cwtExpirationTime: number,
              certificate: EuDigitalCovidCert121) {
    this.qrPayloadVersion = qrPayloadVersion;
    this.coseAlgorithm = coseAlgorithm;
    this.coseKeyId = coseKeyId;
    this.cosePayload = cosePayload;
    this.coseSignatures = coseSignatures;
    this.cwtIssuer = cwtIssuer;
    this.cwtIssuedAt = cwtIssuedAt;
    this.cwtExpirationTime = cwtExpirationTime;
    this.certificate = certificate;
  }

  /*
   * QR payload:
   * - version prefix: e.g. "HC1:"
   * - payload: zlib-compressed and base45-encoded COSE
   */

  // The health certificate version prefixing the QR payload, undefined if not present.
  qrPayloadVersion?: number;

  /*
   * COSE_Sign structure:
   * - protected: header with algorithm and key identifier
   * - unprotected: empty, might contain the key identifier
   * - payload: contains the CWT that contains the covid certificate
   * - signatures
   */

  // The COSE signing algorithm (key 1 "alg" in protected COSE header).
  coseAlgorithm: number;

  // The COSE key identifier (key 4 "kid" in protected or unprotected COSE header). Most likely a Uint8Array but not guaranteed.
  coseKeyId: any;

  // The COSE payload (CBOR map containing the CWT claims).
  cosePayload: Map<number, any>;

  // The COSE signatures (CBOR array, see https://datatracker.ietf.org/doc/html/rfc8152#section-4.1).
  coseSignatures: Uint8Array;

  /*
   * CWT structure:
   * - iss: issuer
   * - iat: issued at
   * - exp: expiration
   * - hcert: covid certificate
   */

  // The issuer of the certificate (key 1 "iss" in CWT claims).
  cwtIssuer: string;

  // The time (timestamp) the certificate was issued (key 6 "iat" in CWT claims).
  cwtIssuedAt: number;

  // The expiration time (timestamp) of the certificate (key 4 "exp" in CWT claims).
  cwtExpirationTime: number;

  // The actual digital covid certificate (key -260 "hcert" in CWT claims; key 1 "eu_dgc_v1" in hcert).
  certificate: EuDigitalCovidCert121;

  // The COSE signing algorithm name. Restricted to the algorithms allowed by the digital COVID certificate specifications.
  get coseAlgorithmName(): string {
    switch (this.coseAlgorithm) {
      case -7:
        return 'ES256';
      case -37:
        return 'PS256';
      default:
        return '[unsupported]';
    }
  }
}
