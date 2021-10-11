import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { EvsError } from '../model/evsError';
import { throwError as observableThrowError, Subject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
// Configuration service
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private terminology = null;
  private terminologies: Array<any> = [];
  private subject: Subject<any>;

  constructor(private injector: Injector, private http: HttpClient,
    private notificationService: NotificationService,
    private cookieService: CookieService) {
  }

  getTerminology() {
    return this.terminology;
  }

  getTerminologies(): Array<any> {
    return this.terminologies;
  }

  setTerminology(terminology) {
    this.terminology = terminology;
    this.cookieService.set('term', terminology.terminology);
    this.subject.next(this.terminology);
  }

  getSubject(): Subject<any> {
    return this.subject;
  }

  setSubject(subject) {
    this.subject = subject;
  }

  // Load configuration
  loadConfig(): Promise<any> {

    // Default to "ncit" if no settings
    if (this.cookieService.get('term') == "") {
      this.cookieService.set('term', 'ncit')
    }
    // defining subject object for subscription
    if (this.getSubject() == undefined) {
      this.setSubject(new Subject<any>());
    }
    return new Promise((resolve, reject) => {
      this.http.get('/api/v1/metadata/terminologies').toPromise()
        .then(response => {
          // response is an array of terminologies, find the "latest" one
          var arr = response as any[];
          arr = arr.filter(t => t.latest && t.terminology == this.cookieService.get('term')); // filter down to latest of terminology name
          if (this.cookieService.get('term') == 'ncit') {
            arr = arr.filter(t => t.tags && t.tags["monthly"] == "true");
          }
          this.terminology = arr[0];
          this.terminologies = response as any[];
          this.cookieService.set('term', this.terminology.terminology);
          resolve(true);
        }).catch(error => {
          resolve(false);
        });
    });
  }

  getTerminologyName(): string {
    return this.cookieService.get('term');
  }

  // Load associations
  getAssociations(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/associations?include=summary'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch associations = ' + terminology));
        })
      );
  }

  // Load roles
  getRoles(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/roles?include=summary'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch roles = ' + terminology));
        })
      );
  }

  // Load properties
  getProperties(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/properties?include=summary'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch properties = ' + terminology));
        })
      );
  }

  // Load qualifiers
  getQualifiers(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/qualifiers?include=summary'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch qualifiers = ' + terminology));
        })
      );
  }

  // Load term types
  getTermTypes(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/termTypes'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch term types = ' + terminology));
        })
      );
  }

  // Load synonym sources
  getSynonymSources(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/synonymSources'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch synonym sources = ' + terminology));
        })
      );
  }

  // Load synonym sources
  getSynonymTypes(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/synonymTypes'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch synonym types = ' + terminology));
        })
      );
  }

  getDefinitionSources(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/definitionSources'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch definition sources = ' + terminology));
        })
      );
  }

  getDefinitionTypes(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/definitionTypes'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch definition types = ' + terminology));
        })
      );
  }


}
