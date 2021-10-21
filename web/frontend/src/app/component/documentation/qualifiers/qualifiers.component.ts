import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

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
    private configService: ConfigurationService
  ) {
    this.terminology = configService.getTerminologyName();
  }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    this.configService.getQualifiers(this.terminology)
      .subscribe(response => {
        this.qualifiers = response;
        this.qualifiers.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
      });
  }
}
