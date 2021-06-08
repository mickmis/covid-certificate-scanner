import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {toHexString, formatDate, timestampToDate} from '../utils';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ValueSetMapper, ValueSet, CertificateContainer, EuDigitalCovidCert121} from 'covid-certificate-parser';

@Component({
  selector: 'app-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss']
})
export class CertificateDialogComponent implements OnInit {

  toHexString = toHexString;
  formatDate = formatDate;
  timestampToDate = timestampToDate;
  ValueSet = ValueSet;

  private valueSetMapper: ValueSetMapper;

  constructor(@Inject(MAT_DIALOG_DATA) private _cert: Observable<CertificateContainer>) {
    this.valueSetMapper = new ValueSetMapper();
  }

  ngOnInit(): void { }

  get cert(): Observable<CertificateContainer> {
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

  getValueFromSet(valueSet: ValueSet, valueCode: string): string {
    return `${this.valueSetMapper.getValue(valueSet, valueCode)} (${valueCode})`;
  }
}
