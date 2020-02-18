
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';


import { catchError, map, tap } from 'rxjs/operators';



import { SearchCriteria } from './../model/searchCriteria';


import { EvsError } from '../model/evsError';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};



@Injectable()
export class SearchTermService {
  query: string;
  queryfull: string;
  suggestQuery: string;
  constructor(private http: HttpClient
  ) { }

  // queries the elastic searh url to get the results
  getElasticMatchConcepts(searchCriteria: SearchCriteria): Observable<any> {
    // this.query = this.constructQuery.constructQuery(searchCriteria);
    const url = '/api/v1/search';
    console.log('url - ' + url);
    const param: any = {};
    param.term = searchCriteria.term;
    param.type = searchCriteria.type;

    if (searchCriteria.fromRecord !== undefined && searchCriteria.fromRecord != null) {
      param.fromRecord = searchCriteria.fromRecord;
    }
    if (searchCriteria.pageSize !== undefined && searchCriteria.pageSize != null) {
      param.pageSize = searchCriteria.pageSize;
    }

    if (searchCriteria.conceptStatuses !== undefined && searchCriteria.conceptStatuses != null
      && searchCriteria.conceptStatuses.length > 0) {
      param.conceptStatus = searchCriteria.conceptStatuses.join();
    }

    if (searchCriteria.sources !== undefined && searchCriteria.sources != null
      && searchCriteria.sources.length > 0) {
      param.synonymSource = searchCriteria.sources.join();
    }


    if (searchCriteria.definitionSource !== null && searchCriteria.definitionSource !== undefined) {
      param.definitionSource = searchCriteria.definitionSource.join();
    } else if ((searchCriteria.synonymSource !== null && searchCriteria.synonymSource !== undefined)
      || (searchCriteria.synonymGroup !== null && searchCriteria.synonymGroup !== undefined)) {
      if (searchCriteria.synonymSource !== null) {
        param.synonymSource = searchCriteria.synonymSource.join();
      }
      if (searchCriteria.synonymGroup !== null) {
        param.synonymGroup = searchCriteria.synonymGroup;
      }
    } else if (searchCriteria.hierarchySearch !== null && searchCriteria.hierarchySearch !== undefined) {
      param.hierarchySearch = searchCriteria.hierarchySearch;
    }

    let property = '';
    if (searchCriteria.property !== undefined && searchCriteria.property != null
      && searchCriteria.property.length > 0) {
      property = searchCriteria.property.join();
    }

    let propertyRelationship = '';
    if (searchCriteria.relationshipProperty !== undefined && searchCriteria.relationshipProperty != null
      && searchCriteria.relationshipProperty.length > 0) {
      propertyRelationship = searchCriteria.relationshipProperty.join();
    }



    if (propertyRelationship !== '' && property !== '') {
      param.property = property + ',' + propertyRelationship;
    }

    if (propertyRelationship !== '' && property === '') {
      param.property = propertyRelationship;
    }

    if (propertyRelationship === '' && property !== '') {
      param.property = property;
    }

    if (searchCriteria.returnProperties !== undefined && searchCriteria.returnProperties != null
      && searchCriteria.returnProperties.length > 0) {
      if (searchCriteria.returnProperties.includes('Concept_Status')) {
        param.returnProperties = searchCriteria.returnProperties.join();
      } else {
        param.returnProperties = searchCriteria.returnProperties.join() + ',Concept_Status';
      }
    }

    return this.http.get(url,
      {
        responseType: 'json',
        params: param
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Failure to get search results for - ' + JSON.stringify(searchCriteria)));
        })
      );
  }
  /*
    getElasticFullMatchConcepts(searchCriteria: SearchCriteria): Observable<any> {
      this.queryfull = this.constructQueryFull.constructFullQuery(searchCriteria);
      const url = '/concept_flat_full/concept/_search';
  
      console.log('url - ' + url);
      return this.http.post(
        url,
        this.queryfull,
        httpOptions
      ).pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch hierarchy data for url - ' + url));
        })
      );
    }
  
    getElasticSuggestions(searchCriteria: SearchCriteria) {
      const url = '/concept_flat_suggester/_search';
      this.suggestQuery = this.constructQuery.constructSuggestQuery(searchCriteria);
      console.log('url - ' + url);
      return this.http.post(
        url,
        this.suggestQuery,
        httpOptions
      ).pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch hierarchy data for url - ' + url));
        })
      );
    }*/


}




