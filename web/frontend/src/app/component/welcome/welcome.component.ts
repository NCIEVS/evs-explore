import { Component, ViewChild, TemplateRef, SecurityContext, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { ActivatedRoute } from '@angular/router';

// Welcome screen component (simple component wrapper around welcome.component.html)
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  welcomeText: any = null;
  boilerPlateWelcomeText: any = 'Loading welcome text for ' + this.configService.getTerminologyName() + ' ...';
  allTerminologies: any = null;
  private subscription = null;

  // Constructor
  constructor(
    private modalService: NgbModal,
    private cookieService: CookieService,
    private configService: ConfigurationService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute) {
    this.setupPage();
  }

  // On init, set up a terminology change subscription
  ngOnInit() {
    this.setupPage();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  setupPage() {
    this.route.queryParams
      .subscribe(params => {
        if (params.terminology != "multi") {
          this.subscription = this.configService.getSubject().subscribe(terminology => {
            this.setWelcomeText(terminology.terminology);
          });
          this.configService.setMultiSearch(false);
        } else {
          this.configService.setMultiSearch(true);
        }
        this.allTerminologies = this.configService.getTerminologies().map((terminology) => {
          return {
            label: terminology.metadata.uiLabel.replace(/\:.*/, ""),
            value: terminology,
            description: terminology.metadata.uiLabel.replace(/.*?\: /, ""),
          };
        });
        // filter for list of terminologies presented
        this.allTerminologies = this.allTerminologies.filter(this.configService.terminologySearchListFilter);
      }
      );
  }

  // Post initialization, check hhs banner and set welcome text
  ngAfterViewInit() {
    if (!this.cookieService.check('hhsBanner')) {
      this.open(this.content);
    }
    this.titleService.setTitle('EVS Explore');
    this.setWelcomeText(this.configService.getTerminologyName());
  }

  // Sets the welcome text
  setWelcomeText(terminology: String): any {
    this.configService.getWelcomeText(terminology).subscribe(response => {
      this.welcomeText = response;
      if (document.getElementById('welcomeTextDiv')) {
        document.getElementById('welcomeTextDiv').innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.welcomeText);
      }
    });
  }

  // Opens the HHS banner
  open(content: TemplateRef<any>) {
    var modalref = this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' });
    modalref.result.then((result) => {
      this.cookieService.set('hhsBanner', 'accepted', 90);
      console.log('HHS Banner Accepted');
      modalref.close();
    }, (result) => {
      this.cookieService.set('hhsBanner', 'accepted', 90);
      console.log('HHS Banner Accepted');
      modalref.close();
    });
  }

  getMultiSearch() {
    return this.configService.getMultiSearch();
  }

}
