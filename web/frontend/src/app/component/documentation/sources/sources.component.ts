import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../../service/configuration.service';

// Documentation of sources component
@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css']
})
export class SourcesComponent implements OnInit {

  sources: any;

  constructor(
    private configService: ConfigurationService
  ) { }

  // On initialization
  ngOnInit() {
    // NOTE: hardcoded terminology
    // this.configService.getSources('ncit')
    //   .subscribe(response => {
    //     this.sources = response;
    //     this.sources.sort((a, b) => a.code.localeCompare(b.code, undefined, { sensitivity: 'base' }));
    //   });
  }

}
