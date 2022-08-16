import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';
import { ConceptDetailService } from 'src/app/service/concept-detail.service';
import { Router } from '@angular/router';

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
    private conceptDetail: ConceptDetailService,
    public router: Router) { }

  ngOnInit() {
    this.terminology = this.configService.getTerminology();
    if (this.terminology) {
      this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
        + (this.terminology.date ? '; Release Date: ' + this.terminology.date : "");
      console.log(this.versionInfo)
    }
    if (this.terminology.terminology != 'ncim') {
      // Look up the first root code
      this.conceptDetail.getRoots(this.terminology.terminology).subscribe(response => {
        this.firstRoot = response[0].code;
      });
    }


    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.terminology = terminology;
      if (this.terminology) {
        this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
          + (this.terminology.date ? '; Release Date: ' + this.terminology.date : "");
        console.log(this.versionInfo)

        if (this.terminology.terminology != 'ncim') {
          // Look up the first root code
          this.conceptDetail.getRoots(this.terminology.terminology).subscribe(response => {
            this.firstRoot = response[0].code;
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
