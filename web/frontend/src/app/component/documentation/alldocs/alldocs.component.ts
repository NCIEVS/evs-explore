import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { Title } from '@angular/platform-browser';
import { LicenseTextComponent } from '../../license-text/license-text.component';

@Component({
  selector: 'app-alldocs',
  templateUrl: './alldocs.component.html',
  styleUrls: ['./alldocs.component.css']
})
export class AlldocsComponent {

  terminology = null;

  constructor(private configService: ConfigurationService, private titleService: Title, private licenseTextComponent: LicenseTextComponent) { }

  ngOnInit() {
    // if there's a valid terminology
    var pathLength = window.location.pathname.split("/").length;
    if (pathLength > 2) {
      this.terminology = window.location.pathname.split("/")[pathLength - 1];
      this.configService.setTerminology(this.configService.getTerminologyByName(this.terminology));
    }

    // default terminology in config
    else this.configService.setTerminology(this.configService.getTerminologyByName(this.configService.getDefaultTerminologyName));
  }

  ngAfterViewInit(): void {
    this.titleService.setTitle("EVS Explore - All Documentation");
    var terminology = this.configService.getTerminology();
    if (terminology.metadata.licenseText) {
      this.licenseTextComponent.checkLicenseText(terminology.terminology, terminology.metadata.licenseText);
    }
  }
}
