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
            if (show) {
                this.tracking.push(show); // push for each 'show' to keep a track of no. of requests
                this.spinner.show();
                this.blockedDocument = true;
            } else {
                this.tracking.pop(); // pop each request out
                if (this.tracking.length === 0) { // when the tracking array is empty, loader is good to go
                    this.spinner.hide();
                    this.blockedDocument = false;
                }
            }
        });
      }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
