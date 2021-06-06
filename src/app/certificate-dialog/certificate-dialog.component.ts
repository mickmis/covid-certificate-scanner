import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {DigitalCovidCertificate} from '../digital-covid-certificate';
import {EuDigitalCovidCert121} from '../models/eu-digital-covid-cert/eu-digital-covid-cert-121';
import {toHexString, formatDate, timestampToDate} from '../utils';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss']
})
export class CertificateDialogComponent implements OnInit {

  toHexString = toHexString;
  formatDate = formatDate;
  timestampToDate = timestampToDate;

  constructor(@Inject(MAT_DIALOG_DATA) public _cert: Observable<DigitalCovidCertificate>) { }

  ngOnInit(): void { }

  get cert(): Observable<DigitalCovidCertificate> {
    return this._cert;
  }

  get certModel(): Observable<EuDigitalCovidCert121> {
    return this.cert.pipe(map(cert => cert.certificate));
  }

  get names(): Observable<string> {
    return this.cert.pipe(
      map(cert => cert.certificate.nam),
      map(nam => {
      if (nam.fn && nam.gn) {
        return `${nam.fn}, ${nam.gn}`;
      } else if (nam.fn && !nam.gn) {
        return `${nam.fn}`;
      } else if (!nam.fn && nam.gn) {
        return `${nam.gn}`;
      } else {
        return '[missing]';
      }
    }));
  }

  get transliteratedNames(): Observable<string> {
    return this.cert.pipe(
      map(cert => cert.certificate.nam),
      map(nam => `${nam.fnt}${nam.gnt ? ', ' + nam.gnt : ''}`)
    );
  }
}
