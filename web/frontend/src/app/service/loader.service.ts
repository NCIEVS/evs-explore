import { Injectable } from '@angular/core';
//import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Observable, BehaviorSubject } from 'rxjs';

// Service for tracking whether data is loading
@Injectable()
export class LoaderService {

    private loaderSubject = new BehaviorSubject<boolean>(false);

    constructor() { }

    showLoader() {
        this.loaderSubject.next(true);
    }

    hideLoader() {
        this.loaderSubject.next(false);
    }

    getLoaderSubject(): Observable<any> {
        return this.loaderSubject.asObservable();
    }
}
