import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SideNavComponent } from './side-nav/side-nav.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {AppRoutingModule} from './app-routing.module';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MainComponent} from './main/main.component';
import { CertificateDialogComponent } from './certificate-dialog/certificate-dialog.component';
import {CertificatesService} from './certificates.service';
import {NgpImagePickerModule} from 'ngp-image-picker';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from '@angular/material/snack-bar';
import {ValueSetsService} from './value-sets.service';

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    MainComponent,
    CertificateDialogComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    NgpImagePickerModule,
    MatSnackBarModule,
  ],
  providers: [
    CertificatesService,
    ValueSetsService,
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true, appearance: 'fill'}},
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 5000}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
