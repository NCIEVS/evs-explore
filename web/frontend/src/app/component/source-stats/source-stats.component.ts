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
  sourceStats: any;
  terminology: string;
  validStats: boolean = true;
  constructor(
    private configService: ConfigurationService, private titleService: Title) {
  }

  // initialization
  ngOnInit() {
    this.configService.setConfigFromPathname(window.location.pathname);
    const splitUrl = window.location.pathname.split("/");
    this.source = splitUrl[splitUrl.length - 1];
    this.terminology = this.configService.getTerminologyName();
    this.configService.getSourceStats(this.source, this.terminology)
      .subscribe(response => {
        this.sourceStats = response;
        this.validStats = (this.sourceStats.length > 0);
        var overlap = response["Source Overlap"];
      });

    this.titleService.setTitle('Source stats for ' + this.source + " in " + this.terminology);
  }
}
