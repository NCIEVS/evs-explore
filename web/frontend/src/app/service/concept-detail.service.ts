import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EvsError } from '../model/evsError';
import { TreeNode } from 'primeng/api';

// Service for loading concept information
@Injectable()
export class ConceptDetailService {

  constructor(private http: HttpClient) { }

  // Get concept with summary includes
  getConceptSummary(conceptCode: string, include: string): Observable<any> {
    // "ncit" is hardcoded for now, read maps for concept detail
    return this.http.get('/api/v1/concept/ncit/' + conceptCode + '?include=' + include,
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
    // ncit is hardcoded
    return this.http.get('/api/v1/metadata/ncit/properties',
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
    // "ncit" is hardcoded
    return this.http.get('/api/v1/concept/ncit/' + conceptCode + '?include=parents,children,roles,associations,inverseRoles,inverseAssociations,disjointWith',
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
    const url = '/api/v1/concept/ncit/' + code + '/subtree';
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get hierarchy data for children of specified code.
  getHierarchyChildData(code: string) {
    const url = '/api/v1/concept/ncit/' + code + '/subtree/children';
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

  // Get Value Set Top Level
  getValueSetTopLevel(){
    const url = '/api/v1/metadata/ncit/subsets?include=minimal'
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }

}
