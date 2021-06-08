import * as base45 from 'base45';
import * as pako from 'pako';
import * as cbor from 'cbor-web';
import {map, switchMap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {CertificateContainer} from './certificate-container';
import {logError, logInfo} from './utils';
import {Convert} from './eu-digital-covid-cert/eu-digital-covid-cert-121';

export class CertificateParser {

  // The regex to validate the format of the QR payload and capture its components: version, versionNb and payload.
  static QrPayloadRegex: RegExp = /^(?<version>HC(?<versionNb>\d))?:?(?<payload>[0-9A-Z $%*+\-.\/:]+)/;

  // Parse certificate from a QR payload.
  static ParseQrPayload(qrPayload: string): Observable<CertificateContainer> {

    const rgxResults = CertificateParser.QrPayloadRegex.exec(qrPayload);
    if (!rgxResults || !rgxResults.groups) {
      throw logError('Invalid QR payload.');
    }

    let qrPayloadVersion: number | undefined;
    if (rgxResults.groups.version) {
      qrPayloadVersion = parseInt(rgxResults.groups.versionNb, 10);
    }
    logInfo(`Decoded QR payload (version ${qrPayloadVersion ? qrPayloadVersion : 'unknown'}):`, qrPayload);

    // decode base45-encoded and decompress payload
    const decoded = pako.inflate(base45.decode(rgxResults.groups.payload));

    let coseSignatures: any;
    let coseAlgorithm: number;
    let coseKeyId: number;
    return from(cbor.decodeFirst(decoded) as Promise<{err: any, tag: number, value: any}>).pipe(
      map(_decoded => {
        logInfo('Decoded CBOR-encoded QR payload: ', _decoded);

        // extract COSE payload
        let cose: Array<Uint8Array|Map<number, any>>;
        if (!_decoded.tag) {
          // case where the COSE_Sign1 tag is omitted
          cose = _decoded as unknown as Array<Uint8Array>;
        } else if (_decoded.tag === 61 && _decoded.value && _decoded.value.tag === 18) {
          // case where there is a COSE_Sign1 inside CWT
          cose = _decoded.value.value;
        } else if (_decoded.tag === 18) {
          // normal case where he have a COSE_Sign1 message
          cose = _decoded.value;
        } else {
          throw logError(`Unknown CBOR message tag: ${_decoded.tag}.`);
        }

        // extract COSE signatures
        coseSignatures = (cose[3] as Uint8Array);

        // extract COSE headers
        from(cbor.decodeFirst(cose[0]) as Promise<Map<number, any>>).subscribe(protectedHeader => {
          coseAlgorithm = protectedHeader.get(1);

          // extract COSE signing key identifier
          coseKeyId = protectedHeader.get(4);
          if (!coseKeyId) {
            // the kid might be in the unprotected header, either CBOR-encoded or not
            try {
              from(cbor.decodeFirst(cose[1]) as Promise<Map<number, any>>).subscribe(unprotectedHeader => {
                coseKeyId = unprotectedHeader.get(4);
              });
            } catch (e) {
              coseKeyId = (cose[1] as Map<number, any>).get(4);
            }
          }
        });
        return cose;
      }),
      switchMap(cose => from(cbor.decodeFirst(cose[2]) as Promise<Map<number, any>>)),
      map(cwt => {
        if (!cwt || cwt.size === 0) {
          throw logError('Invalid COSE payload.', cwt);
        }

        const cosePayload = cwt;
        const cwtIssuer = cwt.get(1);
        const cwtIssuedAt = cwt.get(6);
        const cwtExpirationTime = cwt.get(4);
        const certificate = Convert.toEuDigitalCovidCert121(JSON.stringify(cwt.get(-260).get(1)));
        logInfo(`Parsed digital covid certificate (iss: ${cwtIssuer}, iat: ${cwtIssuedAt}, ` +
          `exp: ${cwtExpirationTime}):`, certificate);

        return new CertificateContainer(
          qrPayloadVersion,
          coseAlgorithm,
          coseKeyId,
          cosePayload,
          coseSignatures,
          cwtIssuer,
          cwtIssuedAt,
          cwtExpirationTime,
          certificate
        );
      })
    );

  }
}
