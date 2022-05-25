import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/service/configuration.service';
import { Title } from '@angular/platform-browser';

// Documentation overview component
// BAC - looks like not used
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  terminology: string;

  constructor(private router: Router, private configService: ConfigurationService
    , private titleService: Title
  ) { }

  ngOnInit() {
    this.titleService.setTitle("EVS Explore - Help");
    this.terminology = this.configService.getTerminologyName();
  }

  scrollToTop() {
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/overview"], { fragment: "top" }).finally(() => {
      this.router.onSameUrlNavigation = "ignore"; // Restore config after navigation completes
    });
  }
}
