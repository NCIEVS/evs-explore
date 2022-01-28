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
    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.terminology = terminology;
      if (this.terminology) {
        this.versionInfo = this.getTerminologyTitle() + ' - Version: ' + this.terminology.version
          + (this.terminology.date ? '; Release Date: ' + this.terminology.date : "");
        console.log(this.versionInfo)
      }
    });
  }

  getTerminologyTitle() {
    if (this.terminology.terminology == 'ncit') {
      return 'NCI Thesaurus';
    }
    else if (this.terminology.terminology == 'ncim') {
      return 'NCI Metathesaurus';
    }
    else if (this.terminology.terminology == 'mdr') {
      return 'MedDRA';
    }
    else return null;
  }

  hierarchyRoute(terminology) {
    var firstRoot = null;
    this.conceptDetail.getRoots(terminology).subscribe(response => {
      firstRoot = response[0].code;
      this.router.navigate(['/hierarchy/' + terminology + "/" + firstRoot]);
    });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
