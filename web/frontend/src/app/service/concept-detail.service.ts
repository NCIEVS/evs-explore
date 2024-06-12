import {Injectable} from '@angular/core';
import {throwError as observableThrowError, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {EvsError} from '../model/evsError';
import {TreeNode} from 'primeng/api';
import {Concept} from '../model/concept';
import {ConfigurationService} from './configuration.service';

// Service for loading concept information
@Injectable()
export class ConceptDetailService {

  terminology: string = null;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) {
  }

  // Get concept list
  getConcepts(terminology: string, codes: string, include: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/concept/' + terminology.toLowerCase() + '?include=' + include + "&list=" + codes)
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch concepts = ' + codes));
      })
    );
  }

  // Get concept with summary includes
  getConceptSummary(conceptCode: string, include: string, limit: number = null): Observable<any> {
    return this.http.get(encodeURI('/api/v1/concept/' + this.configService.getTerminology().terminology + '/' + conceptCode + '?include=' + include
      + (limit ? '&limit=' + limit : ''))
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch concept = ' + conceptCode));
      })
    );
  }

  // Get properties
  getProperties(): Observable<any> {
    return this.http.get(encodeURI('/api/v1/metadata/' + this.configService.getTerminologyName() + '/properties'),
      {
        responseType: 'json',
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch properties'));
      })
    );

  }

  // Get hierarchy data (either paths from root, or children)
  getHierarchyData(code: string, limit: number = null) {
    const url = '/api/v1/concept/' + this.configService.getTerminologyName() + '/' + code + '/subtree'
      + (limit ? '?limit=' + limit : '');
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get hierarchy data for children of specified code.
  getHierarchyChildData(code: string, limit: number = null) {
    const url = '/api/v1/concept/' + this.configService.getTerminologyName() + '/' + code + '/subtree/children'
      + (limit ? '?limit=' + limit : '');
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getSubsetTopLevel() {
    const url = encodeURI('/api/v1/subset/' + this.configService.getTerminologyName() + '?include=minimal');
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  getSubsetMembers(code: string, fromRecord = 0, pageSize = 10, searchTerm = '', ascending = null, sort = null): any {
    var url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/search?include=full&subset=' + code + '&fromRecord=' + fromRecord + '&pageSize=' + pageSize);
    if (ascending != null) {
      url += '&ascending=' + ascending;
    }
    if (sort != null) {
      url += '&sort=' + sort;
    }
    if (searchTerm) {
      url += '&term=' + searchTerm;
    }
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetExport(code: string, fromRecord = 0, pageSize = 10, searchTerm = ''): any {
    var url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/search?include=full&subset=' + code + '&fromRecord=' + fromRecord + '&pageSize=' + pageSize);
    if (searchTerm) {
      url += '&term=' + searchTerm;
    }
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: {
          //          hideLoader: 'true'
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch subset for export = '));
      })
    );
  }

  getSubsetInfo(code: string, include: string) {
    var url = encodeURI('/api/v1/subset/' + this.configService.getTerminologyName() + "/" + code + '?include=' + include);
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetMembersDirect(code: string, include: string) {
    var url = encodeURI('/api/v1/subset/' + this.configService.getTerminologyName() + "/" + code + '/members?include=' + include);
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getRoots(terminology: string, hideLoader: boolean = false) {
    var url = '/api/v1/concept/' + this.configService.getTerminology().terminology + '/roots';
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: (hideLoader ? {
          hideLoader: 'true'
        } : {})
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch terminology roots = '));
      })
    );
  }

}
