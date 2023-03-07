import { Injectable } from '@angular/core';
//import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';

// Service for tracking whether data is loading
@Injectable()
export class LoaderService {

  private loaderSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  // increment loader counter and show loader
  showLoader() {
    this.loaderSubject.next(true);
  }

  hideLoader() {
    this.loaderSubject.next(false);
  }

  forceHideLoader() {
    this.loaderSubject.next(null);
  }

  getLoaderSubject(): Observable<any> {
    return this.loaderSubject.asObservable();
  }
}
