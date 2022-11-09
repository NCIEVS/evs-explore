import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EvsError } from '../model/evsError';
import { TreeNode } from 'primeng/api';
import { Concept } from '../model/concept';
import { ConfigurationService } from './configuration.service';

// Service for loading concept information
@Injectable()
export class ConceptDetailService {

  terminology: string = null;

  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) { }

  // Get concept with summary includes
  getConceptSummary(conceptCode: string, include: string): Observable<any> {
    return this.http.get(encodeURI('/api/v1/concept/' + this.configService.getTerminology().terminology + '/' + conceptCode + '?include=' + include),
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

  // Get the concept relationships (roles, associations, inverseRoles, inverseAssociations, and maps?)
  getRelationships(conceptCode: string) {
    return this.http.get(encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/' + conceptCode + '?include=parents,children,roles,associations,inverseRoles,inverseAssociations,disjointWith'),
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
    const url = '/api/v1/concept/' + this.configService.getTerminologyName() + '/' + code + '/subtree';
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get hierarchy data for children of specified code.
  getHierarchyChildData(code: string) {
    const url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/' + code + '/subtree/children');
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getSubsetTopLevel() {
    const url = encodeURI('/api/v1/metadata/' + this.configService.getTerminologyName() + '/subsets?include=minimal');
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getSubsetDetails(code: string) {
    const url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/subsetMembers/' + code);
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetFullDetails(code: string, fromRecord = 0, pageSize = 10, searchTerm = ""): any {
    var url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/search?include=full&subset=' + code + "&fromRecord=" + fromRecord + "&pageSize=" + pageSize);
    if (searchTerm != "")
      url += "&term=" + searchTerm;
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getSubsetExport(code: string, fromRecord = 0, pageSize = 10, searchTerm = ""): any {
    var url = encodeURI('/api/v1/concept/' + this.configService.getTerminologyName() + '/search?include=full&subset=' + code + "&fromRecord=" + fromRecord + "&pageSize=" + pageSize);
    if (searchTerm != "")
      url += "&term=" + searchTerm;
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch subset for export = '));
      })
    );
  }

  getSubsetInfo(code: string, include: string) {
    var url = encodeURI('/api/v1/metadata/' + this.configService.getTerminologyName() + '/subset/' + code + '?include=' + include);
    return this.http.get(encodeURI(url))
      .toPromise()
      .then(res => <Array<Concept>[]>res);
  }

  getRoots(terminology: string) {
    var url = '/api/v1/concept/' + this.configService.getTerminology().terminology + '/roots';
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch terminology roots = '));
      })
    );
  }

}
