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
  private defaultTerminologyName = 'ncit';

  constructor(private injector: Injector, private http: HttpClient,
    private notificationService: NotificationService,
    private cookieService: CookieService) {

    this.selectedSources = new Set<String>().add('All');

  }

  getTerminology() {
    return this.terminology;
  }

  getTerminologyName(): string {
    return this.terminology ? this.terminology.terminology : this.defaultTerminologyName;
  }

  getTerminologies(): Array<any> {
    return this.terminologies;
  }

  getDefaultTerminologyName(): string {
    return this.defaultTerminologyName;
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

  // Indicates whether current terminology is loaded from RDF (e.g. ncit)
  isRdf() {
    return this.getTerminology().metadata['loader'] == 'rdf';
  }

  // Indicates whether current terminology is loaded from RRF (e.g. ncim, mdr)
  isRrf() {
    return this.getTerminology().metadata['loader'] == 'rrf';
  }

  // Indicates whether current terminology selection is a metathesaurus or a single source
  isSingleSource() {
    return this.getTerminology().metadata['sourceCt'] == 1;
  }

  // Indicates whether current terminology selection is a metathesaurus or a single source
  isMultiSource() {
    return this.getTerminology().metadata['sourceCt'] > 1;
  }

  // Set configuration information from query params
  setConfigFromQuery(query: string) {
    console.log('set config from query params', query);
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

  // Extract configuration information from the path
  // consider the local env and the 'evsexplore' context path in deploy envs
  setConfigFromPathname(path: string) {
    console.log('set config from path', path);
    const splitPath = path.split("/");
    var pterminology;

    // Handle the /subsets/{terminology} path
    if (splitPath[splitPath.length - 2] === 'subsets') {
      // The terminology is last field
      pterminology = splitPath[splitPath.length - 1];
    }
    // otherwise handle /hierarchy/concept/{terminology}/{code}
    else {
      // The code is the last field
      this.code = splitPath[splitPath.length - 1];
      // The terminology is second-to-last field
      pterminology = splitPath[splitPath.length - 2];
    }
    var terminology = this.terminologies.filter(t =>
      t.latest && t.terminology == pterminology
      && (pterminology != 'ncit' || (t.tags && t.tags["monthly"] == "true")))[0];
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
    var term = this.getTerminologyName();

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
