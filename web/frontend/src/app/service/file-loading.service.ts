import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { EvsError } from '../model/evsError';

// Service for download data
// BAC: as far as I can tell, this is never used AND the endpoint called doesn't exist anymore
@Injectable({
  providedIn: 'root'
})
export class FileLoadingService {

  constructor(private http: HttpClient) { }

  getDataFromFile(fileName: string) {
    return this.http.get('/api/v1/getDataFromFile/' + fileName,
      {
        responseType: 'json',
      }
    )
      .pipe(
        catchError((error) => {
          return observableThrowError(new EvsError(error, 'Could not fetch data from file'));
        })
      );
  }

}
