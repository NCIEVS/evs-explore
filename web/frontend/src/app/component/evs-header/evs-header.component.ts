import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { ConceptDetailService } from 'src/app/service/concept-detail.service';
import { NavigationEnd, Router } from '@angular/router';

// Header component
@Component({
  selector: 'app-evs-header',
  templateUrl: './evs-header.component.html',
  styleUrls: ['./evs-header.component.css']
})
export class EvsHeaderComponent implements OnInit {
  versionInfo = '';
  terminology = null;
  firstRoot = '';
  private subscription = null;
  showTerminologyInfo = false;

  constructor(private http: HttpClient,
    private configService: ConfigurationService,
    private conceptService: ConceptDetailService,
    public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.url;
        this.showTerminologyInfo = !currentUrl.includes('/mappings');
      }
    });
  }


  ngOnInit() {
    this.firstRoot = null;
    this.configService.setConfigFromQuery(window.location.search);
    this.terminology = this.configService.getTerminology();
    if (this.terminology) {
      this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
        + (this.terminology.date ? '; Release Date: ' + this.terminology.date : '');
      console.log(this.versionInfo)
      if (this.terminology.metadata.hierarchy) {
        // Look up the first root code
        this.conceptService.getRoots(this.terminology.terminology, true).subscribe(response => {
          // if first root is still null then set it
          if (this.firstRoot == null && Object.values(response).length > 0) {
            this.firstRoot = response[0].code;
          }
        });
      }
    }

    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.firstRoot = null;
      this.terminology = terminology;
      if (this.terminology) {
        this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
          + (this.terminology.date ? '; Release Date: ' + this.terminology.date : '');
        console.log(this.versionInfo)

        if (this.terminology.metadata.hierarchy) {
          // Look up the first root code
          this.conceptService.getRoots(this.terminology.terminology).subscribe(response => {
            if (Object.values(response).length > 0)
              this.firstRoot = response[0].code;
          });
        }
      }
    });

  }

  // Get terminology title
  getTerminologyTitle() {
    if (this.terminology && this.terminology.metadata) {
      return this.terminology.metadata.uiLabel.replace(/\:.*/, '');
    }
  }

  // Get terminology hierarchy flag
  getTerminologyHierarchy() {
    if (this.terminology && this.terminology.metadata) {
      return this.terminology.metadata.hierarchy;
    }
  }

  // Get terminology subsets flag
  getTerminologySubset() {
    if (this.terminology && this.terminology.metadata) {
      return this.terminology.metadata.subset;
    }
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
