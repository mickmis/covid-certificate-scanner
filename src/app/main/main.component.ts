import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import QrScanner from 'qr-scanner';
import QrScannerWorkerPath from '!!file-loader!../../../node_modules/qr-scanner/qr-scanner-worker.min.js';
import {switchMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';
import {DigitalCovidCertificate} from '../digital-covid-certificate';
import {CertificatesService} from '../certificates.service';
import {ImagePickerConf} from 'ngp-image-picker';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @ViewChild('webcam', {read: ElementRef, static: true}) webcamRef: ElementRef;
  qrScanner: QrScanner;
  imagePickerConf: ImagePickerConf = {
    borderRadius: '5px',
    language: 'en',
    width: '320px',
    height: '240px',
    compressInitial: false,
    hideDeleteBtn: true,
    hideDownloadBtn: true,
    hideEditBtn: true,
  };

  constructor(private certService: CertificatesService) {
    QrScanner.WORKER_PATH = QrScannerWorkerPath;
  }

  ngOnInit(): void {
    this.qrScanner = new QrScanner(this.webcamRef.nativeElement, qrPayload => {
      this.certService.onParseStart();
      this.qrScanner.stop();
      DigitalCovidCertificate.New(qrPayload)
        .subscribe(cert => this.certService.onParseSuccess(cert), err => this.certService.onParseError(err));
    });
  }

  loadCertFromImage(image: string | HTMLCanvasElement | HTMLVideoElement | ImageBitmap | HTMLImageElement | File | URL): void {
    this.certService.onParseStart();
    fromPromise(QrScanner.scanImage(image)).pipe(
      switchMap(qrPayload => DigitalCovidCertificate.New(qrPayload)),
    ).subscribe(cert => this.certService.onParseSuccess(cert), err => this.certService.onParseError(err));
  }

  onImageChange(image): void {
    this.loadCertFromImage(image);
  }
}
