import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { environment } from 'src/environments/environment';

// Welcome screen component (simple component wrapper around welcome.component.html)
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  // Constructor
  constructor(private modalService: NgbModal, private cookieService: CookieService,
    private configService: ConfigurationService) { }

  // Post initialization
  ngAfterViewInit() {
    if (!this.cookieService.check('hhsBanner')) {
      this.open(this.content);
    }
  }

  getTerminology(): String {
    return this.configService.getTerminology().terminology;
  }

  getSubsetLink(): String {
    return window.location.origin + "/subsets/" + this.getTerminology();
  }

  getApiURL() {
    return environment.swagger;
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
