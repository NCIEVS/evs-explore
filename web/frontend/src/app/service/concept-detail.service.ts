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
  getConceptSummary(conceptCode: string): Observable<any> {
    // "ncit" is hardcoded
    return this.http.get('/api/v1/concept/ncit/' + conceptCode + '?include=summary',
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
    // "ncit" is hardcoded
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
    return this.http.get('/api/v1/concept/ncit/' + conceptCode + 'include=roles,associations,inverseRoles,inverseAssociations,maps',
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
  getHierarchyData(url: string) {
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }


  // getDefinitionSources(): Observable<any> {
  //   return this.http.get('/api/v1/axiomQualifiersList/P378',
  //     {
  //       responseType: 'json',
  //     }
  //   )
  //     .pipe(
  //       catchError((error) => {
  //         return observableThrowError(new EvsError(error, 'Could not fetch definition sources - '));
  //       })
  //     );
  // }

  // getSynonymSources(): Observable<any> {
  //   return this.http.get('/api/v1/axiomQualifiersList/P384',
  //     {
  //       responseType: 'json',
  //     }
  //   )
  //     .pipe(
  //       catchError((error) => {
  //         return observableThrowError(new EvsError(error, 'Could not fetch synonym sources - '));
  //       })
  //     );
  // }

  // getSynonymGroups(): Observable<any> {
  //   return this.http.get('/api/v1/axiomQualifiersList/P383',
  //     {
  //       responseType: 'json',
  //     }
  //   )
  //     .pipe(
  //       catchError((error) => {
  //         return observableThrowError(new EvsError(error, 'Could not fetch synonym groups - '));
  //       })
  //     );
  // }

  // getConcepts(param): Observable<any> {

  //   const url = '/api/v1/concept/ncit';
  //   console.log('url - ' + url);
  //   return this.http.get(url,
  //     {
  //       responseType: 'json',
  //       params: param
  //     }
  //   )
  //     .pipe(
  //       catchError((error) => {
  //         return observableThrowError(new EvsError(error, 'Failure to get concept List results for - ' + JSON.stringify(param)));
  //       })
  //     );
  // }

}
