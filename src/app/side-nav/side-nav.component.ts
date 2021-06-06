import {Component, OnInit} from '@angular/core';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {CertificatesService} from '../certificates.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  faGithub = faGithub;
  faTwitter = faTwitter;

  constructor(private certService: CertificatesService) {
  }

  ngOnInit(): void {
  }

  get isLoading(): boolean {
    return this.certService.isParsing;
  }
}
