import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-alldocs',
  templateUrl: './alldocs.component.html',
  styleUrls: ['./alldocs.component.css']
})
export class AlldocsComponent {


  constructor(private configService: ConfigurationService, private titleService: Title) { }

  ngOnInit() {
    // if there's a valid terminology
    if (window.location.pathname.split("/").length > 2)
      this.configService.setTerminology(this.configService.getTerminologyByName(window.location.pathname.split("/")[2]));

    // default to ncit
    else this.configService.setTerminology(this.configService.getTerminologyByName('ncit'));
  }

  ngAfterViewInit(): void {
    this.titleService.setTitle("EVS Explore - All Documentation");

  }
}
