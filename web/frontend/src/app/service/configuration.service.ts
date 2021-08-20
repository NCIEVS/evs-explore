import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { EvsError } from '../model/evsError';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Configuration service
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  static terminology = null;

  private static terminologyName = "ncit";

  private static instance: ConfigurationService = null;

  // Return the instance of the service
  public static getInstance(injector: Injector, http: HttpClient, notificationService: NotificationService): ConfigurationService {
    if (ConfigurationService.instance === null) {
      ConfigurationService.instance = new ConfigurationService(injector, http, notificationService);
    }
    return ConfigurationService.instance;
  }

  constructor(private injector: Injector, private http: HttpClient, private notificationService: NotificationService) {
  }

  // Load configuration
  loadConfig(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('/api/v1/metadata/terminologies').toPromise()
        .then(response => {
          // response is an array of terminologies, find the "latest" one
          var arr = response as any[];
          arr = arr.filter(t => t.latest && t.terminology == ConfigurationService.terminologyName); // filter down to latest of terminology name
          if(ConfigurationService.terminologyName == "ncit") {
            arr = arr.filter(t => t.tags && t.tags["monthly"] == "true");
          }
          else {
            arr = arr[0];
          }
          if(ConfigurationService.terminology == null){
            ConfigurationService.terminology = arr.filter(t => t.latest && t.terminology == ConfigurationService.terminologyName)[0];
          }
          console.log(ConfigurationService.terminology.tags["monthly"])
          resolve(true);
        }).catch(error => {
          resolve(false);
        });
    });
  }

  getTerminologyName(): string {
    return ConfigurationService.terminologyName;
  }

  setTerminologyName(terminology: string){
    ConfigurationService.terminologyName = terminology;
  }

  // Load associations
  getAssociations(terminology: string): Observable<any> {
    return this.http.get('/api/v1/metadata/' + terminology + '/associations?include=summary',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/roles?include=summary',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/properties?include=summary',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/qualifiers?include=summary',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/termTypes',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/synonymSources',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/synonymTypes',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/definitionSources',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/definitionTypes',
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

  getTerminologies(): Observable<any> {
    return this.http.get('/api/v1/metadata/terminologies?latest=true',
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch terminologies'));
        })
      );
  }

}
