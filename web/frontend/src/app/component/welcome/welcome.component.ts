import { Component, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { GeneralSearchComponent } from '../general-search/general-search.component';

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
    private generalSearchComponent: GeneralSearchComponent, private titleService: Title) { }

  // Post initialization
  ngAfterViewInit() {
    if (!this.cookieService.check('hhsBanner')) {
      this.open(this.content);
    }
    this.titleService.setTitle("EVS Explore");
  }

  getTerminology(): String {
    return this.generalSearchComponent.selectedTerminology.terminology ? this.generalSearchComponent.selectedTerminology.terminology : 'ncit';
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
