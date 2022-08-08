import { Component, ViewChild, TemplateRef, AfterViewInit, SecurityContext } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { LicenseTextComponent } from '../license-text/license-text.component';

// Welcome screen component (simple component wrapper around welcome.component.html)
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  welcomeText: any = null;
  boilerPlateWelcomeText: any = "Loading welcome text for " + this.configService.getTerminologyName();

  // Constructor
  constructor(private modalService: NgbModal, private cookieService: CookieService, private configService: ConfigurationService, private sanitizer: DomSanitizer, private titleService: Title, private licenseTextComponent: LicenseTextComponent) { }

  ngOnInit() {

  }

  // Post initialization
  ngAfterViewInit() {
    var terminology = this.configService.getTerminology();
    if (terminology.metadata.licenseText) {
      this.licenseTextComponent.checkLicenseText(terminology.terminology, terminology.metadata.licenseText);
    }
    if (!this.cookieService.check('hhsBanner')) {
      this.open(this.content);
    }
    this.titleService.setTitle("EVS Explore");
    this.setWelcomeText();
  }

  getTerminology(): String {
    return this.configService.getTerminologyName() ? this.configService.getTerminologyName() : this.configService.getDefaultTerminologyName();
  }

  setWelcomeText(): any {
    this.configService.getWelcomeText(this.getTerminology()).subscribe(response => {
      this.welcomeText = response;
      document.getElementById("welcomeTextDiv").innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.welcomeText);
    });
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.cookieService.set('hhsBanner', 'accepted', 90);
      console.log('HHS Banner Accepted');
    }, (result) => {
      this.cookieService.set('hhsBanner', 'accepted', 90);
      console.log('HHS Banner Accepted');
    });
  }

}
