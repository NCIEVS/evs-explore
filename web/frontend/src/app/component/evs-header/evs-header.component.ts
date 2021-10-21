import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../service/configuration.service';

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

  constructor(private configService: ConfigurationService) { }

  ngOnInit() {
    this.terminology = this.configService.getTerminology();
    if (this.terminology) {
      this.versionInfo = '(Version: ' + this.terminology.version
        + '; Release Date: ' + this.terminology.date + ')';
    }
    this.subscription = this.configService.getSubject().subscribe(terminology => {
      this.terminology = terminology;
      if (this.terminology) {
        this.versionInfo = '(Version: ' + this.terminology.version
          + '; Release Date: ' + this.terminology.date + ')';
      }
    });
  }


  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
