// Service for performing search operations
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { SearchCriteria } from './../model/searchCriteria';
import { EvsError } from '../model/evsError';

// Default HTTP Options
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Service declaration
@Injectable()
export class SearchTermService {

  // Construct search term service - inject HttpClient
  constructor(private http: HttpClient) { }

  // Service for obtaining search results
  search(searchCriteria: SearchCriteria): Observable<any> {

    const url = '/api/v1/concept/search';
    console.log('perform search', url);
    const param: any = {};

    // Setup search parameters (default terminology and include, for now)
    param.terminology = searchCriteria.terminology;
    param.include = searchCriteria.include;
    param.term = searchCriteria.term;
    param.type = searchCriteria.type;

    // Paging parameters
    if (searchCriteria.fromRecord !== undefined && searchCriteria.fromRecord != null) {
      param.fromRecord = searchCriteria.fromRecord;
    }
    if (searchCriteria.pageSize !== undefined && searchCriteria.pageSize != null) {
      param.pageSize = searchCriteria.pageSize;
    }

    // Filter parameters
    if (searchCriteria.conceptStatus !== undefined && searchCriteria.conceptStatus != null
      && searchCriteria.conceptStatus.length > 0) {
      param.conceptStatus = searchCriteria.conceptStatus.join();
    }
    if (searchCriteria.definitionSource !== null && searchCriteria.definitionSource !== undefined) {
      param.definitionSource = searchCriteria.definitionSource.join();
    } else if ((searchCriteria.synonymSource !== null && searchCriteria.synonymSource !== undefined)
      || (searchCriteria.synonymTermGroup !== null && searchCriteria.synonymTermGroup !== undefined)) {
      if (searchCriteria.synonymSource !== null) {
        param.synonymSource = searchCriteria.synonymSource.join();
      }
      if (searchCriteria.synonymTermGroup !== null) {
        param.synonymTermGroup = searchCriteria.synonymTermGroup;
      }
    }
    // TODO: hierarchy search not implemented in current
    else if (searchCriteria.hierarchySearch !== null && searchCriteria.hierarchySearch !== undefined) {
      window.alert('hierarchy search not currently supported - unexpected behavior');
      param.hierarchySearch = searchCriteria.hierarchySearch;
    }

    let property = '';
    if (searchCriteria.property !== undefined && searchCriteria.property != null
      && searchCriteria.property.length > 0) {
      property = searchCriteria.property.join();
    }

    // TODO: implement this later
    // let propertyRelationship = '';
    // if (searchCriteria.relationshipProperty !== undefined && searchCriteria.relationshipProperty != null
    //   && searchCriteria.relationshipProperty.length > 0) {
    //   propertyRelationship = searchCriteria.relationshipProperty.join();
    // }
    // if (propertyRelationship !== '' && property !== '') {
    //   param.property = property + ',' + propertyRelationship;
    // }
    // if (propertyRelationship !== '' && property === '') {
    //   param.property = propertyRelationship;
    // }
    // if (propertyRelationship === '' && property !== '') {
    //   param.property = property;
    // }

    // Perform the HTTP call
    return this.http.get(url,
      {
        responseType: 'json',
        params: param
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Failure to get search results = <p> ' + error.message + "</p>"));
        })
      );
  }

}




