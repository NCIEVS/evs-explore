import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Documentation overview component
// BAC - looks like not used
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // n/a
  }

  scrollToTop() {
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate(["/overview"], { fragment: "top" }).finally(() => {
      this.router.onSameUrlNavigation = "ignore"; // Restore config after navigation completes
    });
  }
}
