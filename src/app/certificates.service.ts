import { Injectable } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {CertificateDialogComponent} from './certificate-dialog/certificate-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CertificateContainer} from 'covid-certificate-parser';

@Injectable({
  providedIn: 'root'
})
export class CertificatesService {

  private readonly _cert: ReplaySubject<CertificateContainer>;

  private parsingCount: number;

  constructor(private dialogService: MatDialog, private snackBarService: MatSnackBar) {
    this._cert = new ReplaySubject<CertificateContainer>(1);
    this.parsingCount = 0;
  }

  setCert(cert: CertificateContainer): void {
    this._cert.next(cert);
  }

  onParseStart(): void {
    this.parsingCount++;
  }

  onParseSuccess(cert: CertificateContainer): void {
    this.parsingCount--;
    this.setCert(cert);
    this.dialogService.open(CertificateDialogComponent, {data: this.cert});
  }

  onParseError(errMsg: string): void {
    this.parsingCount--;
    console.error(errMsg);
    this.snackBarService.open(errMsg, 'Close');
  }

  get cert(): Observable<CertificateContainer> {
    return this._cert;
  }

  get isParsing(): boolean {
    return this.parsingCount > 0;
  }
}
