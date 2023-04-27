import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EvsError } from '../model/evsError';
import { throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';


// Mapset service
@Injectable({
  providedIn: 'root'
})
export class MapsetService {

  constructor(private http: HttpClient) {

  }

  getMapsets(include = "minimal") {
    var url = '/api/v1/mapset?include=' + include;
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: {
          hideLoader: 'true'
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch mapsets'));
      })
    );
  }

  getMapsetByCode(code: string, include = "minimal") {
    var url = '/api/v1/mapset/' + code + '?include=' + include;
    return this.http.get(encodeURI(url),
      {
        responseType: 'json',
        params: {
          hideLoader: 'true'
        }
      }
    ).pipe(
      catchError((error) => {
        return observableThrowError(new EvsError(error, 'Could not fetch mapset for ' + code));
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

}
