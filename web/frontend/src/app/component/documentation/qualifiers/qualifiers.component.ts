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
  terminology: string = null;;

  constructor(
    private configService: ConfigurationService, private titleService: Title) {
  }

  // On initialization
  ngOnInit() {

    this.configService.setConfigFromPathname(window.location.pathname);
    this.terminology = this.configService.getTerminologyName();

    this.configService.getQualifiers(this.terminology)
      .subscribe(response => {
        this.qualifiers = response;
        this.qualifiers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
<<<<<<< .mine
    this.titleService.setTitle('EVS Explore - Qualifiers');
=======
    this.titleService.setTitle("EVS Explore - Qualifiers");
>>>>>>> .theirs
  }

  ngAfterViewInit(): void {
  }
}
