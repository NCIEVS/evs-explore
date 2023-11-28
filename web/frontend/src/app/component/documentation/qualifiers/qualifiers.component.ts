import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation qualifiers component
@Component({
  selector: 'app-qualifiers',
  templateUrl: './qualifiers.component.html',
  styleUrls: ['./qualifiers.component.css']
})
export class QualifiersComponent implements OnInit {

  qualifiers: any;
  terminology: string = null;
  remodeledDesc: string = null;

  constructor(
    private configService: ConfigurationService, private titleService: Title) {
  }

  // On initialization
  ngOnInit() {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();
    this.titleService.setTitle('EVS Explore - Qualifiers');
  }

  ngAfterViewInit(): void {

    this.configService.getQualifiers(this.terminology)
      .subscribe(response => {
        this.qualifiers = response;
        this.qualifiers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }

  isRemodeled(qualifier): boolean {
    if (!qualifier.properties) {
      return false;
    }
    else {
      var remodeledProperty = qualifier.properties.filter(prop => prop.type == "remodeledDescription");
      if (remodeledProperty.length > 0) {
        this.remodeledDesc = remodeledProperty[0].value;
        this.remodeledDesc = this.remodeledDesc.replace("as a null", "as unknown");
      }
      else {
        this.remodeledDesc = null;
      }
      return remodeledProperty.length > 0;
    }
  }
}
