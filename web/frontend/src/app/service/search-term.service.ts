// Service for performing search operations
import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { SearchCriteria } from './../model/searchCriteria';
import { EvsError } from '../model/evsError';
import { ConfigurationService } from './configuration.service';
import { saveAs } from 'file-saver';

// Default HTTP Options
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Service declaration
@Injectable()
export class SearchTermService {

  // Construct search term service - inject HttpClient
  constructor(
    private http: HttpClient,
    private configService: ConfigurationService
  ) { }

  // Service for obtaining search results
  search(searchCriteria: SearchCriteria): Observable<any> {

    const url = '/api/v1/concept/search';
    console.log('perform search', searchCriteria.toString());
    const param = this.setupSearchParams(searchCriteria);

    // Perform the HTTP call
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: param
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error,
            error.error ? error.error.message : (
              'Failure to get search results = <p> ' + error.error.message + '</p>')));
        })
      );

  }

  setupSearchParams(searchCriteria: SearchCriteria): any {
    const param: any = {};
    // Setup search parameters (default terminology and include, for now)
    param.terminology = searchCriteria.terminology;
    param.include = searchCriteria.include;
    param.term = searchCriteria.term;
    param.type = searchCriteria.type;

    // Export parameter
    if (searchCriteria.export !== undefined && searchCriteria.export != null) {
      param.export = searchCriteria.export;
    }

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
      || (searchCriteria.synonymTermType !== null && searchCriteria.synonymTermType !== undefined)) {
      if (searchCriteria.synonymSource !== null) {
        param.synonymSource = searchCriteria.synonymSource.join();
      }
      if (searchCriteria.synonymTermType !== null) {
        param.synonymTermType = searchCriteria.synonymTermType;
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
    return param;
  }

  export(searchCriteria: SearchCriteria, displayColumns: any[]): any {
    const url = '/api/v1/concept/search';
    console.log('perform export', searchCriteria.toString());
    const param = this.setupSearchParams(searchCriteria);
    param.fromRecord = searchCriteria.fromRecord;
    param.pageSize = searchCriteria.pageSize;
    param.export = true;
    param.columns = displayColumns.map(col => col.header).join(',');
    param.columns = param.columns.replace('Highlights,', ''); // until we figure out what we're doing with the highlights

    // Perform the HTTP call
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: param
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error,
            error.error ? error.error.message : (
              'Failure to get search results = <p> ' + error.error.message + '</p>')));
        })
      );
  }

}
