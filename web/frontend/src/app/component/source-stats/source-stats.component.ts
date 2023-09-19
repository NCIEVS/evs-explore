import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfigurationService } from 'src/app/service/configuration.service';

@Component({
  selector: 'app-source-stats',
  templateUrl: './source-stats.component.html',
  styleUrls: ['./source-stats.component.css']
})
export class SourceStatsComponent {

  source: any;
  terminology: string;
  constructor(
    private configService: ConfigurationService, private titleService: Title) {
  }

  // initialization
  ngOnInit() {
    this.configService.setConfigFromPathname(window.location.pathname);
    const splitUrl = window.location.pathname.split("/");
    this.source = splitUrl[splitUrl.length - 1];
    this.terminology = this.configService.getTerminologyName();

    this.titleService.setTitle('Source stats for ' + this.source + " in " + this.terminology);
  }
}
