import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './../../service/loader.service';

// Component to display when loading calls (starts/stops based on subscriptions).
@Component({
  selector: 'angular-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  tracking: boolean[] = [];
  blockedDocument = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private loaderService: LoaderService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.loaderService.getLoaderSubject().subscribe(show => {
      // force hide and unblock
      if (show == null) {
        this.tracking = [];
        this.spinner.hide();
        this.blockedDocument = false;
      }
      // show and block document
      else if (show) {
        this.tracking.push(show); // push for each 'show' to keep a track of no. of requests
        this.spinner.show();
        this.blockedDocument = true;
      } else {
        // If hides are coming in after force hide, ignore them
        if (this.tracking.length > 0) {

          // pop the stack
          this.tracking.pop();
          // if fully unwound, hide
          if (this.tracking.length === 0) { // when the tracking array is empty, loader is good to go
            this.spinner.hide();
            this.blockedDocument = false;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
