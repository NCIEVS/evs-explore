import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TermFormData } from '../model/termFormData.model';

// Service for Terminology Suggestion Form
@Injectable({
  providedIn: 'root'
})
export class TermSuggestionFormService {

  constructor(private http: HttpClient) { }

  // Get the term form
  async getForm(formType: string): Promise<any> {
    try {
      const response = await this.http.get<any>(encodeURI('/api/v1/suggest/' + formType)).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Submit filled out form.
  async submitForm(formData: TermFormData): Promise<any> {
    try {
      const response = await this.http.post<any>(encodeURI('/api/v1/suggest'), formData).toPromise();
      return response;
    } catch (error) {
      return error;
    }
  }

}
