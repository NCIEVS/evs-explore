import { Component, ViewChild, TemplateRef, SecurityContext, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

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
  selectedMultiTerminologies = new Set();
  checkboxStates: { [key: string]: boolean } = {}; // track the state of the checkbox based on terminology
  private subscription = null;

  // Constructor
  constructor(
    private modalService: NgbModal,
    private cookieService: CookieService,
    private configService: ConfigurationService,
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private route: ActivatedRoute,
    private appComponent: AppComponent) {
  }

  // On init, set up a terminology change subscription
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (Object.keys(params).length > 0 && params.terminology !== 'multi' && !params.terminology.includes(',')) {
          this.setWelcomeText(params.terminology);
          this.configService.setMultiSearch(false);
        } else if (Object.keys(params).length > 0) {
          if (params.terminology.includes(',')) {
            // populating saved terminologies in url
            params.terminology.split(',').forEach(term => {
              this.selectedMultiTerminologies.add(term);
            });

          }
          this.configService.setMultiSearch(true);
        }
        this.allTerminologies = this.configService.getTerminologies().map((terminology) => {
          // initialize checkboxStates for each terminology
          const normalizedTerm = terminology.metadata.uiLabel.replace(/\:.*/, '').toLowerCase();
          this.checkboxStates[normalizedTerm] = false;
          // set the checkbox state based on the selected terminologies
          return {
            label: terminology.metadata.uiLabel.replace(/\:.*/, ''),
            value: terminology,
            description: terminology.metadata.uiLabel.replace(/.*?\: /, ''),
          };
        });
        // filter for list of terminologies presented
        this.allTerminologies = this.allTerminologies.filter(this.configService.terminologySearchListFilter);
        if (this.configService.getMultiSearch()) {
          this.allTerminologies.sort(this.ncitNcimMultiSearchSort);
        }
      });
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Post initialization, check hhs banner and set welcome text
  ngAfterViewInit(): void {
    if (!this.cookieService.check('hhsBanner')) {
      this.open(this.content);
    }
    this.titleService.setTitle('EVS Explore');
    this.setWelcomeText(this.configService.getTerminologyName());
  }

  // Sorts the multi-search dropdown
  ncitNcimMultiSearchSort(a, b) {
    if (a.value.terminology === 'ncit') {
      return -1;
    }
    if (b.value.terminology === 'ncit') {
      return 1;
    }
    if (a.value.terminology === 'ncim') {
      return -1;
    }
    if (b.value.terminology === 'ncim') {
      return 1;
    }
    return 0;
  }

  // Sets the welcome text
  setWelcomeText(terminology: string): void {
    this.configService.getWelcomeText(terminology).subscribe(response => {
      this.welcomeText = response;
      if (document.getElementById('welcomeTextDiv')) {
        document.getElementById('welcomeTextDiv').innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.welcomeText);
      }
    });
  }

  // Opens the HHS banner
  open(content: TemplateRef<any>): void {
    const modalref = this.modalService.open(content, {
      size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });
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

  // Returns the multi-search flag
  getMultiSearch(): boolean {
    return this.configService.getMultiSearch();
  }

  // Handles multi-select dropdown changes. Checks the license when applicable and (un)checks box
  // based on the response from checkLicenseText
  onChangeMultiSelect(event): void {
    const normalizedTerm = event.value.value.terminology.toString().toLowerCase();
    // check if the license text is accepted, the perform the checkbox action
    this.appComponent.checkLicenseText(normalizedTerm).then((isLicenseAccepted) => {
      // check if the license is accepted or not
      if (isLicenseAccepted) {
        // set our checkboxState to true and add the term to selectedMultiTerms
        this.checkboxStates[normalizedTerm] = true;
        this.selectedMultiTerminologies.add(normalizedTerm);
      } else {
        // set our checkbox state to false (uncheck the box) & remove the term from the selected set
        this.checkboxStates[normalizedTerm] = false;
        this.selectedMultiTerminologies.delete(normalizedTerm);
      }
      // set the selected terminologies
      this.configService.setMultiSearchTerminologies(this.selectedMultiTerminologies);
      console.log(this.selectedMultiTerminologies);
    });
  }

  // Selects all terms in the multi-select dropdown
  selectAllTerms(ncimFlag = true): void {
    const checkboxes = document.getElementsByClassName('multiTermSelect');
    this.selectedMultiTerminologies.clear();
    // loop through all checkboxes and set the state based on the license
    for (let i = 0, n = checkboxes.length; i < n; i++) {
      // get the term from the checkboxes id attribute
      const term = checkboxes[i].getAttribute('id');
      // check if the license text is accepted, then perform the checkbox action
      this.appComponent.checkLicenseText(term).then((isLicenseAccepted) => {
        if (isLicenseAccepted) {
          this.checkboxStates[term] = !(!ncimFlag && term === 'ncim');
          this.selectedMultiTerminologies.add(term);
        } else {
          this.checkboxStates[term] = false;
        }
      });
    }
    this.configService.setMultiSearchTerminologies(this.selectedMultiTerminologies);
  }

  // Clears all terms in the multi-select dropdown
  clearAllTerms(): void {
    const checkboxes = document.getElementsByClassName('multiTermSelect');
    this.selectedMultiTerminologies.clear();
    for (let i = 0, n = checkboxes.length; i < n; i++) {
      const term = checkboxes[i].getAttribute('id');
      this.checkboxStates[term] = false;
    }
    this.configService.setMultiSearchTerminologies(this.selectedMultiTerminologies);
  }

}
