import { Injectable } from '@angular/core';
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { EvsError } from '../model/evsError';
import { TreeNode } from 'primeng/api';


@Injectable()
export class ConceptDetailService {

  constructor(private http: HttpClient) { }

  getConceptDetail(conceptCode: string): Observable<any> {
    return this.http.get('/api/v1/conceptShort/' + conceptCode,
      {
        responseType: 'json'
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch concept detail data for conceptcode - ' + conceptCode));
        })
      );
  }


  getConceptDetailSimple(conceptCode: string): Observable<any> {
    return this.http.get('/api/v1/conceptShort/' + conceptCode,
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    );
  }

  getAllProperties(): Observable<any> {
    return this.http.get('/api/v1/documentation/propertiesList',
      {
        responseType: 'json',
      }
    );
  }


  getConceptRelationships(conceptCode: string) {
    return this.http.get('/api/v1/concept/' + conceptCode + '/relationships',
      {
        responseType: 'json',
        params: {
          hideLoader: "true"
        }
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch concept relationships for conceptcode - ' + conceptCode));
        })
      );
  }

  getHierarchyData(url: string) {
    return this.http.get(url)
      .toPromise()
      .then(res => <TreeNode[]>res);
  }


  getPropertyList() {
    return this.http.get('/api/v1/documentation/properties',
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch property List - '));
        })
      );
  }



  getDefinitionSources(): Observable<any> {
    return this.http.get('/api/v1/axiomQualifiersList/P378',
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch definition sources - '));
        })
      );
  }

  getSynonymSources(): Observable<any> {
    return this.http.get('/api/v1/axiomQualifiersList/P384',
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch synonym sources - '));
        })
      );
  }

  getSynonymGroups(): Observable<any> {
    return this.http.get('/api/v1/axiomQualifiersList/P383',
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch synonym groups - '));
        })
      );
  }


  getConceptList(param): Observable<any> {

    const url = '/api/v1/conceptList';
    console.log('url - ' + url);
    return this.http.get(url,
      {
        responseType: 'json',
        params: param
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Failure to get concept List results for - ' + JSON.stringify(param)));
        })
      );
  }

}
