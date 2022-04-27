import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { EvsError } from '../model/evsError';
import { throwError as observableThrowError, Subject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { ParamMap } from '@angular/router';

// Configuration service
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private code: string = null;
  selectedSources = null;
  private terminology = null;
  private terminologies: Array<any> = [];
  private subject: Subject<any>;
  private sources: string = null;

  constructor(private injector: Injector, private http: HttpClient,
    private notificationService: NotificationService,
    private cookieService: CookieService) {

    this.selectedSources = new Set<String>().add('All');

  }

  getTerminology() {
    return this.terminology;
  }

  getTerminologyName(): string {
    return this.terminology ? this.terminology.terminology : 'ncit';
  }

  getTerminologies(): Array<any> {
    return this.terminologies;
  }

  // filter out terminologies that shouldn't be in the list on the search page
  // mostly just the weekly ncit that's loaded
  terminologySearchListFilter(term) {
    if (term.terminology != 'ncit')
      return true;
    if (term.tags && "monthly" in term.tags && term.latest == true)
      return true;
    return false;
  }

  getTerminologyByName(name) { // reverse search terminology by short name
    var terms = this.terminologies.filter(this.terminologySearchListFilter);
    for (var term in terms) {
      if (terms[term].terminology == name) {
        return terms[term];
      }
    }
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

  getSources(): string {
    return this.sources;
  }

  setSources(sources) {
    this.cookieService.set('sources', sources);
    this.sources = sources;
  }

  isRdf() {
    return this.getTerminology().metadata['loader'] == 'rdf';
  }

  isRrf() {
    return this.getTerminology().metadata['loader'] == 'rrf';
  }

  isSingleSource() {
    return this.getTerminology().metadata['sourceCt'] == 1;
  }

  isMultiSource() {
    return this.getTerminology().metadata['sourceCt'] > 1;
  }

  setConfigFromQuery(query: string) {
    const paramMap = new URLSearchParams(query);
    if (paramMap.get('code')) {
      this.code = paramMap.get('code');
    }
    // if code is set but NOT terminology, then assume 'ncit' for backwards compat
    if (paramMap.get('terminology') || (paramMap.get('code') && !paramMap.get('terminology'))) {
      var term = (paramMap.get('code') && !paramMap.get('terminology')) ? 'ncit' : paramMap.get('terminology');
      // filter down
      var terminology = this.terminologies.filter(t =>
        t.latest && t.terminology == term
        && (term != 'ncit' || (t.tags && t.tags["monthly"] == "true")))[0];
      this.setTerminology(terminology);
    }


    if (paramMap.get('sources')) {
      paramMap.get('sources').split(',').forEach(source => {
        this.selectedSources.add(source);
      });
      if (this.selectedSources.size > 1 && this.selectedSources.has('All')) {
        this.selectedSources.delete('All');
      }
    }
  }

  setConfigFromPathname(path: string) {
    const splitPath = path.split("/");
    this.code = splitPath[3];
    var terminology = this.terminologies.filter(t =>
      t.latest && t.terminology == splitPath[2]
      && (splitPath[2] != 'ncit' || (t.tags && t.tags["monthly"] == "true")))[0];
    this.setTerminology(terminology);
  }

  getCode(): string {
    return this.code;
  }

  getSelectedSources(): Set<String> {
    return this.selectedSources;
  }

  // Load configuration - see app.module.ts - this ALWAYS runs when a page is reloaded or opened
  loadConfig(): Promise<any> {
    // Extract the cookie value on instantiation if not passed in
    var term = this.cookieService.get('term');

    // Default to "ncit" if not passed in and no cookie
    if (!term) {
      this.cookieService.set('term', 'ncit')
      term = 'ncit';
    }
    if (this.cookieService.get('sources')) {
      this.setSources(this.cookieService.get('sources'));
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
          arr = arr.filter(t => t.latest && t.terminology == term); // filter down to latest of terminology name
          if (term == 'ncit') {
            arr = arr.filter(t => t.tags && t.tags["monthly"] == "true");
          }
          this.terminology = arr[0];
          this.terminologies = response as any[];
          resolve(true);
        }).catch(error => {
          resolve(false);
        });
    });
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

  // Load term groups
  getTermGroups(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology + '/termGroups'),
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch term groups = ' + terminology));
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
