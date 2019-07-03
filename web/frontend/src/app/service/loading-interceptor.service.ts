import { Injectable } from '@angular/core';
import { throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

import { LoaderService } from './loader.service';
import { getBaseLocation } from './common-functions';

import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
   

    constructor (
      private loaderService: LoaderService,
       ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // Use the below two lines of code for a war file
      const url = getBaseLocation();
      // console.log("url - " + url);
      // Use the below two lines of code for a jar file
      //const url = '';
      // console.log("url - " + url);

      req = req.clone({
        url: url + req.url
      });
        this.beforeRequest(req);
        return next.handle(req).pipe(
          tap((event: HttpEvent<any>) => {
            this.onSuccess(event);
          }),
          catchError((error: any) => {
            return this.onError(error);
          })
        );
    }

    /**
     * Before any Request.
     */
    private beforeRequest(req): void {
      // Check if we need to display the loader
      let hideLoader = req.params.get("hideLoader");
      if (hideLoader !== "true") {
          this.loaderService.showLoader();
      }
    }

    /**
     * onSuccess.
     */
    private onSuccess(event: HttpEvent<any>): void {
      // if the event is for http response
      if (event instanceof HttpResponse) {
        // stop our loader here
        this.loaderService.hideLoader();
      }
    }

    /**
     * onError
     * @param error
     */
    private onError(error: any): Observable<HttpEvent<any>> {
      // if any error (not for just HttpResponse) we stop our loader bar
      this.loaderService.hideLoader();
      return observableThrowError(error);
    }
}
