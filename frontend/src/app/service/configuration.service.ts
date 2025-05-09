import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { EvsError } from '../model/evsError';
import { throwError as observableThrowError, Subject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { TreeNode } from 'primeng/api';


// Configuration service
@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private code: string = null;
  selectedSources = null;
  terminology = null;
  private terminologies: Array<any> = [];
  private subject: Subject<any>;
  private sources: string = null;
  private defaultTerminologyName = 'ncit';
  private multiSearch = false;
  private multiSearchTerminologies: Set<string> = null;
  public subsets: TreeNode[];

  termDocs: { [key: string]: boolean | null } = {
    associations: null,
    properties: null,
    qualifiers: null,
    roles: null,
    sources: null,
    termTypes: null,
    definitionTypes: null,
    synonymTypes: null
  };

  private MAX_EXPORT_SIZE = 10000;
  private EXPORT_PAGE_SIZE = 1000;
  private hierarchyPopupStatus = false;
  private triggerHierarchyPopup = false;

  constructor(private injector: Injector, private http: HttpClient,
              private notificationService: NotificationService,
              private cookieService: CookieService) {
    this.selectedSources = new Set<string>().add('All');

  }

  getTermDoc(key: string): boolean | null {
    if (this.termDocs[key] === undefined) {
      this.termDocs[key] = null;
    }
    return this.termDocs[key];
  }

  setTermDocs() {
    var metadata = null;
    // Clear out all the term docs
    Object.keys(this.termDocs).forEach(key => this.termDocs[key] = null);

    this.getTerminologyMetadata(this.getTerminologyName()).subscribe(
      (response) => {
        metadata = response;
        this.termDocs["associations"] = metadata["associations"] !== undefined && metadata["associations"].length > 0;
        this.termDocs["properties"] = metadata["properties"] !== undefined && metadata["properties"].length > 0;
        this.termDocs["qualifiers"] = metadata["qualifiers"] !== undefined && metadata["qualifiers"].length > 0;
        this.termDocs["roles"] = metadata["roles"] !== undefined && metadata["roles"].length > 0;
        this.termDocs["sources"] = metadata["sources"] !== undefined && metadata["sources"].length > 0;
        this.termDocs["termTypes"] = metadata["termTypes"] !== undefined && metadata["termTypes"].length > 0;
        this.termDocs["definitionTypes"] = metadata["definitionTypes"] !== undefined && metadata["definitionTypes"].length > 0;
        this.termDocs["synonymTypes"] = metadata["synonymTypes"] !== undefined && metadata["synonymTypes"].length > 0;
      },
      (error) => {
        throw new Error('Error loading metadata for ' + this.getTerminologyName() + ': ' + error);
      }
    );
    
  }

  getExportPageSize() {
    return this.EXPORT_PAGE_SIZE;
  }

  getMaxExportSize() {
    return this.MAX_EXPORT_SIZE;
  }


  getRestrictedTerms() {
    const restrictedTerms = [];
    const terms = this.getMultiSearchTerminologies();
    terms.forEach(term => {
      const terminology = this.getTerminologyByName(term);
      if (terminology.metadata.licenseText) {
        restrictedTerms.push(this.getTerminologyByName(term).metadata.uiLabel.replace(/\:.*/, ""));
      }
    });
    return restrictedTerms.join(", ");
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

  getTerminologyMap(): Map<string, any> {
    const terminologyMap = new Map();
    this.terminologies.forEach(t => terminologyMap[t.terminology] = t);
    return terminologyMap;
  }

  getMetadataMap(): Map<string, any> {
    const metadataMap = new Map();
    this.terminologies.forEach(t => { metadataMap[t.terminology] = t.metadata; });
    return metadataMap;
  }

  getDefaultTerminologyName(): string {
    return this.defaultTerminologyName;
  }

  // filter out terminologies that shouldn't be in the list on the search page
  // mostly just the weekly ncit that's loaded
  terminologySearchListFilter(term, defaultTerminologyName) {
    if (term.terminology != defaultTerminologyName) {
      return true;
    }
    if (term.tags && 'monthly' in term.tags && term.latest === true) {
      return true;
    }
    return false;
  }

  getTerminologyByName(name: string) { // reverse search terminology by short name
    if (name === "multi") {
      return { terminology: "multi" };
    }
    const terms = this.terminologies.filter((term) => this.terminologySearchListFilter(term, this.defaultTerminologyName));
    for (const term in terms) {
      if (terms[term].terminology === name) {
        return terms[term];
      }
    }
  }

  setTerminology(terminology) {
    this.terminology = terminology;
    this.setTermDocs();
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

  getMultiSearchTerminologies() {
    return this.multiSearchTerminologies;
  }

  setMultiSearchTerminologies(terminologies) {
    this.multiSearchTerminologies = terminologies;
  }

  // Indicates whether current terminology is loaded from RDF (e.g. ncit)
  isRdf() {
    return this.getTerminology().metadata['loader'] === 'rdf';
  }

  // Indicates whether current terminology is loaded from RRF (e.g. ncim, mdr)
  isRrf() {
    return this.getTerminology().metadata['loader'] === 'rrf';
  }

  // Indicates whether current terminology selection is a metathesaurus or a single source
  isSingleSource() {
    return this.getTerminology().metadata['sourceCt'] === 1;
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
    // don't change terminology on multi-search
    if ((paramMap.get('terminology') != null && !this.getMultiSearch()) || (paramMap.get('code') != null && !paramMap.get('terminology'))) {
      const term = (paramMap.get('code') && !paramMap.get('terminology')) ? this.getDefaultTerminologyName() : paramMap.get('terminology');
      // filter down to latest (and optionally monthly)
      const terminology = this.terminologies.filter(t =>
        t.latest && t.terminology === term
        && (term != this.getDefaultTerminologyName() || (t.tags && t.tags['monthly'] === 'true')))[0];


      // If we are changing it, set the terminology
      if (terminology && terminology != this.terminology) {
        this.setTerminology(terminology);
      }
      // If blank, set terminology to the first one matching 'term'
      else if (!terminology) {
        const arr = this.terminologies.filter(a => a.terminology === term);
        if (!arr || arr.length === 0) {
          throw new Error('Unable to find terminology matching ' + term);
        }
        this.terminology = arr[0];
      }
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
    const splitPath = path.split('/').filter(part => part !== "evsexplore");
    splitPath
    let pterminology;

    // Handle /hierarchy/{terminology}/{code}
    // Handle concept//{terminology}/{code}
    if (splitPath[splitPath.length - 3] === 'hierarchy' ||
      splitPath[splitPath.length - 3] === 'hierarchy-popup' ||
      splitPath[splitPath.length - 3] === 'concept' ||
      splitPath[splitPath.length - 3] === 'subset'
    ) {
      // The code is the last field
      this.code = splitPath[splitPath.length - 1];
      // The terminology is second-to-last field
      pterminology = splitPath[splitPath.length - 2];
    }
    // otherwise, assume it's the last field (subsets, properties, alldocs, etc.)
    else {
      if (splitPath.length > 3) {
        pterminology = splitPath[splitPath.length - 2]
      }
      else {
        // The terminology is last field
        pterminology = splitPath[splitPath.length - 1];
      }
    }
    const terminology = this.terminologies.filter(t =>
      t.latest && t.terminology === pterminology
      && (pterminology !== this.getDefaultTerminologyName() || (t.tags && t.tags['monthly'] === 'true')))[0];

    // If we are changing it, set the terminology
    if (terminology && terminology !== this.terminology) {
      this.setTerminology(terminology);
    }
    // If blank, set terminology to the first one matching 'term'
    else if (!terminology) {
      const arr = this.terminologies.filter(a => a.terminology === pterminology);
      if (!arr || arr.length === 0) {
        throw new Error('Unable to find terminology matching ' + pterminology);
      }
      this.terminology = arr[0];
    }

  }

  getMultiSearch() {
    return this.multiSearch;
  }

  setMultiSearch(multiSearch) {
    this.multiSearch = multiSearch;
  }

  getCode(): string {
    return this.code;
  }

  getSelectedSources(): Set<string> {
    return this.selectedSources;
  }

  hasSourceStats() {
    return this.getTerminologyName() === "ncim";
  }

  // Load configuration - see app.module.ts - this ALWAYS runs when a page is reloaded or opened
  loadConfig(): Promise<any> {
    // Extract the cookie value on instantiation if not passed in
    const term = this.getTerminologyName();

    // defining subject object for subscription
    if (this.getSubject() === undefined) {
      this.setSubject(new Subject<any>());
    }
    return new Promise((resolve, reject) => {
      this.http.get('/api/v1/metadata/terminologies',
        {
          params: {
            hideLoader: 'true'
          }
        }).toPromise()
        .then(response => {
          // response is an array of terminologies, find the 'latest' one
          let arr = response as any[];
          let foundDefault = false;

          for (const returnedTerminology of arr) {

            if (returnedTerminology.terminology === this.defaultTerminologyName) {
              foundDefault = true;
            }
          }

          // Fail if there are no entries or can't find the default
          if (arr.length === 0 || !foundDefault) {
            throw new Error('Unable to find any terminologies with /metadata/terminologies or can not find ' + this.defaultTerminologyName);
          }

          // Sort terminologies by 'latest' and 'tags=monthly' and
          // pick the first one for the termniology.
          arr.sort((a, b) => {
            // Start with 'terminology'
            if (a.terminology != b.terminology) {
              return a.terminology.localeCompare(b.terminology, undefined, { sensitivity: 'base' });
            }
            // Then by 'latest'
            if (a.latest != b.latest) {
              return a.latest ? -1 : 1;
            }
            // Then by 'monthly'
            if (a.tags && a.tags.monthly === 'true' && b.tags && b.tags.monthly != 'true') {
              return -1;
            } else if (b.tags && b.tags.monthly === 'true' && a.tags && a.tags.monthly != 'true') {
              return 1;
            }
            return a.version.localeCompare(b.version, undefined, { sensitivity: 'base' });;
          });

          // Set terminologies based on this list and pick the first one
          const seen = {};
          this.terminologies = arr.filter(t => {
            let keep = false;
            if (!seen[t.terminology]) {
              seen[t.terminology] = 1;
              keep = true;
            }
            return keep;
          });

          // Set terminology to the first one matching 'term'
          arr = this.terminologies.filter(a => a.terminology === term);
          if (!arr || arr.length === 0) {
            throw new Error('Unable to find terminology matching ' + term);
          }
          this.terminology = arr[0];

          resolve(true);
        }).catch(error => {
          resolve(false);
          throw error;
        });
    });
  }

  // Load terminology metadata
  getTerminologyMetadata(terminology: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + terminology),
      {
        responseType: 'json',
        params: {
          hideLoader: 'true'
        }
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch metadata for ' + terminology));
        })
      );
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

  getWelcomeText(terminology: string) {
    var url = '/api/v1/metadata/' + terminology + '/welcomeText';
    return this.http.get(encodeURI(url),
      {
        responseType: 'text',
        params: {
          hideLoader: 'true'
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch welcome text for ' + terminology));
      })
    );
  }

  getMapsetMappings(code: string, pageSize = 10, fromRecord = 0, term = "", ascending = null, sort = null) {

    var url = '/api/v1/mapset/' + code + "/maps?pageSize=" + pageSize + "&fromRecord=" + fromRecord
    if (ascending != null) {
      url += '&ascending=' + ascending;
    }
    if (sort != null) {
      url += '&sort=' + sort;
    }
    if (term) {
      url += '&term=' + term;
    }
    return this.http.get(encodeURI(url),
      {
        responseType: 'json'
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch mapset mappings for ' + code));
      })
    );
  }

  getSourceStats(code: string, term: string) {
    const url = '/api/v1/metadata/' + term + "/stats/" + code;
    return this.http.get(encodeURI(url),
      {
        responseType: 'json'
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch mapset mappings for ' + code));
      })
    );
  }

  getHierarchyPopupStatus(): boolean {
    return this.hierarchyPopupStatus;
  }

  setHierarchyPopupStatus(status: boolean) {
    this.hierarchyPopupStatus = status;
  }

  getTriggerHierarchyPopup(): boolean {
    return this.hierarchyPopupStatus;
  }

  setTriggerHierarchyPopup(status: boolean) {
    this.hierarchyPopupStatus = status;
  }
}
