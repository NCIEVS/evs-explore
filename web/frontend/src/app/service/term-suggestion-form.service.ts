import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormData } from '../model/formData.model';

// Service for Terminology Suggestion Form
@Injectable({
  providedIn: 'root'
})
export class TermSuggestionFormService {

  constructor(private http: HttpClient) { }

  // Get the term form
  getForm(formType: string): Promise<any> {
    return this.http.get<any>(encodeURI('/api/v1/suggest/' + formType)).toPromise();
  }

  // Submit filled out form.
  submitForm(formData: FormData) {
    return this.http.post<any>(encodeURI('/api/v1/suggest'), formData);
  }

}
