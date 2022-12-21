import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { ConceptDetailService } from 'src/app/service/concept-detail.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/service/loader.service';

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

  constructor(private http: HttpClient,
    private configService: ConfigurationService,
    private conceptService: ConceptDetailService,
    private loaderService: LoaderService,
    public router: Router) { }

  ngOnInit() {
    this.terminology = this.configService.getTerminology();
    if (this.terminology) {
      this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
        + (this.terminology.date ? '; Release Date: ' + this.terminology.date : "");
      console.log(this.versionInfo)
    }
    // The next part gets called automatically via the subscription
    // if (this.terminology.metadata.hierarchy) {
    //   // Look up the first root code
    //   this.conceptDetail.getRoots(this.terminology.terminology, true).subscribe(response => {
    //     this.firstRoot = response[0].code;
    //   });
    // }

    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.terminology = terminology;
      if (this.terminology) {
        this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
          + (this.terminology.date ? '; Release Date: ' + this.terminology.date : "");
        console.log(this.versionInfo)

        if (this.terminology.metadata.hierarchy) {
          this.loaderService.showLoader();
          // Look up the first root code
          this.conceptService.getRoots(this.terminology.terminology, true).subscribe(response => {
            this.firstRoot = response[0].code;
            this.loaderService.hideLoader();
          });
        }
      }
    });

  }

  // Get terminology title
  getTerminologyTitle() {
    if (this.terminology && this.terminology.metadata) {
      return this.terminology.metadata.uiLabel;
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
