import { Injectable } from '@angular/core';
import { throwError as observableThrowError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError} from 'rxjs/operators';

import { EvsError } from '../model/evsError';

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
