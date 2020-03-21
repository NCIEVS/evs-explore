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

  static propertyList = null;
  static evsVersionInfo = null;
  static fullSynSources = null;
  static associations = null;

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
      this.http.get('/api/v1/metadata').toPromise()
        .then(response => {
          ConfigurationService.propertyList = response['properties'];
          ConfigurationService.evsVersionInfo = response['evsVersionInfo'];
          ConfigurationService.fullSynSources = response['fullSynSources'];
          resolve(true);
        }).catch(error => {
          resolve(false);
        });
    });
  }

  // Load associations
  getAssociations(terminology: string): Observable<any> {
    return this.http.get('/api/v1/metadata/' + terminology + '/associations?include=definitions',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/roles?include=definitions',
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
    return this.http.get('/api/v1/metadata/' + terminology + '/properties?include=definitions',
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
}
