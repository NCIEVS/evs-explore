import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EvsError } from '../model/evsError';
import { TreeNode } from 'primeng/api';
import { Concept } from '../model/concept';
import { ConfigurationService } from './configuration.service';
import { CookieService } from 'ngx-cookie-service';

// Service for loading concept information
@Injectable()
export class ConceptDetailService {

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService,
    private cookieService: CookieService) { }

  // Get concept with summary includes
  getConceptSummary(conceptCode: string, include: string): Observable<any> {
    return this.http.get('/api/v1/concept/' + this.cookieService.get('term') + '/' + conceptCode + '?include=' + include,
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch concept = ' + conceptCode));
      })
    );
  }

  // Get properties
  getProperties(): Observable<any> {
    return this.http.get('/api/v1/metadata/' + this.cookieService.get('term') + '/properties',
      {
        responseType: 'json',
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch properties'));
      })
    );

  }

  // Get the concept relationships (roles, associations, inverseRoles, inverseAssociations, and maps?)
  getRelationships(conceptCode: string) {
    return this.http.get('/api/v1/concept/' + this.cookieService.get('term') + '/' + conceptCode + '?include=parents,children,roles,associations,inverseRoles,inverseAssociations,disjointWith',
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch concept relationships = ' + conceptCode));
        })
      );
  }

  // Get hierarchy data (either paths from root, or children)
  getHierarchyData(code: string) {
    const url = '/api/v1/concept/' + this.cookieService.get('term') + '/' + code + '/subtree';
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get hierarchy data for children of specified code.
  getHierarchyChildData(code: string) {
    const url = '/api/v1/concept/' + this.cookieService.get('term') + '/' + code + '/subtree/children';
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getSubsetTopLevel(){
    const url = '/api/v1/metadata/' + this.cookieService.get('term') + '/subsets?include=minimal'
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getSubsetDetails(code: string){
    const url = '/api/v1/concept/' + this.cookieService.get('term') + '/subsetMembers/' + code;
    return this.http.get(url)
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetFullDetails(code: string, fromRecord = 0, pageSize = 10, searchTerm = ""){
    var url = '/api/v1/concept/' + this.cookieService.get('term') + '/search?include=full&subset=' + code + "&fromRecord=" + fromRecord + "&pageSize=" + pageSize;
    if(searchTerm != "")
      url += "&term="+searchTerm;
    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetInfo(code: string, include: string){
    var url = '/api/v1/metadata/' + this.cookieService.get('term') + '/subset/' + code + '?include=' + include;
    console.log(url)
    return this.http.get(url)
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

}
